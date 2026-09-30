import React, { useState, useEffect } from 'react';
import { X, Cog, Package, CheckCircle2, AlertCircle, Calendar, FileText, Factory, Sparkles, Scale } from 'lucide-react';
import { getProcessors, requestProcessing } from '../../services/processing.service';
import { useLanguage } from '../../context/LanguageContext';

const SERVICE_TYPES = [
  { id: 'Micro-Filtration & Moisture Conditioning', rate: 12, desc: 'Warm cloth filtration at 40°C and vacuum moisture reduction below 18%' },
  { id: 'Moisture Dehumidification', rate: 10, desc: 'Controlled conditioning to stabilize fresh high-moisture honey' },
  { id: 'Automated Jar Bottling (500g)', rate: 15, desc: 'Food-grade glass or PET bottling with tamper-evident induction seals' },
  { id: 'Export Packaging (30kg Barrels)', rate: 8, desc: 'Aseptic sealing into epoxy-lined food-grade drums for bulk logistics' },
  { id: 'Full Processing & QR Labeling', rate: 25, desc: 'End-to-end filtration, moisture reduction, jar packing, and blockchain QR application' },
];

export default function RequestProcessingModal({ batch, isOpen, onClose, onSuccess }) {
  const { t } = useLanguage();

  const [processors, setProcessors] = useState([]);
  const [selectedProcessor, setSelectedProcessor] = useState('');
  const [serviceType, setServiceType] = useState('Micro-Filtration & Moisture Conditioning');
  const [quantityKg, setQuantityKg] = useState('');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loadingProcessors, setLoadingProcessors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const batchWeight = batch?.quantity_kg || batch?.quantityKg || batch?.quantity || 0;
  const batchCode = batch?.batch_id || batch?.batchId || '—';
  const woolType = batch?.floralSource || batch?.wool_type || 'Raw Honey';

  useEffect(() => {
    if (isOpen && batch) {
      setQuantityKg(batchWeight);
      setError('');
      setSuccessMsg('');
      setLoadingProcessors(true);

      // Fetch all registered processors & artisans across India
      getProcessors()
        .then(res => {
          if (res.data && res.data.length > 0) {
            setProcessors(res.data);
            setSelectedProcessor(res.data[0]._id || res.data[0].id);
          } else {
            setProcessors([]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch processors:', err);
          setError(t('failedFetchProcessors', 'Unable to load registered mills.'));
        })
        .finally(() => {
          setLoadingProcessors(false);
        });
    }
  }, [isOpen, batch, batchWeight]);


  if (!isOpen || !batch) return null;

  const currentService = SERVICE_TYPES.find(s => s.id === serviceType) || SERVICE_TYPES[0];
  const qty = Number(quantityKg) || 0;
  const estimatedCost = Math.round(qty * currentService.rate);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedProcessor && processors.length > 0) {
      setError(t('selectProcessorError', 'Please select a processing mill or artisan.'));
      return;
    }

    if (qty <= 0) {
      setError(t('invalidQuantityError', 'Please enter a valid quantity in kg.'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        batchId: batch._id || batch.id || batchCode,
        processorId: selectedProcessor || null,
        serviceType,
        quantityKg: qty,
        preferredDate,
        notes,
      };

      const res = await requestProcessing(payload);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(t('processingRequestSuccess', 'Processing request submitted successfully!'));
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || t('somethingWrongHoney', 'Something went wrong. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/70 flex items-start justify-between gap-4 bg-gradient-to-r from-primaryLight/40 via-surface to-surface">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-sm">
              <Cog size={24} className="animate-spin-slow" />
            </span>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primaryLight text-primary text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <Sparkles size={11} /> {t('woolProcessing', 'Honey Processing & Bottling')}
              </span>
              <h2 className="text-xl font-extrabold text-textPrimary leading-tight">
                {t('requestWoolProcessing', 'Request Honey Processing')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-background border border-border/60 hover:bg-border/30 text-textMuted hover:text-textPrimary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Batch Info Card */}
          <div className="p-4 rounded-2xl bg-background border border-border/70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primaryLight text-primary font-bold">
                <Package size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-sm text-textPrimary truncate">{batchCode}</p>
                <p className="text-xs text-textSecondary truncate">{woolType} • {batch.district || 'Farm'}, {batch.state || 'Origin'}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase text-textMuted block">{t('lotWeight', 'Lot Weight')}</span>
              <span className="text-base font-extrabold text-primary font-mono">{batchWeight} kg</span>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Processor Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
              <Factory size={13} className="text-primary" />
              Select Honey Processing & Bottling Facility
            </label>

            {loadingProcessors ? (
              <div className="p-3.5 rounded-xl bg-background border border-border/60 text-xs text-textMuted flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Loading available honey processing facilities...</span>
              </div>
            ) : processors.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs">
                <p className="font-semibold">Central Honey Processing Plant (KVIC Auto-Assigned)</p>
                <p className="text-[11px] opacity-80 mt-0.5">Your request will be submitted to the nearest regional KVIC Honey Mission processing center.</p>
              </div>
            ) : (
              <select
                value={selectedProcessor}
                onChange={e => setSelectedProcessor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-textPrimary font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {processors.map(p => {
                  const nameStr = p.organization ? `${p.organization} (${p.name})` : p.name;
                  const locStr = [p.district, p.state].filter(Boolean).join(', ') || 'India';
                  const roleStr = p.role ? `[${p.role.toUpperCase()}]` : '';
                  return (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {nameStr} — {locStr} {roleStr}
                    </option>
                  );
                })}
              </select>

            )}
          </div>

          {/* Service Type Options Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-textMuted">
              {t('selectServiceType', 'Select Processing Service')}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICE_TYPES.map(st => {
                const isSelected = serviceType === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setServiceType(st.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primaryLight/50 border-primary shadow-xs ring-1 ring-primary/30'
                        : 'bg-background border-border/70 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-bold text-xs ${isSelected ? 'text-primary' : 'text-textPrimary'}`}>
                        {st.id}
                      </span>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-surface border border-border text-emerald-700 font-mono shrink-0">
                        ₹{st.rate}/kg
                      </span>
                    </div>
                    <p className="text-[11px] text-textSecondary mt-1 line-clamp-2 leading-tight">
                      {st.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1">
                <Scale size={13} /> {t('quantityToProcess', 'Quantity to Process (kg)')}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max={batchWeight || 9999}
                value={quantityKg}
                onChange={e => setQuantityKg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1">
                <Calendar size={13} /> {t('preferredDate', 'Preferred Date')}
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1">
              <FileText size={13} /> {t('specialInstructions', 'Special Processing Notes (Optional)')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('processingNotesPlaceholder', 'e.g. Please preserve natural white shade during carding...')}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          {/* Cost Estimate Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                {t('estimatedProcessingFee', 'Estimated Processing Fee')}
              </span>
              <p className="text-xs text-emerald-700 mt-0.5">
                {qty} kg × ₹{currentService.rate}/kg ({serviceType})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-900 font-mono flex items-center justify-end">
                ₹{estimatedCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-textSecondary font-semibold text-xs hover:bg-background transition-colors"
            >
              {t('cancel', 'Cancel')}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primaryDark transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{t('submittingRequest', 'Submitting Request...')}</span>
                </>
              ) : (
                <>
                  <Cog size={15} />
                  <span>{t('submitRequest', 'Submit Processing Request')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
