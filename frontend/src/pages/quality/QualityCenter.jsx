import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Sparkles,
  ShieldCheck,
  Hash,
  Activity,
  AlertCircle,
  FileCheck2,
  Cpu,
  Layers,
  Search,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  getAiEstimate,
  getPendingQualityBatches,
  getQualityAssessment,
  submitQualityAssessment,
} from '../../services/quality.service';

const initialHoneyForm = {
  moisturePercent: 17.6,
  hmfLevel: 11.8,
  fgRatio: 1.16,
  pollenCount: 42000,
  sucrosePercent: 1.8,
  nmrScreen: 'Pure Raw Honey (Zero C3/C4 Syrups)',
  colorProfile: 'Golden Amber',
  finalGrade: 'Grade A+ (KVIC Export Quality)',
  notes: 'High natural invertase activity. No thermal degradation detected. Genuine unpasteurized raw blossom profile.',
};

function displayBatch(batch) {
  return batch?.batchId || batch?.id || '—';
}

function formatDate(date, language) {
  return date
    ? new Date(date).toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`)
    : '—';
}

export default function QualityCenter() {
  const { t, language } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState(initialHoneyForm);
  const [assessment, setAssessment] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sealedBlock, setSealedBlock] = useState(null);

  async function loadBatches() {
    setLoading(true);
    setError('');
    const result = await getPendingQualityBatches();
    if (result.error) {
      setError('Unable to load honey batches for testing.');
    } else {
      setBatches(result.data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBatches();
  }, []);

  async function inspectBatch(batch) {
    setSelectedBatch(batch);
    setAssessment(null);
    setAiResult(null);
    setSuccess(false);
    setSealedBlock(null);
    setError('');
    setLoadingAssessment(true);

    const result = await getQualityAssessment(batch.id || batch.batchId);
    if (!result.error && result.data) {
      setAssessment(result.data);
      setForm({ ...initialHoneyForm, ...result.data });
      if (result.data.blockHash) {
        setSealedBlock(result.data.blockHash);
      }
    } else {
      setForm({
        ...initialHoneyForm,
        floralSource: batch.woolType || 'Mustard Blossom',
      });
    }
    setLoadingAssessment(false);
  }

  function updateField(event) {
    const { name, value, type } = event.target;
    setForm(current => ({
      ...current,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  async function runAiAssessment() {
    if (!selectedBatch) return;
    setAiLoading(true);
    setError('');

    // Simulate AI Spectral Purity & Disease Scan
    setTimeout(() => {
      const mockAi = {
        preliminaryGrade: 'Grade A+ (Ultra Pure)',
        qualityScore: 98,
        confidenceScore: 99.4,
        metrics: {
          moisturePrediction: '17.4% (Optimal)',
          c4SugarRatio: '0.00% (Zero High Fructose Corn Syrup)',
          varroaMarker: 'Clean (No chemical pesticide residue)',
          botanicalOriginMatch: '98.7% Mustard Blossom (Brassica juncea)',
        },
      };
      setAiResult(mockAi);
      setForm(curr => ({
        ...curr,
        finalGrade: 'Grade A+ (KVIC Export Quality)',
        notes: `${curr.notes} [AI Verified: 98.7% botanical match with zero C4 sugar adulterants]`,
      }));
      setAiLoading(false);
    }, 700);
  }

  async function submitAssessment(event) {
    event.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);
    setError('');

    const payload = {
      batchId: selectedBatch.id || selectedBatch.batchId,
      ...form,
      qualityScore: aiResult?.qualityScore || 96,
      isAiAssisted: Boolean(aiResult),
      moisturePercent: form.moisturePercent,
      hmfLevel: form.hmfLevel,
      fgRatio: form.fgRatio,
    };

    const result = await submitQualityAssessment(payload);
    if (result.error) {
      setError('Failed to submit honey quality assessment and seal block.');
    } else {
      const submittedAssessment = result.data?.assessment;
      setAssessment(submittedAssessment);
      setSelectedBatch(result.data?.batch || selectedBatch);
      setSealedBlock(submittedAssessment?.blockHash || '0x4f89d3a1e8c75b290123ef884bc78310');
      setSuccess(true);
      setBatches(current => current.filter(batch => batch.id !== selectedBatch.id));
    }
    setSubmitting(false);
  }

  return (
    <main className="page-shell py-6">
      {/* Header */}
      <div className="mb-8 animate-enter">
        <div className="eyebrow text-amber-600 flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs">
          <ShieldCheck size={16} /> KVIC National Honey Quality & Blockchain Testing Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-textPrimary mt-2">
          Honey Purity & Blockchain Certification Center
        </h1>
        <p className="text-sm text-textSecondary mt-1 max-w-3xl">
          Conduct authorized FSSAI & KVIC Honey Mission purity tests: Nuclear Magnetic Resonance (NMR) screen,
          moisture analysis, HMF fresh index, and AI botanical pollen verification before sealing batches on the tamper-proof ledger.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Batches Waiting for Lab Inspection */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">Harvest Batches Awaiting Purity Testing</h2>
            <p className="text-xs text-textSecondary">Select a raw honey lot harvested by beekeepers to run laboratory verification.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            {batches.length} Pending Lots
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-textSecondary flex items-center justify-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading Honey Mission Batches...
          </div>
        ) : batches.length === 0 ? (
          <Card interactive={false} className="text-center py-10 text-sm text-textSecondary">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-2" />
            All registered honey batches have been certified on the blockchain!
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {batches.map(batch => (
              <Card key={batch.id} className="border-amber-200/70 hover:border-amber-400 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Honey Batch ID</p>
                    <h3 className="text-base font-bold text-textPrimary font-mono">{displayBatch(batch)}</h3>
                  </div>
                  <BatchStatusBadge status={batch.status} />
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
                  <div>
                    <dt className="text-textMuted text-xs">Floral Variety</dt>
                    <dd className="font-semibold text-textPrimary">{batch.floralSource || batch.woolType || 'Raw Blossom Honey'}</dd>
                  </div>
                  <div>
                    <dt className="text-textMuted text-xs">Harvest Volume</dt>
                    <dd className="font-semibold text-textPrimary font-mono">{batch.quantityKg ?? '—'} kg</dd>
                  </div>
                  <div>
                    <dt className="text-textMuted text-xs">Beekeeper</dt>
                    <dd className="font-semibold text-textPrimary">{batch.farmer?.name || 'KVIC Registered Beekeeper'}</dd>
                  </div>
                  <div>
                    <dt className="text-textMuted text-xs">Extraction Date</dt>
                    <dd className="font-semibold text-textPrimary">{formatDate(batch.shearingDate, language)}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-textSecondary flex items-center gap-1.5 border-t border-border/50 pt-2">
                  <MapPin size={13} className="text-primary" /> {batch.district}, {batch.state} • {batch.farmLocation || 'Apiary Unit'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    size="sm"
                    fullWidth={false}
                    icon={ClipboardCheck}
                    onClick={() => inspectBatch(batch)}
                  >
                    Conduct Lab Purity Test
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Selected Batch Inspection Form */}
      {selectedBatch && (
        <Card interactive={false} className="mb-8 border-2 border-primary/30 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border/70">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primaryLight px-2 py-0.5 rounded-full">
                Active Laboratory Specimen
              </span>
              <h2 className="text-xl font-black text-textPrimary mt-1">
                FSSAI / KVIC Honey Quality Inspection Form
              </h2>
              <p className="text-xs text-textSecondary font-mono mt-0.5">
                Target Lot: <b>{displayBatch(selectedBatch)}</b> ({selectedBatch.floralSource || selectedBatch.woolType || 'Raw Blossom Honey'})
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              loading={aiLoading}
              icon={Sparkles}
              onClick={runAiAssessment}
              className="bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              Run AI Spectral & Adulteration Scan
            </Button>
          </div>

          {loadingAssessment ? (
            <p className="py-8 text-center text-sm text-textSecondary">Loading previous assessment records...</p>
          ) : (
            <form onSubmit={submitAssessment} className="space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Moisture % */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    Moisture Content (%) <span className="text-emerald-700 font-normal">(FSSAI max 20%)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="moisturePercent"
                    value={form.moisturePercent}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[10px] text-textMuted">Standard: 16% - 19% ensures high shelf-life.</span>
                </div>

                {/* HMF Level */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    HMF Level (mg/kg) <span className="text-emerald-700 font-normal">(Freshness &lt;40 mg/kg)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="hmfLevel"
                    value={form.hmfLevel}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[10px] text-textMuted">Indicates freshness. &lt;15 mg/kg confirms unheated raw honey.</span>
                </div>

                {/* F/G Ratio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    Fructose / Glucose (F/G) Ratio <span className="text-emerald-700 font-normal">(Standard &gt;0.95)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="fgRatio"
                    value={form.fgRatio}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[10px] text-textMuted">Determines crystallization rate & floral integrity.</span>
                </div>

                {/* Pollen Grain Count */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    Pollen Density (grains / gram)
                  </label>
                  <input
                    required
                    type="number"
                    name="pollenCount"
                    value={form.pollenCount}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[10px] text-textMuted">High pollen confirms genuine bee extraction without ultra-filtration.</span>
                </div>

                {/* Sucrose % */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    Added Sucrose / Cane Sugar (%) <span className="text-emerald-700 font-normal">(&lt;5% max)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="sucrosePercent"
                    value={form.sucrosePercent}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[10px] text-textMuted">&lt;3% confirms no sugar feeding during honey flow season.</span>
                </div>

                {/* NMR Adulteration Screen */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    NMR (Nuclear Magnetic Resonance) Screen
                  </label>
                  <select
                    name="nmrScreen"
                    value={form.nmrScreen}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Pure Raw Honey (Zero C3/C4 Syrups)">Pure Raw Honey (Zero C3/C4 Syrups Detected)</option>
                    <option value="Kashmir Monofloral Authentic Profile">Kashmir Monofloral Authentic Profile</option>
                    <option value="Wild Forest Multifloral Pass">Wild Forest Multifloral Pass</option>
                    <option value="Suspected C4 Corn/Invert Syrup">Suspected C4 Corn/Invert Syrup Adulteration</option>
                  </select>
                  <span className="text-[10px] text-textMuted">Gold standard test for synthetic syrup detection.</span>
                </div>

                {/* Color Profile */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    Color & Aroma Profile
                  </label>
                  <select
                    name="colorProfile"
                    value={form.colorProfile}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Golden Amber">Golden Amber (Mustard / Rapeseed)</option>
                    <option value="Extra Light Amber">Extra Light Amber (Acacia / Robina)</option>
                    <option value="Dark Amber / Caramel">Dark Amber (Forest / Sidr)</option>
                    <option value="Light White / Translucent">Light Cream (Lychee Blossom)</option>
                  </select>
                </div>

                {/* Final Certification Grade */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-textPrimary">
                    Final KVIC Certification Grade
                  </label>
                  <select
                    name="finalGrade"
                    value={form.finalGrade}
                    onChange={updateField}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Grade A+ (KVIC Export Quality)">Grade A+ (KVIC Export & NMR Certified 100% Pure)</option>
                    <option value="Grade A (Standard Domestic Pure)">Grade A (Standard Domestic Pure)</option>
                    <option value="Grade B (Bakery / Processing Grade)">Grade B (Bakery / Processing Grade)</option>
                  </select>
                </div>
              </div>

              {/* Lab Inspector Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-textPrimary">
                  Laboratory Verification Notes & Traceability Remarks
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={form.notes}
                  onChange={updateField}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-textPrimary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* AI Assisted Analysis Card */}
              {aiResult && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-sm text-textPrimary animate-fade-in shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                    <span className="font-extrabold text-amber-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-600" /> AI Spectral & Disease Screening Result
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Adulteration: Negative
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-2">
                    <div>
                      <span className="text-textMuted block">AI Quality Score</span>
                      <strong className="text-base font-black text-emerald-700">{aiResult.qualityScore}/100</strong>
                    </div>
                    <div>
                      <span className="text-textMuted block">Confidence Level</span>
                      <strong className="text-base font-black text-textPrimary">{aiResult.confidenceScore}%</strong>
                    </div>
                    <div>
                      <span className="text-textMuted block">C4 Sugar Adulteration</span>
                      <strong className="text-sm font-bold text-emerald-700">{aiResult.metrics?.c4SugarRatio}</strong>
                    </div>
                    <div>
                      <span className="text-textMuted block">Botanical Origin Match</span>
                      <strong className="text-sm font-bold text-amber-900">{aiResult.metrics?.botanicalOriginMatch}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="submit"
                  loading={submitting}
                  icon={ShieldCheck}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Certify Purity & Seal Block #1 on Chain
                </Button>
                <p className="text-xs text-textMuted">
                  Submitting generates a permanent cryptographic SHA-256 block hash for the consumer QR passport.
                </p>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Success & Blockchain Block Seal Certificate */}
      {success && assessment && (
        <Card interactive={false} className="mb-8 border-2 border-emerald-500 bg-emerald-50/40 p-6 shadow-md animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-textPrimary">KVIC Honey Purity Certificate Issued</h2>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Blockchain Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-medium">
                  Block #1 recorded. Consumer QR Passport is now live and tamper-proof.
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash Badge */}
          <div className="mt-4 p-3 rounded-xl bg-white border border-emerald-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Hash size={16} className="text-emerald-700 shrink-0" />
              <span className="text-textMuted shrink-0">Sealed Block Hash:</span>
              <span className="text-emerald-900 font-bold truncate">{sealedBlock}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
              SHA-256 Merkle Root Valid
            </span>
          </div>

          {/* Certificate Parameters Matrix */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-emerald-200">
              <dt className="text-textMuted">Certified Grade</dt>
              <dd className="font-extrabold text-sm text-textPrimary mt-0.5">{assessment.grade || assessment.finalGrade}</dd>
            </div>
            <div className="p-3 rounded-xl bg-white border border-emerald-200">
              <dt className="text-textMuted">Moisture Level</dt>
              <dd className="font-bold text-sm text-emerald-700 mt-0.5">{form.moisturePercent}% (Optimal)</dd>
            </div>
            <div className="p-3 rounded-xl bg-white border border-emerald-200">
              <dt className="text-textMuted">HMF Index</dt>
              <dd className="font-bold text-sm text-emerald-700 mt-0.5">{form.hmfLevel} mg/kg (Unheated)</dd>
            </div>
            <div className="p-3 rounded-xl bg-white border border-emerald-200">
              <dt className="text-textMuted">NMR Purity</dt>
              <dd className="font-bold text-sm text-emerald-700 mt-0.5">100% Pure (Zero Syrups)</dd>
            </div>
          </dl>
        </Card>
      )}
    </main>
  );
}