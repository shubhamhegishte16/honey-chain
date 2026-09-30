import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceListing',
    required: true,
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
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerEmail: {
    type: String,
    default: '',
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
  floralSource: {
    type: String,
    default: 'Mustard Blossom',
  },
  quantityKg: {
    type: Number,
    required: true,
    min: 0.1,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: { type: String, default: '' },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, default: '' },
    contactPhone: { type: String, required: true },
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
    default: 'placed',
    index: true,
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
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

const Order = mongoose.model('Order', orderSchema);
export default Order;
