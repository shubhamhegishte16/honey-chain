import mongoose from 'mongoose';

const processingRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WoolBatch',
    required: true,
    index: true,
  },
  batchId: {
    type: String,
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  processor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  processorName: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Scouring & Carding', 'Sorting & Grading', 'Combing', 'Spinning', 'Dyeing', 'Full Processing'],
  },
  quantityKg: {
    type: Number,
    required: true,
  },
  preferredDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'rejected'],
    default: 'requested',
    index: true,
  },
  estimatedCost: {
    type: Number,
    default: 0,
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

const ProcessingRequest = mongoose.model('ProcessingRequest', processingRequestSchema);
export default ProcessingRequest;
