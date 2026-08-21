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
    <main className="page-shell">
      <div className="mb-6">
        <div className="eyebrow text-primary mb-1">
          <Sparkles size={13} /> {t('activeProcessingJobs')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
          {t('activeProcessingJobs')}
        </h1>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-10 sm:p-16 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primaryLight text-primary mb-4 shadow-sm">
            <Cog size={32} />
          </span>
          <h3 className="font-bold text-lg text-textPrimary">{t('noActiveProcessing')}</h3>
          <p className="hidden sm:block text-xs sm:text-sm text-textSecondary max-w-sm mt-1">{t('noActiveProcessingHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => (
            <Card key={req.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primaryLight text-primary shrink-0">
                    <Package size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-sm text-textPrimary">{req.batch_id}</p>
                    <p className="text-xs text-textSecondary font-medium">{req.service_type} • {req.quantity_kg} kg</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/artisan/batches/${req.id}`)}
                  className="text-primary hover:text-primaryDark text-xs font-bold inline-flex items-center gap-1"
                >
                  <span>{t('viewDetails')}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-textMuted">{t('startDateLabel')}</p>
                  <p className="font-semibold text-textPrimary flex items-center gap-1">
                    <Calendar size={11} className="text-textMuted" />
                    {req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-textMuted">{t('status')}</p>
                  <p className="font-semibold text-textPrimary">
                    {req.status === 'in_progress' ? t('statusInProgressArtisan') : t('statusRequested')}
                  </p>
                </div>
              </div>

              <Input
                label={t('addNoteOptional')}
                value={notesById[req.id] || ''}
                onChange={e => setNotesById(prev => ({ ...prev, [req.id]: e.target.value }))}
                placeholder={t('addNoteOptional')}
                className="mb-2"
              />

              <div className="flex flex-col sm:flex-row gap-2">
                {req.status !== 'in_progress' && (
                  <Button
                    fullWidth={false}
                    icon={Cog}
                    loading={submittingId === req.id}
                    onClick={() => updateStatus(req.id, 'in_progress')}
                  >
                    {t('startProcessingAction')}
                  </Button>
                )}
                {req.status === 'in_progress' && (
                  <>
                    <Button
                      fullWidth={false}
                      variant="secondary"
                      icon={Cog}
                      loading={submittingId === req.id}
                      onClick={() => updateStatus(req.id, 'in_progress')}
                    >
                      {t('updateProcessingAction')}
                    </Button>
                    <Button
                      fullWidth={false}
                      icon={CheckCircle}
                      loading={submittingId === req.id}
                      onClick={() => updateStatus(req.id, 'completed')}
                    >
                      {t('markComplete')}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
