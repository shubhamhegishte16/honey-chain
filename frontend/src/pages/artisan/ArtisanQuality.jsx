import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Package, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { getAssignedProcessingRequests } from '../../services/processing.service';
import { submitQualityAssessment } from '../../services/quality.service';

// Option `value` is the actual stored data value (kept in English so existing
// records / backend contracts are unaffected). `labelKey` is the translation
// key used only for the visible label shown to the user.
const FIBER_OPTIONS = [
  { value: 'Excellent', labelKey: 'qualityFiberExcellent' },
  { value: 'Good', labelKey: 'qualityFiberGood' },
  { value: 'Moderate', labelKey: 'qualityFiberModerate' },
  { value: 'Coarse', labelKey: 'qualityFiberCoarse' },
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
      <label className="block font-semibold text-sm text-textPrimary mb-1.5">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full min-h-[48px] rounded-xl border border-border/90 bg-surface px-3.5 py-2 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(req) {
    const batchId = req.batch?._id || req.batch?.id;
    if (!batchId) return;
    const form = formFor(req.id);
    setSubmittingId(req.id);
    const { error } = await submitQualityAssessment({
      batchId,
      ...form,
      isAiAssisted: false,
    });
    setSubmittingId(null);
    if (error) {
      toast.showError(t('somethingWrongTryAgain'));
      return;
    }
    toast.showSuccess(t('successProcessingUpdated'));
    setOpenId(null);
    load();
  }

  return (
    <main className="page-shell">
      <div className="mb-6">
        <div className="eyebrow text-primary mb-1">
          <Sparkles size={13} /> {t('quality')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
          {t('qualityObservationTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-textSecondary mt-1 max-w-xl">{t('qualityObservationHelp')}</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-10 sm:p-16 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primaryLight text-primary mb-4 shadow-sm">
            <ShieldCheck size={32} />
          </span>
          <h3 className="font-bold text-lg text-textPrimary">{t('noQualityQueue')}</h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1">{t('noQualityQueueHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => {
            const isOpen = openId === req.id;
            const form = formFor(req.id);
            return (
              <Card key={req.id}>
                <button
                  className="w-full flex items-center justify-between gap-3"
                  onClick={() => setOpenId(isOpen ? null : req.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-800 shrink-0">
                      <Package size={20} />
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-sm text-textPrimary">{req.batch_id}</p>
                      <p className="text-xs text-textSecondary font-medium">{req.service_type} • {req.quantity_kg} kg</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                    {t('qualityStatusPending')}
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-5 pt-5 border-t border-border/60">
                    <Select
                      label={t('fibreConditionLabel')}
                      value={form.fiberAppearance}
                      onChange={e => updateForm(req.id, 'fiberAppearance', e.target.value)}
                      options={FIBER_OPTIONS}
                      t={t}
                    />
                    <Select
                      label={t('colourConsistencyLabel')}
                      value={form.color}
                      onChange={e => updateForm(req.id, 'color', e.target.value)}
                      options={COLOR_OPTIONS}
                      t={t}
                    />
                    <Select
                      label={t('cleanlinessLabel')}
                      value={form.cleanliness}
                      onChange={e => updateForm(req.id, 'cleanliness', e.target.value)}
                      options={CLEANLINESS_OPTIONS}
                      t={t}
                    />
                    <Select
                      label={t('contaminationLabel')}
                      value={form.visibleContamination}
                      onChange={e => updateForm(req.id, 'visibleContamination', e.target.value)}
                      options={CONTAMINATION_OPTIONS}
                      t={t}
                    />
                    <Input
                      label={t('remarksLabel')}
                      multiline
                      value={form.notes}
                      onChange={e => updateForm(req.id, 'notes', e.target.value)}
                      placeholder={t('remarksLabel')}
                    />
                    <Button
                      fullWidth={false}
                      icon={ShieldCheck}
                      loading={submittingId === req.id}
                      onClick={() => handleSubmit(req)}
                    >
                      {t('submitObservation')}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
