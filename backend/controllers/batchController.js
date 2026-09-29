import WoolBatch from '../models/WoolBatch.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import QualityAssessment from '../models/QualityAssessment.js';
import Order from '../models/Order.js';
import MarketplaceListing from '../models/MarketplaceListing.js';

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
  'Bihar': 'BR',
  'West Bengal': 'WB',
  'Madhya Pradesh': 'MP',
  'Uttar Pradesh': 'UP',
  'Andhra Pradesh': 'AP',
};

const BATCH_ID_YEAR = '2026';
const BATCH_ID_START = 125;
const DUPLICATE_KEY_CODE = 11000;

async function getNextBatchId(stateCode) {
  const batchIdPattern = new RegExp(`^HC-[A-Z]{2}-${BATCH_ID_YEAR}-\\d{6}$`);
  const existingBatches = await WoolBatch.find({ batchId: { $regex: batchIdPattern } }).select('batchId').lean();
  const highestNumber = existingBatches.reduce((highest, batch) => {
    const match = batch.batchId.match(/-(\d{6})$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, BATCH_ID_START - 1);

  return `HC-${stateCode}-${BATCH_ID_YEAR}-${String(highestNumber + 1).padStart(6, '0')}`;
}

export async function createBatch(req, res, next) {
  try {
    const {
      floralSource,
      woolType,
      beeSpecies,
      hiveCount,
      quantityKg,
      harvestDate,
      shearingDate,
      state,
      district,
      village,
      farmLocation,
      color,
      initialCondition,
      moisturePercent,
      notes,
      images,
      pricePerKg
    } = req.body;

    const chosenFloral = floralSource || woolType || 'Mustard Blossom';
    const chosenDate = harvestDate || shearingDate || new Date();

    if (!quantityKg || !state || !district) {
      return res.status(400).json({ success: false, message: 'Missing required honey batch fields (quantityKg, state, district).' });
    }

    const stateCode = STATE_CODES[state] || state.slice(0, 2).toUpperCase();
    let batch;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const batchId = await getNextBatchId(stateCode);
      const blockchainHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

      try {
        batch = await WoolBatch.create({
          batchId,
          farmer: req.user._id,
          floralSource: chosenFloral,
          woolType: chosenFloral,
          beeSpecies: beeSpecies || 'Apis mellifera (European Honeybee)',
          hiveCount: Number(hiveCount) || 25,
          quantityKg: Number(quantityKg),
          origin: {
            state,
            district,
            village: village || '',
            farmLocation: farmLocation || `${district} Bee Flora & Apiary Zone`,
          },
          harvestDate: new Date(chosenDate),
          shearingDate: new Date(chosenDate),
          color: color || 'Light Amber',
          initialCondition: initialCondition || 'Raw Organic Unprocessed Honey',
          moisturePercent: Number(moisturePercent) || 17.5,
          blockchainHash,
          blockNumber: 1,
          notes: notes || '',
          images: images && images.length > 0 ? images : ['/honey-hero.jpg'],
          qualityGrade: 'Grade A+ (NMR Certified 100% Pure)',
          currentLocation: 'KVIC Honey Mandi & National Registry',
          status: 'listed',
        });
        break;
      } catch (error) {
        if (error?.code !== DUPLICATE_KEY_CODE || attempt === 4) throw error;
      }
    }

    // Automatically create a MarketplaceListing
    await MarketplaceListing.create({
      batch: batch._id,
      batchId: batch.batchId,
      seller: req.user._id,
      sellerName: req.user.name,
      floralSource: chosenFloral,
      woolType: chosenFloral,
      grade: 'Grade A+ (NMR Certified 100% Pure)',
      initialQuantityKg: Number(quantityKg),
      availableQuantityKg: Number(quantityKg),
      pricePerKg: pricePerKg ? Number(pricePerKg) : 285,
      state,
      district,
      processingStatus: initialCondition || 'Raw Organic Unprocessed',
      imageUrl: batch.images[0],
      description: notes || `${chosenFloral} raw pure honey direct from ${district}, ${state}.`,
      status: 'active',
    });

    // Record initial Genesis Block Traceability Event
    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'produced',
      location: `${district}, ${state} (Apiary)`,
      description: `Honey harvested and sealed into Honey Chain ledger by ${req.user.name}. Genesis Block sealed.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Beekeeper)`,
      timestamp: new Date(),
      metadata: {
        floralSource: chosenFloral,
        quantityKg: Number(quantityKg),
        color: color || 'Light Amber',
        blockchainHash: batch.blockchainHash,
        merkleVerified: true,
      }
    });

    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'listed',
      location: `${district}, ${state} / KVIC Mandi`,
      description: `Automatically listed on Honey Chain National Marketplace at ₹${pricePerKg ? Number(pricePerKg) : 285}/kg by ${req.user.name}.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Seller)`,
      timestamp: new Date(),
      metadata: { pricePerKg: pricePerKg ? Number(pricePerKg) : 285, quantityKg: Number(quantityKg) }
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
      return res.status(404).json({ success: false, message: 'Honey batch not found.' });
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
      return res.status(404).json({ success: false, message: 'Public honey batch record not found.' });
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
    const totalHoney = batches.reduce((sum, b) => sum + (b.quantityKg || 0), 0);
    const activeBatches = batches.filter(b => b.status !== 'sold').length;
    const listedHoney = batches
      .filter(b => b.status === 'listed')
      .reduce((sum, b) => sum + (b.quantityKg || 0), 0);

    const pendingOrdersCount = await Order.countDocuments({
      seller: farmerId,
      status: { $in: ['placed', 'confirmed', 'processing', 'dispatched'] }
    });

    res.json({
      success: true,
      data: {
        totalWoolKg: totalHoney,
        totalHoneyKg: totalHoney,
        activeBatches,
        listedWoolKg: listedHoney,
        listedHoneyKg: listedHoney,
        pendingOrders: pendingOrdersCount,
      }
    });
  } catch (error) {
    next(error);
  }
}
