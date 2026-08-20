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
    default: '15 min read',
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
    default: 'Central Wool Development Board / WoolConnect Advisory',
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
