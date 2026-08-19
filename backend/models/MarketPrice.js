import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    index: true,
  },
  woolType: {
    type: String,
    required: true,
    index: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  changePercent: {
    type: Number,
    default: 0,
  },
  history: [{
    date: { type: String, required: true },
    price: { type: Number, required: true },
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
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

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
export default MarketPrice;
