import Order from '../models/Order.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import HoneyBatch from '../models/HoneyBatch.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import Notification from '../models/Notification.js';

export async function createOrder(req, res, next) {
  try {
    const { listingId, quantityKg, deliveryAddress, notes } = req.body;

    if (!listingId || !quantityKg || Number(quantityKg) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid listing and quantity are required.' });
    }

    const listing = await MarketplaceListing.findById(listingId).populate('batch');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Marketplace listing not found.' });
    }

    const buyQty = Number(quantityKg);
    if (buyQty > listing.availableQuantityKg) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${buyQty} kg) exceeds available stock (${listing.availableQuantityKg} kg).`
      });
    }

    const count = await Order.countDocuments();
    const orderId = `ORD-2026-${String(count + 101).padStart(6, '0')}`;
    const totalAmount = Math.round(buyQty * listing.pricePerKg * 100) / 100;

    const address = deliveryAddress || {
      street: req.user.address || 'Standard Delivery Location',
      district: req.user.district,
      state: req.user.state,
      contactPhone: req.user.mobile,
    };

    const batchId = listing.batchId || listing.batch?.batchId || 'HC-IND-2026-000101';
    const batchMongoId = listing.batch?._id || listing.batch || listing._id;

    const order = await Order.create({
      orderId,
      listing: listing._id,
      batch: batchMongoId,
      batchId,
      buyer: req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      seller: listing.seller,
      sellerName: listing.sellerName,
      floralSource: listing.floralSource || 'Mustard Blossom',
      quantityKg: buyQty,
      pricePerKg: listing.pricePerKg,
      totalAmount,
      deliveryAddress: address,
      notes: notes || '',
      status: 'placed',
      statusHistory: [
        {
          status: 'placed',
          timestamp: new Date(),
          note: `Order placed by ${req.user.name} for ${buyQty} kg @ ₹${listing.pricePerKg}/kg.`,
        }
      ]
    });

    // Decrement listing quantity
    listing.availableQuantityKg -= buyQty;
    if (listing.availableQuantityKg <= 0) {
      listing.availableQuantityKg = 0;
      listing.status = 'sold_out';
    } else {
      listing.status = 'partial';
    }
    await listing.save();

    // Update batch status if fully allocated
    if (listing.batch?._id) {
      const batch = await HoneyBatch.findById(listing.batch._id);
      if (batch) {
        if (listing.status === 'sold_out') {
          batch.status = 'ordered';
        }
        await batch.save();
      }
    }

    // Append Traceability Event
    await TraceabilityEvent.create({
      batch: batchMongoId,
      batchId,
      eventType: 'ordered',
      location: `${address.district || 'National Mandi'}, ${address.state || 'India'}`,
      description: `Purchase order ${orderId} confirmed for ${buyQty} kg @ ₹${listing.pricePerKg}/kg by ${req.user.name}.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Buyer)`,
      timestamp: new Date(),
      metadata: { orderId, quantityKg: buyQty, totalAmount }
    });

    // Notify seller
    await Notification.create({
      recipient: listing.seller,
      title: `New Order Received: ${orderId}`,
      message: `${req.user.name} placed an order for ${buyQty} kg ${listing.floralSource} honey (₹${totalAmount.toLocaleString()}).`,
      type: 'order',
      relatedId: orderId,
      link: '/farmer/orders',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req, res, next) {
  try {
    const role = req.user.role;
    let filter = {};

    if (role === 'buyer') {
      filter = { buyer: req.user._id };
    } else if (role === 'farmer' || role === 'artisan') {
      filter = { seller: req.user._id };
    } else if (role === 'admin') {
      filter = {};
    } else {
      filter = { $or: [{ buyer: req.user._id }, { seller: req.user._id }] };
    }

    const orders = await Order.find(filter)
      .populate('buyer', 'name email mobile state district organization')
      .populate('seller', 'name email mobile state district organization')
      .populate('batch', 'batchId floralSource qualityGrade')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('buyer', 'name email mobile state district organization')
      .populate('seller', 'name email mobile state district organization')
      .populate('batch');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note, location } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const validStatuses = ['placed', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition.' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status} by ${req.user.name}`,
    });
    await order.save();

    // Map to Traceability events if dispatched or delivered
    const batch = await HoneyBatch.findById(order.batch);
    if (batch) {
      if (status === 'dispatched') {
        batch.status = 'dispatched';
        batch.currentLocation = location || `In Transit to ${order.deliveryAddress.district}`;
        await batch.save();

        await TraceabilityEvent.create({
          batch: batch._id,
          batchId: batch.batchId,
          eventType: 'dispatched',
          location: location || `${batch.origin.district}, ${batch.origin.state}`,
          description: `Dispatched for delivery to ${order.buyerName} at ${order.deliveryAddress.district}, ${order.deliveryAddress.state}.`,
          performedBy: req.user._id,
          actorName: `${req.user.name} (Seller / Logistics)`,
          timestamp: new Date(),
          metadata: { orderId: order.orderId }
        });
      } else if (status === 'delivered') {
        batch.status = 'delivered';
        batch.currentLocation = `${order.deliveryAddress.district}, ${order.deliveryAddress.state} (Delivered to Buyer)`;
        await batch.save();

        await TraceabilityEvent.create({
          batch: batch._id,
          batchId: batch.batchId,
          eventType: 'delivered',
          location: `${order.deliveryAddress.district}, ${order.deliveryAddress.state}`,
          description: `Delivered and received by buyer ${order.buyerName}. Final batch destination reached.`,
          performedBy: req.user._id,
          actorName: `${order.buyerName} (Verified Buyer)`,
          timestamp: new Date(),
          metadata: { orderId: order.orderId }
        });
      }
    }

    // Notify counterpart
    const targetUserId = String(req.user._id) === String(order.seller) ? order.buyer : order.seller;
    await Notification.create({
      recipient: targetUserId,
      title: `Order ${order.orderId} ${status.toUpperCase()}`,
      message: `Your order status for ${order.floralSource} honey is now: ${status}.`,
      type: 'order',
      relatedId: order.orderId,
      link: req.user.role === 'buyer' ? '/buyer/orders' : '/farmer/orders',
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function getBuyerAnalytics(req, res, next) {
  try {
    const orders = await Order.find({ buyer: req.user._id });
    
    const completedOrders = orders.filter(o => o.status === 'delivered');
    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    const totalSpent = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.totalAmount || 0) : sum, 0);
    const totalVolume = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.quantityKg || 0) : sum, 0);
    
    const floralStats = orders.reduce((acc, o) => {
      if (o.status !== 'cancelled') {
        const key = o.floralSource || 'Mustard Blossom';
        acc[key] = (acc[key] || 0) + (o.quantityKg || 0);
      }
      return acc;
    }, {});
    const topFloralSources = Object.entries(floralStats).sort((a, b) => b[1] - a[1]);

    res.json({ 
      success: true, 
      data: {
        completedOrders: completedOrders.length,
        activeOrders: activeOrders.length,
        totalSpent,
        totalVolume,
        topFloralSources,
        recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
      } 
    });
  } catch (error) {
    next(error);
  }
}
