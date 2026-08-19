import mongoose from 'mongoose';

const woolBatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  woolType: {
    type: String,
    required: [true, 'Wool type is required'],
    enum: ['Merino', 'Deccani', 'Marwari', 'Patanwadi', 'Chokla', 'Magra', 'Nali', 'Bikaneri', 'Crossbred', 'Other'],
    index: true,
  },
  quantityKg: {
    type: Number,
    required: [true, 'Quantity in kg is required'],
    min: [0.1, 'Quantity must be greater than 0'],
  },
  unit: {
    type: String,
    default: 'kg',
  },
  origin: {
    state: { type: String, required: true, index: true },
    district: { type: String, required: true },
    village: { type: String, default: '' },
    farmLocation: { type: String, default: '' },
  },
  shearingDate: {
    type: Date,
    required: [true, 'Shearing date is required'],
  },
  color: {
    type: String,
    enum: ['Natural White', 'Off-White', 'Cream', 'Brown', 'Black', 'Grey', 'Mixed'],
    default: 'Natural White',
  },
  initialCondition: {
    type: String,
    default: 'Raw Greasy Wool',
  },
  notes: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  qualityGrade: {
    type: String,
    enum: ['Grade A', 'Grade B', 'Grade C', 'Fine A', 'Fine B', 'Coarse A', 'Coarse B', 'Ungraded', 'Pending Inspection'],
    default: 'Pending Inspection',
  },
  qualityScore: {
    type: Number,
    default: null,
  },
  currentLocation: {
    type: String,
    default: '',
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    default: null,
  },
  processor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: [
      'produced',
      'quality_checked',
      'sorted',
      'stored',
      'processing_requested',
      'in_processing',
      'processed',
      'listed',
      'ordered',
      'dispatched',
      'delivered',
      'sold'
    ],
    default: 'produced',
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

const WoolBatch = mongoose.model('WoolBatch', woolBatchSchema);
export default WoolBatch;
