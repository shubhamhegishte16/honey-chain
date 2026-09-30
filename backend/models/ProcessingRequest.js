import mongoose from 'mongoose';

const processingRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HoneyBatch',
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
    enum: [
      'Comb Extraction & Centrifugation',
      'Micro-Filtration & Settling',
      'Moisture Dehumidification (<18%)',
      'Crystallization Control & Creaming',
      'Hermetic Sterilized Bottling & QR Labelling',
      'Full Apiculture Processing & Bottling'
    ],
    default: 'Micro-Filtration & Settling',
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
  bottlesPacked: {
    type: Number,
    default: 0,
  },
  jarSizeGrams: {
    type: Number,
    default: 500,
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
