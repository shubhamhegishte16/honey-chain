import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  code: {
    type: String,
    required: true,
    unique: true,
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
    required: true,
  },
  totalCapacityKg: {
    type: Number,
    required: true,
  },
  availableCapacityKg: {
    type: Number,
    required: true,
  },
  pricePerKgMonth: {
    type: Number,
    required: true,
    default: 4,
  },
  facilities: [{
    type: String,
  }],
  isVerified: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  contactPhone: {
    type: String,
    default: '+91 98290 99881',
  },
  storageRequests: [{
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch' },
    batchId: { type: String },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    farmerName: { type: String },
    floralSource: { type: String },
    woolType: { type: String },
    quantityKg: { type: Number },
    durationMonths: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'stored', 'released'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
  }],
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

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
