import ProcessingRequest from '../models/ProcessingRequest.js';
import WoolBatch from '../models/WoolBatch.js';
import User from '../models/User.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import Notification from '../models/Notification.js';

// ─── GET /api/processing/processors ─────────────────────────────────────────
export async function getProcessors(req, res, next) {
  try {
    const { state } = req.query;
    const filter = { role: { $in: ['processor', 'artisan'] } };
    if (state) filter.state = state;
    const processors = await User.find(filter).select('-password');
    res.json({ success: true, count: processors.length, data: processors });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/stats ───────────────────────────────────────────────
export async function getProcessorStats(req, res, next) {
  try {
    const processorId = req.user._id;

    const [pendingRequests, activeProcessing, completedBatches] = await Promise.all([
      ProcessingRequest.countDocuments({ processor: processorId, status: 'requested' }),
      ProcessingRequest.countDocuments({ processor: processorId, status: 'in_progress' }),
      ProcessingRequest.countDocuments({ processor: processorId, status: 'completed' }),
    ]);

    const incomingBatches = await WoolBatch.countDocuments({
      processor: processorId,
      status: 'processing_requested',
    });

    const inProgressReqs = await ProcessingRequest.find({
      processor: processorId,
      status: 'in_progress',
    }).select('quantityKg');
    const totalProcessingVolume = inProgressReqs.reduce((s, r) => s + (r.quantityKg || 0), 0);

    const completedReqs = await ProcessingRequest.find({
      processor: processorId,
      status: 'completed',
    }).select('quantityKg');
    const totalProcessedVolume = completedReqs.reduce((s, r) => s + (r.quantityKg || 0), 0);

    res.json({
      success: true,
      data: {
        pendingRequests,
        incomingBatches,
        activeProcessing,
        completedBatches,
        totalProcessingVolume,
        totalProcessedVolume,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/requests ────────────────────────────────────────────
export async function getProcessingRequests(req, res, next) {
  try {
    const role = req.user.role;
    let filter = {};

    if (role === 'processor') {
      filter = { processor: req.user._id };
    } else if (role === 'farmer') {
      filter = { farmer: req.user._id };
    } else if (role === 'admin') {
      filter = {};
    } else {
      filter = { $or: [{ farmer: req.user._id }, { processor: req.user._id }] };
    }

    if (req.query.status) filter.status = req.query.status;

    const requests = await ProcessingRequest.find(filter)
      .populate('farmer', 'name email mobile state district')
      .populate('processor', 'name email mobile state district organization')
      .populate('batch', 'batchId floralSource woolType quantityKg qualityGrade')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/incoming ────────────────────────────────────────────
export async function getIncomingBatches(req, res, next) {
  try {
    const processorId = req.user._id;
    const batches = await WoolBatch.find({
      processor: processorId,
      status: 'processing_requested',
    })
      .populate('farmer', 'name mobile state district')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: batches.length, data: batches });
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/processing/batches/:id/receive ───────────────────────────────
export async function markBatchReceived(req, res, next) {
  try {
    const { id } = req.params;
    const batch = await WoolBatch.findById(id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Honey batch not found.' });
    }
    if (String(batch.processor) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorised to receive this batch.' });
    }

    batch.status = 'in_processing';
    batch.currentLocation = `${req.user.organization || req.user.name} (Processing & Bottling Facility) — Received`;
    await batch.save();

    await ProcessingRequest.updateMany(
      { batch: batch._id, status: 'requested' },
      { $set: { status: 'accepted' } }
    );

    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'processing_received',
      location: `${req.user.district}, ${req.user.state}`,
      description: `Raw honey batch received at ${req.user.organization || req.user.name} and registered for micro-filtration and bottling.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Processing Facility)`,
      timestamp: new Date(),
      metadata: { processorId: req.user._id },
    });

    await Notification.create({
      recipient: batch.farmer,
      title: `Batch ${batch.batchId} Received at Facility`,
      message: `Your honey batch has been received by ${req.user.organization || req.user.name} and processing/bottling has commenced.`,
      type: 'processing',
      relatedId: batch.batchId,
      link: `/batches/${batch.batchId}/traceability`,
    });

    res.json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/active ──────────────────────────────────────────────
export async function getActiveProcessing(req, res, next) {
  try {
    const processorId = req.user._id;
    const requests = await ProcessingRequest.find({
      processor: processorId,
      status: 'in_progress',
    })
      .populate('farmer', 'name mobile state district')
      .populate('batch', 'batchId floralSource woolType quantityKg qualityGrade status currentLocation')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/processing/requests ───────────────────────────────────────────
export async function requestProcessing(req, res, next) {
  try {
    const { batchId, processorId, serviceType, preferredDate, notes, quantityKg } = req.body;

    if (!batchId || !serviceType) {
      return res.status(400).json({ success: false, message: 'Batch ID and service type are required.' });
    }

    let batch = null;
    if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await WoolBatch.findById(batchId);
    } else {
      batch = await WoolBatch.findOne({ batchId: batchId.toUpperCase() });
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Honey batch not found.' });
    }

    let processor = null;
    if (processorId) {
      processor = await User.findById(processorId);
    } else {
      processor = await User.findOne({ role: 'processor' });
    }

    if (!processor) {
      return res.status(404).json({ success: false, message: 'Designated honey processor not found.' });
    }

    const count = await ProcessingRequest.countDocuments();
    const requestId = `PR-2026-${String(count + 101).padStart(5, '0')}`;
    const qty = Number(quantityKg) || batch.quantityKg;

    const rateMap = {
      'Comb Extraction & Centrifugation': 15,
      'Micro-Filtration & Settling': 12,
      'Moisture Dehumidification (<18%)': 18,
      'Crystallization Control & Creaming': 20,
      'Hermetic Sterilized Bottling & QR Labelling': 25,
      'Full Apiculture Processing & Bottling': 45,
      'Scouring & Carding': 18,
      'Sorting & Grading': 12,
      'Full Processing': 45,
    };
    const estimatedCost = Math.round(qty * (rateMap[serviceType] || 20));

    const request = await ProcessingRequest.create({
      requestId,
      batch: batch._id,
      batchId: batch.batchId,
      farmer: req.user._id,
      farmerName: req.user.name,
      processor: processor._id,
      processorName: processor.organization || processor.name,
      serviceType,
      quantityKg: qty,
      preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
      notes: notes || '',
      status: 'requested',
      estimatedCost,
    });

    batch.status = 'processing_requested';
    batch.processor = processor._id;
    await batch.save();

    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'processing_requested',
      location: `${processor.district}, ${processor.state}`,
      description: `${serviceType} request (${requestId}) submitted to ${processor.organization || processor.name}.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Beekeeper)`,
      timestamp: new Date(),
      metadata: { requestId, serviceType, estimatedCost }
    });

    await Notification.create({
      recipient: processor._id,
      title: `New Processing Request: ${requestId}`,
      message: `${req.user.name} requested ${serviceType} for ${qty} kg ${batch.floralSource || batch.woolType} honey.`,
      type: 'processing',
      relatedId: requestId,
      link: '/processor/dashboard',
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
}

const VALID_TRANSITIONS = {
  requested: ['accepted', 'in_progress', 'rejected'],
  accepted: ['in_progress', 'rejected'],
  in_progress: ['in_progress', 'completed'],
  completed: [],
  rejected: [],
};

// ─── PATCH /api/processing/requests/:id/status ───────────────────────────────
export async function updateProcessingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, outputNotes, bottlesPacked } = req.body;

    const allowedStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    const request = await ProcessingRequest.findById(id).populate('batch');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Processing request not found.' });
    }

    if (req.user.role !== 'admin') {
      if (!['artisan', 'processor'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update processing requests.' });
      }
      const assignedProcessorId = request.processor?._id ? request.processor._id.toString() : request.processor?.toString();
      if (assignedProcessorId !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'This processing request is not assigned to you.' });
      }
    }

    if (status !== request.status) {
      const allowedNext = VALID_TRANSITIONS[request.status] || [];
      if (!allowedNext.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from '${request.status}' to '${status}'.`,
        });
      }
    }

    request.status = status;
    if (bottlesPacked) request.bottlesPacked = Number(bottlesPacked);
    if (status === 'completed') {
      request.completionDate = new Date();
    }
    await request.save();

    const batch = await WoolBatch.findById(request.batch._id || request.batch);
    if (batch) {
      if (status === 'in_progress') {
        batch.status = 'in_processing';
        batch.processor = req.user._id;
        batch.currentLocation = `${req.user.organization || req.user.name} (Processing Facility)`;
        await batch.save();
      } else if (status === 'completed') {
        batch.status = 'bottled';
        batch.currentLocation = `${req.user.organization || req.user.name} (Hermetically Sealed & QR Labelled Jars)`;
        await batch.save();

        await TraceabilityEvent.create({
          batch: batch._id,
          batchId: batch.batchId,
          eventType: 'processed',
          location: `${req.user.district}, ${req.user.state}`,
          description: `${request.serviceType} completed by ${req.user.organization || req.user.name}. ${outputNotes || 'Honey filtered at 50-micron, settled, and hermetically bottled with blockchain QR seal.'}`,
          performedBy: req.user._id,
          actorName: `${req.user.name} (Processor)`,
          timestamp: new Date(),
          metadata: { requestId: request.requestId, serviceType: request.serviceType, bottlesPacked: request.bottlesPacked || Math.round(batch.quantityKg * 2) }
        });
      } else if (status === 'rejected') {
        batch.status = 'quality_checked';
        batch.processor = null;
        await batch.save();
      }
    }

    await Notification.create({
      recipient: request.farmer,
      title: `Processing Update: ${request.serviceType}`,
      message: `Status for batch ${request.batchId} is now: ${status.replace(/_/g, ' ').toUpperCase()}.`,
      type: 'processing',
      relatedId: request.requestId,
      link: `/batches/${request.batchId}/traceability`,
    });

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/history ─────────────────────────────────────────────
export async function getProcessingHistory(req, res, next) {
  try {
    const processorId = req.user._id;
    const requests = await ProcessingRequest.find({
      processor: processorId,
      status: { $in: ['completed', 'rejected'] },
    })
      .populate('farmer', 'name mobile state district')
      .populate('batch', 'batchId floralSource woolType quantityKg qualityGrade')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/products ────────────────────────────────────────────
export async function getProcessedProducts(req, res, next) {
  try {
    const processorId = req.user._id;
    const batches = await WoolBatch.find({
      processor: processorId,
      status: { $in: ['processed', 'bottled', 'listed', 'ordered', 'dispatched', 'delivered', 'sold'] },
    })
      .populate('farmer', 'name mobile state district')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: batches.length, data: batches });
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/processing/batches ─────────────────────────────────────────────
export async function getProcessorBatches(req, res, next) {
  try {
    const processorId = req.user._id;
    const batches = await WoolBatch.find({ processor: processorId })
      .populate('farmer', 'name mobile state district')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: batches.length, data: batches });
  } catch (error) {
    next(error);
  }
}