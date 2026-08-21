import ProcessingRequest from '../models/ProcessingRequest.js';
import WoolBatch from '../models/WoolBatch.js';
import User from '../models/User.js';
import TraceabilityEvent from '../models/TraceabilityEvent.js';
import Notification from '../models/Notification.js';

export async function getProcessors(req, res, next) {
  try {
    const { state, service } = req.query;
    const filter = { role: { $in: ['processor', 'artisan'] } };
    if (state) filter.state = state;

    const processors = await User.find(filter).select('-password');
    res.json({ success: true, count: processors.length, data: processors });
  } catch (error) {
    next(error);
  }
}

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

    const requests = await ProcessingRequest.find(filter)
      .populate('farmer', 'name email mobile state district')
      .populate('processor', 'name email mobile state district organization')
      .populate('batch', 'batchId woolType quantityKg qualityGrade')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
}

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
      return res.status(404).json({ success: false, message: 'Wool batch not found.' });
    }

    let processor = null;
    if (processorId) {
      processor = await User.findById(processorId);
    } else {
      processor = await User.findOne({ role: 'processor' });
    }

    if (!processor) {
      return res.status(404).json({ success: false, message: 'Designated wool processor not found.' });
    }

    const count = await ProcessingRequest.countDocuments();
    const requestId = `PR-2026-${String(count + 101).padStart(5, '0')}`;
    const qty = Number(quantityKg) || batch.quantityKg;

    const rateMap = {
      'Scouring & Carding': 18,
      'Sorting & Grading': 12,
      'Combing': 22,
      'Spinning': 35,
      'Dyeing': 28,
      'Full Processing': 65,
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
    await batch.save();

    // Create Traceability Event
    await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: 'processing_requested',
      location: `${processor.district}, ${processor.state}`,
      description: `${serviceType} request (${requestId}) submitted to ${processor.organization || processor.name}.`,
      performedBy: req.user._id,
      actorName: `${req.user.name} (Farmer)`,
      timestamp: new Date(),
      metadata: { requestId, serviceType, estimatedCost }
    });

    // Notify processor
    await Notification.create({
      recipient: processor._id,
      title: `New Processing Request: ${requestId}`,
      message: `${req.user.name} requested ${serviceType} for ${qty} kg ${batch.woolType} wool.`,
      type: 'processing',
      relatedId: requestId,
      link: '/processor/dashboard',
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
}

// Allowed status transitions for the processing workflow:
// requested -> accepted -> in_progress -> completed
// requested/accepted -> rejected
const VALID_TRANSITIONS = {
  requested: ['accepted', 'in_progress', 'rejected'],
  accepted: ['in_progress', 'rejected'],
  in_progress: ['in_progress', 'completed'],
  completed: [],
  rejected: [],
};

export async function updateProcessingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, outputNotes } = req.body;

    const allowedStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'A valid status is required.' });
    }

    const request = await ProcessingRequest.findById(id).populate('batch');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Processing request not found.' });
    }

    // Authorization: never rely on frontend role checks alone.
    // Admins may manage any processing request. Artisans/processors may
    // only update requests that are actually assigned to them.
    if (req.user.role !== 'admin') {
      if (!['artisan', 'processor'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update processing requests.' });
      }
      const assignedProcessorId = request.processor?._id ? request.processor._id.toString() : request.processor?.toString();
      if (assignedProcessorId !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'This processing request is not assigned to you.' });
      }
    }

    // Enforce valid workflow transitions (admins may still only move requests
    // forward through the defined workflow, unless already in a terminal state).
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
    if (status === 'completed') {
      request.completionDate = new Date();
    }
    await request.save();

    const batch = await WoolBatch.findById(request.batch._id);
    if (batch) {
      if (status === 'in_progress') {
        batch.status = 'in_processing';
        batch.processor = req.user._id;
        batch.currentLocation = `${req.user.organization || req.user.name} (Processing Mill)`;
        await batch.save();
      } else if (status === 'completed') {
        batch.status = 'processed';
        batch.currentLocation = `${req.user.organization || req.user.name} (Processed & Packaged)`;
        await batch.save();

        // Create Traceability Event
        await TraceabilityEvent.create({
          batch: batch._id,
          batchId: batch.batchId,
          eventType: 'processed',
          location: `${req.user.district}, ${req.user.state}`,
          description: `${request.serviceType} completed by ${req.user.organization || req.user.name}. ${outputNotes || 'Fleece scoured, carded, and prepared for high-grade textile manufacturing.'}`,
          performedBy: req.user._id,
          actorName: `${req.user.name} (Processor)`,
          timestamp: new Date(),
          metadata: { requestId: request.requestId, serviceType: request.serviceType }
        });
      }
    }

    // Notify farmer
    await Notification.create({
      recipient: request.farmer,
      title: `Processing Update: ${request.serviceType}`,
      message: `Status for batch ${request.batchId} is now: ${status.replace('_', ' ').toUpperCase()}.`,
      type: 'processing',
      relatedId: request.requestId,
      link: `/batches/${request.batchId}/traceability`,
    });

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
}
