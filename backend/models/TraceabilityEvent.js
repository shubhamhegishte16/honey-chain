import mongoose from 'mongoose';

const traceabilityEventSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HoneyBatch',
    required: true,
    index: true,
  },
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'produced',
      'quality_checked',
      'sorted',
      'stored',
      'processing_requested',
      'processed',
      'listed',
      'ordered',
      'dispatched',
      'delivered'
    ],
    index: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  actorName: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const TraceabilityEvent = mongoose.model('TraceabilityEvent', traceabilityEventSchema);
export default TraceabilityEvent;
