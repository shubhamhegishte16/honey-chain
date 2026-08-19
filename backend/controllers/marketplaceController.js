import MarketplaceListing from '../models/MarketplaceListing.js';
import WoolBatch from '../models/WoolBatch.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';

export async function getListings(req, res, next) {
  try {
    const { woolType, grade, state, district, minPrice, maxPrice, processingStatus, search, status } = req.query;

    const query = {
      status: status || { $in: ['active', 'partial'] },
    };

    if (woolType) query.woolType = woolType;
    if (grade) query.grade = grade;
    if (state) query.state = state;
    if (district) query.district = district;
    if (processingStatus) query.processingStatus = processingStatus;

    if (minPrice || maxPrice) {
      query.pricePerKg = {};
      if (minPrice) query.pricePerKg.$gte = Number(minPrice);
      if (maxPrice) query.pricePerKg.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { woolType: searchRegex },
        { sellerName: searchRegex },
        { state: searchRegex },
        { district: searchRegex },
        { batchId: searchRegex },
      ];
    }

    const listings = await MarketplaceListing.find(query)
      .populate('seller', 'name email mobile state district organization isVerified')
      .populate('batch', 'batchId quantityKg qualityGrade color shearingDate origin')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    next(error);
  }
}

export async function getListingById(req, res, next) {
  try {
    const { id } = req.params;
    const listing = await MarketplaceListing.findById(id)
      .populate('seller', 'name email mobile state district organization isVerified')
      .populate('batch');

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    listing.views += 1;
    await listing.save();

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
}

export async function createListing(req, res, next) {
  try {
    const { batchId, pricePerKg, description, processingStatus, imageUrl } = req.body;

    if (!batchId || !pricePerKg) {
      return res.status(400).json({ success: false, message: 'Batch ID and price per kg are required.' });
    }

    let batch = null;
    if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await WoolBatch.findById(batchId);
    } else {
      batch = await WoolBatch.findOne({ batchId: batchId.toUpperCase() });
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Wool batch not found.' });
    }

    // Verify ownership
    if (String(batch.farmer) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only list your own wool batches.' });
    }

    // Check if listing already exists
    let listing = await MarketplaceListing.findOne({ batch: batch._id });
    if (listing) {
      listing.pricePerKg = Number(pricePerKg);
      listing.description = description || listing.description;
      listing.processingStatus = processingStatus || listing.processingStatus;
      listing.status = 'active';
      listing.availableQuantityKg = batch.quantityKg;
      await listing.save();
    } else {
      listing = await MarketplaceListing.create({
        batch: batch._id,
        batchId: batch.batchId,
        seller: req.user._id,
        sellerName: req.user.name,
        woolType: batch.woolType,
        grade: batch.qualityGrade || 'Grade A',
        initialQuantityKg: batch.quantityKg,
        availableQuantityKg: batch.quantityKg,
        pricePerKg: Number(pricePerKg),
        state: batch.origin.state,
        district: batch.origin.district,
        processingStatus: processingStatus || 'Raw Greasy',
        imageUrl: imageUrl || (batch.images && batch.images[0]) || '',
        description: description || batch.notes || `${batch.woolType} wool direct from ${batch.origin.district}, ${batch.origin.state}.`,
        status: 'active',
      });
    }

    batch.status = 'listed';
    batch.currentLocation = 'WoolConnect National Marketplace';
    await batch.save();

    // Create Traceability Event
    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'listed',
      location: `${batch.origin.district}, ${batch.origin.state} / Marketplace`,
      description: `Listed for sale at ₹${pricePerKg}/kg by ${req.user.name}.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Seller)`,
      timestamp: new Date(),
      metadata: { pricePerKg: Number(pricePerKg), quantityKg: batch.quantityKg }
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
}
