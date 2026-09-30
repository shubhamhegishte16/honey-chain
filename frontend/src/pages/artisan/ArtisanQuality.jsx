import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Package, Sparkles, ChevronDown, ChevronUp, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { getAssignedProcessingRequests } from '../../services/processing.service';
import { submitQualityAssessment } from '../../services/quality.service';

const FIBER_OPTIONS = [
  { value: 'Excellent', labelKey: 'qualityGradeAPlus' },
  { value: 'Good', labelKey: 'qualityGradeA' },
  { value: 'Moderate', labelKey: 'qualityGradeStandard' },
  { value: 'Coarse', labelKey: 'qualityGradeB' },
];
const COLOR_OPTIONS = [
  { value: 'Consistent White', labelKey: 'qualityColorConsistentWhite' },
  { value: 'Cream White', labelKey: 'qualityColorCreamWhite' },
  { value: 'Light Yellow', labelKey: 'qualityColorLightYellow' },
  { value: 'Mixed/Stained', labelKey: 'qualityColorMixedStained' },
];
const CLEANLINESS_OPTIONS = [
  { value: 'High (Low Dust/Grease)', labelKey: 'qualityCleanlinessHigh' },
  { value: 'Medium', labelKey: 'qualityCleanlinessMedium' },
  { value: 'Low (High Vegetable Matter)', labelKey: 'qualityCleanlinessLow' },
];
const CONTAMINATION_OPTIONS = [
  { value: 'Very Low (<1%)', labelKey: 'qualityContaminationVeryLow' },
  { value: 'Low (1-3%)', labelKey: 'qualityContaminationLow' },
  { value: 'Moderate (3-6%)', labelKey: 'qualityContaminationModerate' },
  { value: 'High (>6%)', labelKey: 'qualityContaminationHigh' },
];

function Select({ label, value, onChange, options, t }) {
  return (
    <div className="mb-4">
      <label className="block font-bold text-xs uppercase tracking-wider text-deepBrown mb-1.5">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-2xl border border-border bg-warmIvory text-xs text-deepBrown focus:outline-none focus:ring-2 focus:ring-burgundy/15 focus:border-burgundy font-medium"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
      </select>
    </div>
  );
}

export default function ArtisanQuality() {
  const { t } = useLanguage();
  const location = useLocation();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [forms, setForms] = useState({});

  function formFor(batchId) {
    return forms[batchId] || {
      fiberAppearance: 'Good',
      color: 'Consistent White',
      cleanliness: 'High (Low Dust/Grease)',
      visibleContamination: 'Low (1-3%)',
      notes: '',
    };
  }

  function updateForm(batchId, field, value) {
    setForms(prev => ({ ...prev, [batchId]: { ...formFor(batchId), [field]: value } }));
  }

  async function load() {
    setLoading(true);
    const { data, error } = await getAssignedProcessingRequests();
    if (!error) {
      const queue = (data || []).filter(
        r => ['in_progress', 'completed'].includes(r.status) && r.batch?.qualityGrade === 'Pending Inspection'
      );
      setRequests(queue);
      const preselect = location.state?.batchId;
      if (preselect) {
        const match = queue.find(r => (r.batch?._id || r.batch?.id) === preselect);
        if (match) setOpenId(match.id);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(req) {
    const batchId = req.batch?._id || req.batch?.id || req.batch_id;
    setSubmittingId(req.id);
    const { error } = await submitQualityAssessment({
      batchId,
      ...formFor(batchId),
    });
    setSubmittingId(null);
    if (error) {
      toast.showError(t('somethingWrongTryAgain'));
      return;
    }
    toast.showSuccess(t('successQualityAssessmentSubmitted'));
    load();
  }

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>KVIC Laboratory Testing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('qualityAssessment')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Evaluate physical clarity, floral aroma, pollen density, and assign grade tiers.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bento-card flex flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-4 shadow-md shadow-honeyGold/10">
            <ShieldCheck size={30} />
          </div>
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('noPendingQualityAssessments')}</h3>
          <p className="text-xs text-deepBrown/70 max-w-sm mt-1">{t('allAssignedBatchesInspected')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const batchId = req.batch?._id || req.batch?.id || req.batch_id;
            const form = formFor(batchId);
            const isOpen = openId === req.id;

            return (
              <div key={req.id} className="bento-card p-6 md:p-8 space-y-4">
                <div 
                  onClick={() => setOpenId(isOpen ? null : req.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-honeyGold/20 text-burgundy shrink-0">
                      <ShieldCheck size={24} />
                    </span>
                    <div>
                      <p className="font-mono font-bold text-sm text-burgundy">Batch #{req.batch_id}</p>
                      <p className="text-xs font-bold text-deepBrown">{req.floralSource || req.wool_type || 'Raw Blossom'} Honey • {req.quantity_kg} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-honeyGold/20 text-burgundy">
                      Pending Assay
                    </span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="pt-4 border-t border-border/80 space-y-4 animate-enter">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Clarity & Refraction"
                        value={form.fiberAppearance}
                        onChange={(e) => updateForm(batchId, 'honeyAppearance', e.target.value)}
                        options={FIBER_OPTIONS}
                        t={t}
                      />
                      <Select
                        label="Color & Floral Tone"
                        value={form.color}
                        onChange={(e) => updateForm(batchId, 'color', e.target.value)}
                        options={COLOR_OPTIONS}
                        t={t}
                      />
                      <Select
                        label="Moisture & Viscosity"
                        value={form.cleanliness}
                        onChange={(e) => updateForm(batchId, 'cleanliness', e.target.value)}
                        options={CLEANLINESS_OPTIONS}
                        t={t}
                      />
                      <Select
                        label="Pollen Contamination / C4 Test"
                        value={form.visibleContamination}
                        onChange={(e) => updateForm(batchId, 'visibleContamination', e.target.value)}
                        options={CONTAMINATION_OPTIONS}
                        t={t}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs uppercase tracking-wider text-deepBrown mb-1.5">Assay Remarks</label>
                      <textarea
                        rows="2"
                        value={form.notes}
                        onChange={(e) => updateForm(batchId, 'notes', e.target.value)}
                        placeholder="Lab notes regarding floral spectrum, pollen count, or NMR signature..."
                        className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        disabled={submittingId === req.id}
                        onClick={() => handleSubmit(req)}
                        className="btn-burgundy text-xs"
                      >
                        {submittingId === req.id ? 'Minting Lab Certificate…' : 'Publish Quality Assessment Block →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
