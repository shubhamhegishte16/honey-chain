import mongoose from 'mongoose';

const trainingResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Apiary Management',
      'Hive Health & Queen Rearing',
      'Comb Extraction & Centrifugation',
      'Honey Quality & NMR Standards',
      'Moisture Control & Dehumidification',
      'Micro-Filtration & Bottling',
      'Organic Certification',
      'Flora & Seasonal Migration',
      'Mandi Trading & Fair Pricing',
      'Direct Buyer Selling',
      // Legacy compatibility
      'Sheep Management',
      'Wool Shearing',
      'Wool Handling',
      'Wool Grading',
      'Wool Storage',
      'Wool Processing',
      'Dyeing',
      'Product Development',
      'Marketing',
      'Digital Selling'
    ],
    index: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
    type: String,
    default: '12 min read',
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  keyTakeaways: [{
    type: String,
  }],
  author: {
    type: String,
    default: 'KVIC Honey Mission / National Bee Board Advisory',
  },
  tags: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 140,
  },
  youtubeUrl: {
    type: String,
    default: null,
  },
  targetProblems: [{
    type: String,
  }],
  recommendedSeasons: [{
    type: String,
  }],
  interests: [{
    type: String,
  }],
  practicalSteps: [{
    step: { type: Number },
    title: { type: String },
    description: { type: String },
    icon: { type: String }
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

const TrainingResource = mongoose.model('TrainingResource', trainingResourceSchema);
export default TrainingResource;
