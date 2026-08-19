import TraceabilityEvent from '../models/TraceabilityEvent.js';
import WoolBatch from '../models/WoolBatch.js';

export async function getTraceabilityEvents(req, res, next) {
  try {
    const { batchId } = req.params;

    let batch = null;
    if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await WoolBatch.findById(batchId);
    } else {
      batch = await WoolBatch.findOne({ batchId: batchId.toUpperCase() });
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const events = await TraceabilityEvent.find({ batch: batch._id })
      .populate('performedBy', 'name email role organization')
      .sort({ timestamp: 1 });

    res.json({
      success: true,
      data: {
        batch: {
          id: batch._id,
          batchId: batch.batchId,
          woolType: batch.woolType,
          quantityKg: batch.quantityKg,
          origin: batch.origin,
          qualityGrade: batch.qualityGrade,
          status: batch.status,
          currentLocation: batch.currentLocation,
        },
        events,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function addTraceabilityEvent(req, res, next) {
  try {
    const { batchId } = req.params;
    const { eventType, location, description, metadata } = req.body;

    let batch = null;
    if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
      batch = await WoolBatch.findById(batchId);
    } else {
      batch = await WoolBatch.findOne({ batchId: batchId.toUpperCase() });
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const event = await TraceabilityEvent.create({
      batch: batch._id,
      batchId: batch.batchId,
      eventType: eventType || 'sorted',
      location: location || batch.origin.district,
      description: description || `Traceability checkpoint updated: ${eventType}`,
      performedBy: req.user ? req.user._id : null,
      actorName: req.user ? `${req.user.name} (${req.user.role})` : 'System Registry',
      timestamp: new Date(),
      metadata: metadata || {},
    });

    if (eventType) {
      batch.status = eventType;
      batch.currentLocation = location || batch.currentLocation;
      await batch.save();
    }

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
}
