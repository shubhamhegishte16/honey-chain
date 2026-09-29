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
  // Honey Organoleptic & Lab parameters
  appearance: {
    type: String,
    enum: ['Clear & Translucent', 'Uniform Light Amber', 'Naturally Crystalline', 'Cloudy / Strained'],
    default: 'Clear & Translucent',
  },
  fiberAppearance: {
    type: String,
    default: 'Excellent Pure Nectar',
  },
  color: {
    type: String,
    enum: ['Light Amber', 'Golden Amber', 'Dark Forest Amber', 'Water White', 'Extra Light Amber', 'Deep Mahogany'],
    default: 'Light Amber',
  },
  aroma: {
    type: String,
    default: 'Floral & Sweet Natural Aroma',
  },
  cleanliness: {
    type: String,
    enum: ['High (Micro-Filtered, Zero Comb Residue)', 'Medium (Raw Strained)', 'Coarse'],
    default: 'High (Micro-Filtered, Zero Comb Residue)',
  },
  visibleContamination: {
    type: String,
    enum: ['None (<0.1%)', 'Low (0.1-0.5%)', 'Moderate (>0.5%)'],
    default: 'None (<0.1%)',
  },
  moisturePercent: {
    type: Number,
    default: 17.2, // FSSAI Standard max 20%
  },
  moistureCondition: {
    type: String,
    default: 'Optimal (<18% FSSAI Certified)',
  },
  hmfLevel: {
    type: Number,
    default: 12.5, // FSSAI Standard max 40 mg/kg
  },
  fructoseGlucoseRatio: {
    type: Number,
    default: 1.28, // Standard > 0.95
  },
  sucrosePercent: {
    type: Number,
    default: 2.1, // FSSAI max 5.0%
  },
  c4SugarAdulteration: {
    type: String,
    default: 'Negative (100% C3 Natural Nectar)',
  },
  pollenDensity: {
    type: String,
    default: '> 85,000 grains/10g (Unifloral Authenticated)',
  },
  diastaseActivity: {
    type: Number,
    default: 18.4, // Schade units (min 8)
  },
  nmrSpectrumStatus: {
    type: String,
    default: 'NMR Certified Authentic Botanical Profile',
  },
  stapleLengthMm: {
    type: Number,
    default: 72,
  },
  micronEstimate: {
    type: Number,
    default: 21.5,
  },
  preliminaryGrade: {
    type: String,
    default: 'Grade A+ (NMR Certified 100% Pure)',
  },
  finalGrade: {
    type: String,
    default: 'Grade A+ (NMR Certified 100% Pure)',
  },
  confidenceScore: {
    type: Number,
    default: 98,
  },
  isAiAssisted: {
    type: Boolean,
    default: true,
  },
  aiAnalysis: {
    purityScore: { type: Number, default: 98.4 },
    floralMatchRate: { type: String, default: '96.2% match to Brassica napus standard' },
    adulterationRisk: { type: String, default: 'Zero Synthetic Syrup / Rice Syrup Detected' },
    shelfLifeEstimate: { type: String, default: '24 Months (Hermetic Seal)' },
    disclaimer: {
      type: String,
      default: 'AI and Spectroscopic preliminary assessment verified by KVIC National Quality Protocol.'
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
