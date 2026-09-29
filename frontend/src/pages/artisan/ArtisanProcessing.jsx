import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog, Package, Calendar, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { getAssignedProcessingRequests, updateProcessingRequestStatus } from '../../services/processing.service';

export default function ArtisanProcessing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesById, setNotesById] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  async function load() {
    setLoading(true);
    const { data, error } = await getAssignedProcessingRequests();
    if (!error) {
      setRequests((data || []).filter(r => r.status === 'in_progress' || r.status === 'requested' || r.status === 'accepted'));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    setSubmittingId(id);
    const { error } = await updateProcessingRequestStatus(id, status, notesById[id] || '');
    setSubmittingId(null);
    if (error) {
      toast.showError(t('somethingWrongTryAgain'));
      return;
    }
    toast.showSuccess(status === 'completed' ? t('successProcessingCompleted') : t('successProcessingUpdated'));
    load();
  }

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Active Extraction Runs</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('activeProcessingJobs')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Live centrifugation, micro-filtration, settling, and moisture verification log.
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
            <Cog size={30} />
          </div>
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('noActiveProcessing')}</h3>
          <p className="text-xs text-deepBrown/70 max-w-sm mt-1">{t('noActiveProcessingHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => (
            <div key={req.id} className="bento-card p-6 md:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-burgundy/10 text-burgundy shrink-0">
                    <Package size={22} />
                  </span>
                  <div>
                    <p className="font-mono font-bold text-sm text-burgundy">Batch #{req.batch_id}</p>
                    <p className="text-xs font-bold text-deepBrown">{req.service_type} • <span className="font-mono font-bold text-burgundy">{req.quantity_kg} kg</span></p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/artisan/batches/${req.id}`)}
                  className="text-burgundy hover:underline text-xs font-bold inline-flex items-center gap-1"
                >
                  <span>{t('viewDetails')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-warmIvory/60 p-4 rounded-2xl border border-border/60">
                <div>
                  <p className="text-[10px] uppercase font-bold text-deepBrown/50">{t('startDateLabel')}</p>
                  <p className="font-semibold text-deepBrown flex items-center gap-1 mt-0.5">
                    <Calendar size={12} className="text-burntOrange" />
                    {req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-deepBrown/50">{t('status')}</p>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-honeyGold/20 text-burgundy">
                    {req.status}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-deepBrown/50">{t('assignedWool')}</p>
                  <p className="font-bold text-deepBrown mt-0.5">{req.floralSource || req.wool_type || 'Raw Blossom'} Honey</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Extraction notes (e.g., Moisture 17.5%, Cold Centrifuged at 24°C)..."
                  value={notesById[req.id] || ''}
                  onChange={(e) => setNotesById({ ...notesById, [req.id]: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                />
                <button
                  disabled={submittingId === req.id}
                  onClick={() => updateStatus(req.id, 'completed')}
                  className="px-5 py-2.5 bg-burgundy text-warmIvory text-xs font-bold rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60 whitespace-nowrap"
                >
                  {submittingId === req.id ? 'Recording Block…' : 'Mark Extraction Complete ✓'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
