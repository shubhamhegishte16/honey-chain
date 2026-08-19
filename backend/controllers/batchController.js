import WoolBatch from '../models/WoolBatch.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import QualityAssessment from '../models/QualityAssessment.js';
import Order from '../models/Order.js';

const STATE_CODES = {
  'Rajasthan': 'RJ',
  'Gujarat': 'GJ',
  'Maharashtra': 'MH',
  'Jammu & Kashmir': 'JK',
  'Himachal Pradesh': 'HP',
  'Uttarakhand': 'UK',
  'Karnataka': 'KA',
  'Telangana': 'TG',
  'Punjab': 'PB',
  'Haryana': 'HR',
  'Andhra Pradesh': 'AP',
};

export async function createBatch(req, res, next) {
  try {
    const { woolType, quantityKg, shearingDate, state, district, village, farmLocation, color, initialCondition, notes, images } = req.body;

    if (!woolType || !quantityKg || !shearingDate || !state || !district) {
      return res.status(400).json({ success: false, message: 'Missing required wool batch fields.' });
    }

    const stateCode = STATE_CODES[state] || state.slice(0, 2).toUpperCase();
    const count = await WoolBatch.countDocuments();
    const batchNumber = String(count + 125).padStart(6, '0');
    const batchId = `WV-${stateCode}-2026-${batchNumber}`;

    const batch = await WoolBatch.create({
      batchId,
      farmer: req.user._id,
      woolType,
      quantityKg: Number(quantityKg),
      origin: {
        state,
        district,
        village: village || '',
        farmLocation: farmLocation || `${district} Pastoral Grazing Area`,
      },
      shearingDate: new Date(shearingDate),
      color: color || 'Natural White',
      initialCondition: initialCondition || 'Raw Greasy Wool',
      notes: notes || '',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=60'],
      qualityGrade: 'Pending Inspection',
      currentLocation: `${district}, ${state} (Farmer Farm)`,
      status: 'produced',
    });

    // Record initial Traceability Event
    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'produced',
      location: `${district}, ${state}`,
      description: `Wool sheared and batch recorded on WoolConnect ledger by ${req.user.name}.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Farmer)`,
      timestamp: new Date(),
      metadata: {
        woolType,
        quantityKg: Number(quantityKg),
        color: color || 'Natural White',
      }
    });

    res.status(201).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFarmerBatches(req, res, next) {
  try {
    const farmerId = req.user.role === 'admin' && req.query.farmerId ? req.query.farmerId : req.user._id;
    const filter = req.user.role === 'admin' && !req.query.farmerId ? {} : { farmer: farmerId };

    const batches = await WoolBatch.find(filter)
      .populate('farmer', 'name email mobile state district')
      .populate('warehouse', 'name code state district')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: batches });
  } catch (error) {
    next(error);
  }
}

export async function getBatchById(req, res, next) {
  try {
    const { id } = req.params;
    let batch = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await WoolBatch.findById(id)
        .populate('farmer', 'name email mobile state district organization')
        .populate('warehouse', 'name code state district facilities address')
        .populate('processor', 'name organization mobile state district');
    } else {
      batch = await WoolBatch.findOne({ batchId: id.toUpperCase() })
        .populate('farmer', 'name email mobile state district organization')
        .populate('warehouse', 'name code state district facilities address')
        .populate('processor', 'name organization mobile state district');
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Wool batch not found.' });
    }

    const quality = await QualityAssessment.findOne({ batch: batch._id });
    const events = await TraceabilityEvent.find({ batch: batch._id }).sort({ timestamp: 1 });

    res.json({
      success: true,
      data: {
        ...batch.toJSON(),
        qualityAssessment: quality,
        traceabilityEvents: events,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicBatch(req, res, next) {
  try {
    const { batchId } = req.params;
    let batch = null;

    if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await WoolBatch.findById(batchId)
        .populate('farmer', 'name email mobile state district organization isVerified')
        .populate('warehouse', 'name code state district')
        .populate('processor', 'name organization');
    } else {
      batch = await WoolBatch.findOne({ batchId: batchId.toUpperCase() })
        .populate('farmer', 'name email mobile state district organization isVerified')
        .populate('warehouse', 'name code state district')
        .populate('processor', 'name organization');
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Public wool batch record not found.' });
    }

    const quality = await QualityAssessment.findOne({ batch: batch._id });
    const events = await TraceabilityEvent.find({ batch: batch._id }).sort({ timestamp: 1 });

    res.json({
      success: true,
      data: {
        ...batch.toJSON(),
        qualityAssessment: quality,
        traceabilityEvents: events,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getFarmerStats(req, res, next) {
  try {
    const farmerId = req.user._id;

    const batches = await WoolBatch.find({ farmer: farmerId });
    const totalWool = batches.reduce((sum, b) => sum + (b.quantityKg || 0), 0);
    const activeBatches = batches.filter(b => b.status !== 'sold').length;
    const listedWool = batches
      .filter(b => b.status === 'listed')
      .reduce((sum, b) => sum + (b.quantityKg || 0), 0);

    const pendingOrdersCount = await Order.countDocuments({
      seller: farmerId,
      status: { $in: ['placed', 'confirmed', 'processing', 'dispatched'] }
    });

    res.json({
      success: true,
      data: {
        totalWoolKg: totalWool,
        activeBatches,
        listedWoolKg: listedWool,
        pendingOrders: pendingOrdersCount,
      }
    });
  } catch (error) {
    next(error);
  }
}
