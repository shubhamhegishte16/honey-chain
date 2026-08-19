import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WoolBatch',
    required: true,
    index: true,
  },
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  woolType: {
    type: String,
    required: true,
    index: true,
  },
  grade: {
    type: String,
    default: 'Grade A',
  },
  initialQuantityKg: {
    type: Number,
    required: true,
    min: 0.1,
  },
  availableQuantityKg: {
    type: Number,
    required: true,
    min: 0,
  },
  pricePerKg: {
    type: Number,
    required: true,
    min: 1,
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
  processingStatus: {
    type: String,
    enum: ['Raw Greasy', 'Scoured', 'Carded', 'Graded & Sorted', 'Semi-Processed'],
    default: 'Raw Greasy',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'partial', 'sold_out', 'inactive'],
    default: 'active',
    index: true,
  },
  views: {
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

const MarketplaceListing = mongoose.model('MarketplaceListing', marketplaceListingSchema);
export default MarketplaceListing;
