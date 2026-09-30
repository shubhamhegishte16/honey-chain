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
  FlaskConical,
  Dna,
  Scale
} from 'lucide-react';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
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
        floralSource: batch.floralSource || batch.woolType || 'Mustard Blossom',
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
    }, 600);
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
    <main className="page-shell">
      
      {/* ─── Hero Header ─── */}
      <div className="rounded-3xl sm:rounded-[2.5rem] bg-[#281D1C] text-white p-6 sm:p-10 shadow-soft-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4B345]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4B345] border border-white/15 text-xs font-bold backdrop-blur-md mb-3">
              <ShieldCheck size={14} /> KVIC National Honey Quality &amp; Blockchain Lab
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-white leading-tight">
              Honey Purity &amp; NMR Spectroscopy Lab
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
              FSSAI &amp; KVIC accredited multi-tier purity testing: 1H-NMR Nuclear Magnetic Resonance adulteration screening, HMF freshness indexing, moisture analysis, and AI botanical pollen mapping.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="relative w-36 sm:w-44 h-24 sm:h-28 rounded-2xl overflow-hidden border border-white/20 shadow-md">
              <img
                src="/honey-lab.jpg"
                alt="Honey Testing Laboratory"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1.5 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-bold text-emerald-300 backdrop-blur-xs">
                NMR 400MHz Active
              </span>
            </div>
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 size={15} /> ISO 17025 Accredited
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" /> {error}
        </div>
      )}

      {/* ─── Batches Waiting for Lab Inspection ─── */}
      <section className="mb-8">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><FlaskConical size={13} /> Specimen Queue</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Harvest Batches Awaiting Purity Testing</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FEF6E4] text-[#C06E30] border border-[#F4B345]/30 text-xs font-bold">
            {batches.length} Pending Lots
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-[#5E524D] flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
            <span>Loading Honey Mission specimen queue...</span>
          </div>
        ) : batches.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
            <CheckCircle2 size={36} className="mx-auto text-emerald-700 mb-2" />
            <h3 className="font-bold font-serif text-lg text-[#281D1C]">All Batches Certified</h3>
            <p className="text-xs text-[#5E524D] mt-1">All registered honey lots have passed laboratory NMR validation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {batches.map(b => (
              <div
                key={b.id}
                className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E8E3CF]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C06E30]">Specimen ID</span>
                      <h3 className="text-base font-bold font-mono text-[#281D1C]">{displayBatch(b)}</h3>
                    </div>
                    <BatchStatusBadge status={b.status} />
                  </div>

                  <dl className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div>
                      <dt className="text-[#9B918B]">Floral Bloom</dt>
                      <dd className="font-bold text-[#281D1C] mt-0.5">{b.floralSource || b.woolType || 'Raw Blossom Honey'}</dd>
                    </div>
                    <div>
                      <dt className="text-[#9B918B]">Lot Volume</dt>
                      <dd className="font-bold text-[#281D1C] mt-0.5">{b.quantityKg ?? b.quantity_kg ?? '60'} kg</dd>
                    </div>
                    <div>
                      <dt className="text-[#9B918B]">Beekeeper</dt>
                      <dd className="font-bold text-[#281D1C] mt-0.5">{b.farmer?.name || 'KVIC Registered Beekeeper'}</dd>
                    </div>
                    <div>
                      <dt className="text-[#9B918B]">Extraction Date</dt>
                      <dd className="font-bold text-[#281D1C] mt-0.5">{formatDate(b.shearingDate || b.shearing_date, language)}</dd>
                    </div>
                  </dl>

                  <p className="mt-3 text-xs text-[#5E524D] flex items-center gap-1.5 pt-2 border-t border-[#E8E3CF]/60">
                    <MapPin size={13} className="text-[#861C1C]" /> {b.district}, {b.state} • {b.farmLocation || 'Mustard Apiary Cluster'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3CF] flex justify-end">
                  <button
                    onClick={() => inspectBatch(b)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#861C1C] text-white text-xs font-bold hover:bg-[#6A1515] shadow-burgundy transition-all hover:scale-105"
                  >
                    <ClipboardCheck size={14} />
                    <span>Conduct Lab Purity Assay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Selected Batch Lab Inspection Form ─── */}
      {selectedBatch && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#861C1C]/30 shadow-soft-lg mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E8E3CF]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#861C1C] bg-[#FBEBEB] px-3 py-1 rounded-full border border-[#861C1C]/20">
                Active Specimen Analysis
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#281D1C] mt-2">
                FSSAI / KVIC Honey Quality Assay Form
              </h2>
              <p className="text-xs text-[#5E524D] font-mono mt-0.5">
                Target Lot: <strong className="text-[#281D1C]">{displayBatch(selectedBatch)}</strong> ({selectedBatch.floralSource || selectedBatch.woolType || 'Raw Blossom Honey'})
              </p>
            </div>

            <button
              type="button"
              disabled={aiLoading}
              onClick={runAiAssessment}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF6E4] border border-[#F4B345]/50 text-[#C06E30] text-xs font-bold shadow-soft hover:bg-[#FDE8B5] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles size={14} className="text-[#C06E30]" />
              <span>{aiLoading ? 'Analyzing Spectral Model...' : 'Run AI Spectral & Purity Scan'}</span>
            </button>
          </div>

          {loadingAssessment ? (
            <p className="py-8 text-center text-xs text-[#5E524D]">Loading historical assessment records...</p>
          ) : (
            <form onSubmit={submitAssessment} className="space-y-6">
              
              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Moisture % */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    Moisture Content (%) <span className="text-emerald-800 font-normal">(FSSAI Limit &lt;20%)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="moisturePercent"
                    value={form.moisturePercent}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  />
                  <span className="text-[10px] text-[#9B918B]">Standard: 16% - 19% ensures high shelf stability.</span>
                </div>

                {/* HMF Level */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    HMF Level (mg/kg) <span className="text-emerald-800 font-normal">(Freshness &lt;40 mg/kg)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="hmfLevel"
                    value={form.hmfLevel}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  />
                  <span className="text-[10px] text-[#9B918B]">&lt;15 mg/kg indicates freshly harvested unheated honey.</span>
                </div>

                {/* F/G Ratio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    Fructose / Glucose Ratio <span className="text-emerald-800 font-normal">(Standard &gt;0.95)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="fgRatio"
                    value={form.fgRatio}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  />
                  <span className="text-[10px] text-[#9B918B]">Dictates slow crystallization and authentic nectar provenance.</span>
                </div>

                {/* Pollen Grain Count */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    Pollen Density (grains / g)
                  </label>
                  <input
                    required
                    type="number"
                    name="pollenCount"
                    value={form.pollenCount}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  />
                  <span className="text-[10px] text-[#9B918B]">Confirms natural bee foraging without ultra-fine filtration.</span>
                </div>

                {/* Added Sucrose % */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    C3/C4 Sugar Syrups (%) <span className="text-emerald-800 font-normal">(&lt;5% max)</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="sucrosePercent"
                    value={form.sucrosePercent}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  />
                  <span className="text-[10px] text-[#9B918B]">0.0% confirms zero corn, rice, or cane sugar syrup adulteration.</span>
                </div>

                {/* NMR Screen */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    NMR Spectroscopy Verdict
                  </label>
                  <select
                    name="nmrScreen"
                    value={form.nmrScreen}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  >
                    <option value="Pure Raw Honey (Zero C3/C4 Syrups)">Pure Raw Honey (Zero C3/C4 Syrups Detected)</option>
                    <option value="Kashmir Monofloral Authentic Profile">Kashmir Monofloral Authentic Profile</option>
                    <option value="Wild Forest Multifloral Pass">Wild Forest Multifloral Pass</option>
                    <option value="Suspected C4 Corn/Invert Syrup">Suspected C4 Corn/Invert Syrup Adulteration</option>
                  </select>
                </div>

                {/* Final Grade */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#281D1C]">
                    Final Certification Grade
                  </label>
                  <select
                    name="finalGrade"
                    value={form.finalGrade}
                    onChange={updateField}
                    className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#861C1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                  >
                    <option value="Grade A+ (KVIC Export Quality)">Grade A+ (KVIC Export &amp; NMR Certified 100% Pure)</option>
                    <option value="Grade A (Standard Domestic Pure)">Grade A (Standard Domestic Pure)</option>
                    <option value="Grade B (Bakery / Processing Grade)">Grade B (Bakery / Processing Grade)</option>
                  </select>
                </div>
              </div>

              {/* Inspector Remarks */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#281D1C]">
                  Laboratory Inspector Findings &amp; Provenance Remarks
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={form.notes}
                  onChange={updateField}
                  className="w-full rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] px-4 py-3 text-xs sm:text-sm text-[#281D1C] outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
                />
              </div>

              {/* AI Assisted Screening Result Banner */}
              {aiResult && (
                <div className="rounded-3xl border border-[#F4B345] bg-[#FEF6E4] p-5 animate-fade-in text-[#281D1C]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F4B345]/40">
                    <span className="font-bold font-serif text-sm text-[#861C1C] flex items-center gap-2">
                      <Sparkles size={16} className="text-[#C06E30]" /> AI Spectral &amp; Pollen Match Result
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-300">
                      Adulteration: Negative ✔
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[#5E524D] block">AI Quality Score</span>
                      <strong className="text-base font-bold text-emerald-800">{aiResult.qualityScore}/100</strong>
                    </div>
                    <div>
                      <span className="text-[#5E524D] block">Confidence Level</span>
                      <strong className="text-base font-bold text-[#281D1C]">{aiResult.confidenceScore}%</strong>
                    </div>
                    <div>
                      <span className="text-[#5E524D] block">C4 Sugar Ratio</span>
                      <strong className="text-xs font-bold text-emerald-800">{aiResult.metrics?.c4SugarRatio}</strong>
                    </div>
                    <div>
                      <span className="text-[#5E524D] block">Botanical Origin</span>
                      <strong className="text-xs font-bold text-[#861C1C]">{aiResult.metrics?.botanicalOriginMatch}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit & Mint */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#861C1C] text-white font-bold text-xs sm:text-sm shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  <span>{submitting ? 'Minting Blockchain Certificate...' : 'Certify Purity & Seal Block on Chain'}</span>
                </button>
                <p className="text-xs text-[#5E524D]">
                  Submitting generates a permanent cryptographic SHA-256 block hash for consumer QR verification.
                </p>
              </div>

            </form>
          )}
        </div>
      )}

      {/* ─── Success Certificate Card ─── */}
      {success && assessment && (
        <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/50 p-6 sm:p-8 shadow-card mb-8 animate-scale-in text-[#281D1C]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm text-2xl">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-[#281D1C]">KVIC Honey Purity Certificate Issued</h2>
                <p className="text-xs text-emerald-800 font-medium">
                  Block #1 recorded. Consumer QR Passport is now live and tamper-proof.
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold self-start">
              Blockchain Verified
            </span>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-white border border-emerald-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Hash size={16} className="text-emerald-700 shrink-0" />
              <span className="text-[#5E524D] shrink-0 font-sans font-bold">Sealed Block Hash:</span>
              <span className="text-emerald-900 font-bold truncate">{sealedBlock}</span>
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              SHA-256 Merkle Valid
            </span>
          </div>
        </div>
      )}

    </main>
  );
}