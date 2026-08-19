import mongoose from 'mongoose';

const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  role: {
    type: String,
    default: 'farmer',
  },
  state: {
    type: String,
    required: true,
    index: true,
  },
  district: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: '',
  },
  woolTypes: [{
    type: String,
  }],
  annualProductionKg: {
    type: Number,
    default: 850,
  },
  flockSize: {
    type: Number,
    default: 120,
  },
  breeds: [{
    type: String,
  }],
  specialty: {
    type: String,
    default: 'Fine apparel fleece',
  },
  isVerified: {
    type: Boolean,
    default: true,
    index: true,
  },
  contactEmail: {
    type: String,
    default: '',
  },
  contactPhone: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 4.8,
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

const Producer = mongoose.model('Producer', producerSchema);
export default Producer;
