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
  honeyVarieties: [{
    type: String,
  }],
  annualProductionKg: {
    type: Number,
    default: 1200,
  },
  hiveCount: {
    type: Number,
    default: 80,
  },
  beeSpecies: [{
    type: String,
  }],
  specialty: {
    type: String,
    default: 'Pure Mustard Blossom & Kashmir Acacia Raw Honey',
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
    default: 4.9,
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
