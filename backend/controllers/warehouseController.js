import Warehouse from '../models/Warehouse.js';
import HoneyBatch from '../models/HoneyBatch.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import Notification from '../models/Notification.js';

export async function getWarehouses(req, res, next) {
  try {
    const { state, minCapacity } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (minCapacity) filter.availableCapacityKg = { $gte: Number(minCapacity) };

    const warehouses = await Warehouse.find(filter)
      .populate('manager', 'name email mobile')
      .sort({ rating: -1 });

    res.json({ success: true, count: warehouses.length, data: warehouses });
  } catch (error) {
    next(error);
  }
}

export async function getWarehouseById(req, res, next) {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id).populate('manager', 'name email mobile');
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    }
    res.json({ success: true, data: warehouse });
  } catch (error) {
    next(error);
  }
}

export async function requestStorage(req, res, next) {
  try {
    const { warehouseId, batchId, quantityKg, durationMonths, notes } = req.body;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    }

    let batch = null;
    if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await HoneyBatch.findById(batchId);
    } else {
      batch = await HoneyBatch.findOne({ batchId: batchId.toUpperCase() });
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Honey batch not found.' });
    }

    const qty = Number(quantityKg) || batch.quantityKg;

    warehouse.storageRequests.push({
      batch: batch._id,
      batchId: batch.batchId,
      farmer: req.user._id,
      farmerName: req.user.name,
      floralSource: batch.floralSource,
      quantityKg: qty,
      durationMonths: Number(durationMonths) || 1,
      status: 'pending',
      requestedAt: new Date(),
    });
    await warehouse.save();

    // Notify warehouse manager if assigned
    if (warehouse.manager) {
      await Notification.create({
        recipient: warehouse.manager,
        title: `New Honey Storage Request: ${batch.batchId}`,
        message: `${req.user.name} requested storage for ${qty} kg ${batch.floralSource} honey.`,
        type: 'storage',
        relatedId: batch.batchId,
        link: '/warehouse/dashboard',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Storage request submitted successfully.',
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStorageStatus(req, res, next) {
  try {
    const { warehouseId, requestId, status, bay } = req.body;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    }

    const reqItem = warehouse.storageRequests.id(requestId);
    if (!reqItem) {
      return res.status(404).json({ success: false, message: 'Storage request item not found.' });
    }

    reqItem.status = status;
    await warehouse.save();

    if (status === 'accepted' || status === 'stored') {
      const batch = await HoneyBatch.findById(reqItem.batch);
      if (batch) {
        batch.status = 'stored';
        batch.warehouse = warehouse._id;
        batch.currentLocation = `${warehouse.name}, ${warehouse.district}, ${warehouse.state}`;
        await batch.save();

        warehouse.availableCapacityKg = Math.max(0, warehouse.availableCapacityKg - reqItem.quantityKg);
        await warehouse.save();

        // Create Traceability event
        await TraceabilityEvent.create({
          batch: batch._id,
          batchId: batch.batchId,
          eventType: 'stored',
          location: `${warehouse.name}, ${warehouse.district}`,
          description: `Stored in certified cold storage & moisture-controlled warehouse (${warehouse.code}${bay ? `, Bay ${bay}` : ''}) at rate ₹${warehouse.pricePerKgMonth}/kg/month.`,
          performedBy: req.user._id,
          actorName: `${req.user.name} (Warehouse Staff)`,
          timestamp: new Date(),
          metadata: { warehouse: warehouse.name, warehouseCode: warehouse.code, bay: bay || 'Main Bay' }
        });

        // Notify farmer
        await Notification.create({
          recipient: reqItem.farmer,
          title: `Storage Request Accepted: ${batch.batchId}`,
          message: `${warehouse.name} has accepted and allocated secure storage for honey lot ${batch.batchId}.`,
          type: 'storage',
          relatedId: batch.batchId,
          link: `/batches/${batch.batchId}/details`,
        });
      }
    }

    res.json({ success: true, data: warehouse });
  } catch (error) {
    next(error);
  }
}
