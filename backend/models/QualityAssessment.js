import mongoose from 'mongoose';

const qualityAssessmentSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WoolBatch',
    required: true,
    index: true,
  },
  assessedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  fiberAppearance: {
    type: String,
    enum: ['Excellent', 'Good', 'Moderate', 'Coarse'],
    default: 'Good',
  },
  color: {
    type: String,
    enum: ['Consistent White', 'Cream White', 'Light Yellow', 'Mixed/Stained'],
    default: 'Consistent White',
  },
  cleanliness: {
    type: String,
    enum: ['High (Low Dust/Grease)', 'Medium', 'Low (High Vegetable Matter)'],
    default: 'High (Low Dust/Grease)',
  },
  visibleContamination: {
    type: String,
    enum: ['Very Low (<1%)', 'Low (1-3%)', 'Moderate (3-6%)', 'High (>6%)'],
    default: 'Low (1-3%)',
  },
  moistureCondition: {
    type: String,
    enum: ['Optimal (<14%)', 'Normal (14-16%)', 'Slightly Moist (16-18%)', 'Damp (>18%)'],
    default: 'Optimal (<14%)',
  },
  stapleLengthMm: {
    type: Number,
    default: 65,
  },
  micronEstimate: {
    type: Number,
    default: 22.5,
  },
  preliminaryGrade: {
    type: String,
    default: 'Grade A',
  },
  finalGrade: {
    type: String,
    default: 'Grade A',
  },
  confidenceScore: {
    type: Number,
    default: 88,
  },
  isAiAssisted: {
    type: Boolean,
    default: false,
  },
  aiAnalysis: {
    crimpDensity: { type: String, default: 'High (8-10 crimps/cm)' },
    vegetableMatterPercent: { type: Number, default: 1.4 },
    colorUniformityPercent: { type: Number, default: 94 },
    tensileStrengthEstimate: { type: String, default: 'Strong (>30 N/ktex)' },
    disclaimer: {
      type: String,
      default: 'AI-assisted preliminary assessment. Final grading requires authorized assessment.'
    }
  },
  notes: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
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

const QualityAssessment = mongoose.model('QualityAssessment', qualityAssessmentSchema);
export default QualityAssessment;
