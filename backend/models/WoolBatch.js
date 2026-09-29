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
  floralSource: {
    type: String,
    default: 'Mustard Blossom',
    index: true,
  },
  // Dual-compatibility field for existing wool references
  woolType: {
    type: String,
    default: function() { return this.floralSource || 'Mustard Blossom'; },
    index: true,
  },
  beeSpecies: {
    type: String,
    default: 'Apis mellifera (European Honeybee)',
  },
  hiveCount: {
    type: Number,
    default: 25,
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
  harvestDate: {
    type: Date,
    default: Date.now,
  },
  shearingDate: {
    type: Date,
    default: function() { return this.harvestDate || Date.now(); },
  },
  color: {
    type: String,
    enum: ['Light Amber', 'Golden Amber', 'Dark Forest Amber', 'Water White', 'Extra Light Amber', 'Deep Mahogany', 'Mixed'],
    default: 'Light Amber',
  },
  initialCondition: {
    type: String,
    default: 'Raw Organic Unprocessed Honey',
  },
  moisturePercent: {
    type: Number,
    default: 17.5, // FSSAI safe threshold < 20%
  },
  hmfLevel: {
    type: Number,
    default: 12.4, // FSSAI threshold < 40 mg/kg
  },
  pollenProfile: {
    type: String,
    default: 'Unifloral Brassica napus > 78%',
  },
  blockchainHash: {
    type: String,
    default: function() {
      return `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
    },
  },
  blockNumber: {
    type: Number,
    default: 1,
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
    default: 'Grade A+ (NMR Certified 100% Pure)',
  },
  qualityScore: {
    type: Number,
    default: 94,
  },
  currentLocation: {
    type: String,
    default: 'KVIC Honey Collection & Mandi Registry',
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
      'bottled',
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
      if (!ret.floralSource && ret.woolType) ret.floralSource = ret.woolType;
      if (!ret.woolType && ret.floralSource) ret.woolType = ret.floralSource;
      if (!ret.harvestDate && ret.shearingDate) ret.harvestDate = ret.shearingDate;
      if (!ret.shearingDate && ret.harvestDate) ret.shearingDate = ret.harvestDate;
      delete ret.__v;
      return ret;
    }
  }
});

const WoolBatch = mongoose.model('WoolBatch', woolBatchSchema);
export default WoolBatch;
