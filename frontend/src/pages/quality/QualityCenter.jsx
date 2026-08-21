import React, { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck, MapPin, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { getAiEstimate, getPendingQualityBatches, getQualityAssessment, submitQualityAssessment } from '../../services/quality.service';

const initialForm = {
  fiberAppearance: 'Good', color: 'Consistent White', cleanliness: 'High (Low Dust/Grease)',
  visibleContamination: 'Low (1-3%)', moistureCondition: 'Optimal (<14%)', stapleLengthMm: 65,
  micronEstimate: 22.5, finalGrade: 'Grade A', notes: '',
};

const fields = [
  ['fiberAppearance', 'fiberAppearance', ['Excellent', 'Good', 'Moderate', 'Coarse']],
  ['color', 'color', ['Consistent White', 'Cream White', 'Light Yellow', 'Mixed/Stained']],
  ['cleanliness', 'cleanliness', ['High (Low Dust/Grease)', 'Medium', 'Low (High Vegetable Matter)']],
  ['visibleContamination', 'visibleContamination', ['Very Low (<1%)', 'Low (1-3%)', 'Moderate (3-6%)', 'High (>6%)']],
  ['moistureCondition', 'moistureCondition', ['Optimal (<14%)', 'Normal (14-16%)', 'Slightly Moist (16-18%)', 'Damp (>18%)']],
];

const optionKeys = {
  Excellent: 'qualityExcellent', Good: 'qualityGood', Moderate: 'qualityModerate', Coarse: 'qualityCoarse',
  'Consistent White': 'qualityConsistentWhite', 'Cream White': 'qualityCreamWhite', 'Light Yellow': 'qualityLightYellow', 'Mixed/Stained': 'qualityMixedStained',
  'High (Low Dust/Grease)': 'qualityCleanHigh', Medium: 'qualityCleanMedium', 'Low (High Vegetable Matter)': 'qualityCleanLow',
  'Very Low (<1%)': 'qualityContaminationVeryLow', 'Low (1-3%)': 'qualityContaminationLow', 'Moderate (3-6%)': 'qualityContaminationModerate', 'High (>6%)': 'qualityContaminationHigh',
  'Optimal (<14%)': 'qualityMoistureOptimal', 'Normal (14-16%)': 'qualityMoistureNormal', 'Slightly Moist (16-18%)': 'qualityMoistureSlightlyMoist', 'Damp (>18%)': 'qualityMoistureDamp',
  'Grade A': 'qualityGradeA', 'Grade B': 'qualityGradeB', 'Grade C': 'qualityGradeC',
};

function displayBatch(batch) { return batch?.batchId || batch?.id || '—'; }
function formatDate(date, language) { return date ? new Date(date).toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`) : '—'; }

export default function QualityCenter() {
  const { t, language } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [assessment, setAssessment] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function loadBatches() {
    setLoading(true); setError('');
    const result = await getPendingQualityBatches();
    if (result.error) setError(t('failedLoadQualityBatches')); else setBatches(result.data || []);
    setLoading(false);
  }

  useEffect(() => { loadBatches(); }, []);

  async function inspectBatch(batch) {
    setSelectedBatch(batch); setAssessment(null); setAiResult(null); setSuccess(false); setError(''); setLoadingAssessment(true);
    const result = await getQualityAssessment(batch.id || batch.batchId);
    if (!result.error) {
      setAssessment(result.data);
      setForm({ ...initialForm, ...result.data, stapleLengthMm: result.data.stapleLengthMm ?? 65 });
    } else setForm(initialForm);
    setLoadingAssessment(false);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: name === 'stapleLengthMm' || name === 'micronEstimate' ? Number(value) : value }));
  }

  async function runAiAssessment() {
    if (!selectedBatch) return;
    setAiLoading(true); setError('');
    const result = await getAiEstimate({ woolType: selectedBatch.woolType, state: selectedBatch.state });
    if (result.error) setError(t('failedAiAssessment'));
    else {
      setAiResult(result.data);
      setForm(current => ({ ...current, preliminaryGrade: result.data.preliminaryGrade, micronEstimate: result.data.metrics?.estimatedMicron ?? current.micronEstimate }));
    }
    setAiLoading(false);
  }

  async function submitAssessment(event) {
    event.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true); setError('');
    const result = await submitQualityAssessment({ batchId: selectedBatch.id || selectedBatch.batchId, ...form, isAiAssisted: Boolean(aiResult) });
    if (result.error) setError(t('failedSubmitQualityAssessment'));
    else {
      setAssessment(result.data?.assessment); setSelectedBatch(result.data?.batch || selectedBatch); setSuccess(true);
      setBatches(current => current.filter(batch => batch.id !== selectedBatch.id));
    }
    setSubmitting(false);
  }

  return (
    <main className="page-shell max-w-6xl mx-auto">
      <div className="mb-8 animate-enter">
        <div className="eyebrow text-primary"><ClipboardCheck size={13} /> {t('qualityCenter')}</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary mt-2">{t('qualityAssurance')}</h1>
        <p className="text-sm text-textSecondary mt-1">{t('qualityAssuranceDescription')}</p>
      </div>
      {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}

      <section className="mb-8">
        <h2 className="text-lg font-bold text-textPrimary mb-3">{t('pendingQualityChecks')}</h2>
        {loading ? <div className="py-12 text-center text-sm text-textSecondary">{t('loadingQualityBatches')}</div> : batches.length === 0 ? (
          <Card interactive={false} className="text-center py-10 text-sm text-textSecondary">{t('noPendingQualityBatches')}</Card>
        ) : <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {batches.map(batch => <Card key={batch.id}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3"><div><p className="text-xs font-semibold text-textMuted">{t('batchId')}</p><h3 className="text-base font-bold text-textPrimary">{displayBatch(batch)}</h3></div><BatchStatusBadge status={batch.status} /></div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
              <div><dt className="text-textMuted">{t('woolType')}</dt><dd className="font-semibold text-textPrimary">{batch.woolType || '—'}</dd></div>
              <div><dt className="text-textMuted">{t('quantity')}</dt><dd className="font-semibold text-textPrimary">{batch.quantityKg ?? '—'} kg</dd></div>
              <div><dt className="text-textMuted">{t('farmer')}</dt><dd className="font-semibold text-textPrimary">{batch.farmer?.name || t('unknown')}</dd></div>
              <div><dt className="text-textMuted">{t('shearingDate')}</dt><dd className="font-semibold text-textPrimary">{formatDate(batch.shearingDate, language)}</dd></div>
            </dl>
            <p className="mt-3 text-sm text-textSecondary flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {batch.district}, {batch.state}</p>
            <Button className="mt-4" size="sm" fullWidth={false} icon={ClipboardCheck} onClick={() => inspectBatch(batch)}>{t('inspectBatch')}</Button>
          </Card>)}
        </div>}
      </section>

      {selectedBatch && <Card interactive={false} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"><div><h2 className="text-lg font-bold text-textPrimary">{t('inspectionForm')}</h2><p className="text-sm text-textSecondary">{displayBatch(selectedBatch)}</p></div><Button variant="secondary" size="sm" fullWidth={false} loading={aiLoading} icon={Sparkles} onClick={runAiAssessment}>{t('runAiAssessment')}</Button></div>
        {loadingAssessment ? <p className="py-8 text-center text-sm text-textSecondary">{t('loadingAssessment')}</p> : <form onSubmit={submitAssessment} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(([name, label, options]) => <label key={name} className="block text-sm font-semibold text-textPrimary">{t(label)}<select name={name} value={form[name]} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-normal text-textPrimary outline-none focus:border-primary">{options.map(option => <option key={option} value={option}>{t(optionKeys[option])}</option>)}</select></label>)}
            <label className="block text-sm font-semibold text-textPrimary">{t('stapleLength')}<input required type="number" name="stapleLengthMm" value={form.stapleLengthMm} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-normal text-textPrimary outline-none focus:border-primary" /></label>
            <label className="block text-sm font-semibold text-textPrimary">{t('micronEstimate')}<input required type="number" step="0.1" name="micronEstimate" value={form.micronEstimate} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-normal text-textPrimary outline-none focus:border-primary" /></label>
            <label className="block text-sm font-semibold text-textPrimary">{t('finalGrade')}<select name="finalGrade" value={form.finalGrade} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-normal text-textPrimary outline-none focus:border-primary">{['Grade A', 'Grade B', 'Grade C'].map(grade => <option key={grade} value={grade}>{t(optionKeys[grade])}</option>)}</select></label>
          </div>
          <label className="block text-sm font-semibold text-textPrimary">{t('inspectionNotes')}<textarea name="notes" rows="3" value={form.notes} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-normal text-textPrimary outline-none focus:border-primary" /></label>
          {aiResult && <div className="rounded-lg border border-info/30 bg-infoLight p-4 text-sm text-textPrimary"><p className="font-semibold flex items-center gap-2"><Sparkles size={15} /> {t('aiAssisted')}</p><p className="mt-1 text-textSecondary">{t('preliminaryGrade')}: {aiResult.preliminaryGrade} · {t('qualityScore')}: {aiResult.qualityScore} · {t('confidenceScore')}: {aiResult.confidenceScore}%</p></div>}
          <Button type="submit" loading={submitting} icon={ClipboardCheck}>{t('submitQualityAssessment')}</Button>
        </form>}
      </Card>}

      {success && assessment && <Card interactive={false} variant="accent" className="mb-8"><div className="flex items-center gap-3 mb-5"><CheckCircle2 className="text-primary" size={24} /><div><h2 className="text-lg font-bold text-textPrimary">{t('qualityCertificate')}</h2><p className="text-sm text-primary font-semibold">{t('qualityVerified')}</p></div></div><dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">{[[t('batchId'), displayBatch(selectedBatch)], [t('finalGrade'), assessment.finalGrade], [t('qualityScore'), selectedBatch.qualityScore], [t('micronEstimate'), assessment.micronEstimate], [t('stapleLength'), assessment.stapleLengthMm], [t('fiberAppearance'), assessment.fiberAppearance], [t('cleanliness'), assessment.cleanliness], [t('moistureCondition'), assessment.moistureCondition], [t('assessedBy'), assessment.assessedBy?.name || t('authorizedInspector')], [t('assessmentDate'), formatDate(assessment.updatedAt || assessment.createdAt, language)]].map(([label, value]) => <div key={label}><dt className="text-textMuted">{label}</dt><dd className="font-semibold text-textPrimary mt-0.5">{value ?? '—'}</dd></div>)}</dl></Card>}
    </main>
  );
}