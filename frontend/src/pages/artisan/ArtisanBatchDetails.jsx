import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Calendar,
  ShieldCheck,
  Cog,
  CheckCircle,
  ClipboardCheck,
  Layers,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { getAssignedProcessingRequests, updateProcessingRequestStatus } from '../../services/processing.service';
import { getBatchById } from '../../services/batches.service';

const JOURNEY_STAGES = [
  { key: 'farm', labelKey: 'farm', statuses: ['produced'] },
  { key: 'collection', labelKey: 'collectionStage', statuses: ['quality_checked'] },
  { key: 'grading', labelKey: 'gradingStage', statuses: ['sorted'] },
  { key: 'storage', labelKey: 'storage', statuses: ['stored'] },
  { key: 'artisan', labelKey: 'artisanProcessingStage', statuses: ['processing_requested', 'in_processing'] },
  { key: 'qualityCheck', labelKey: 'qualityCheckStage', statuses: ['processed'] },
  { key: 'marketplace', labelKey: 'marketplaceBuyerStage', statuses: ['listed', 'ordered', 'dispatched', 'delivered', 'sold'] },
];

function currentStageIndex(batchStatus) {
  const idx = JOURNEY_STAGES.findIndex(s => s.statuses.includes(batchStatus));
  return idx === -1 ? 0 : idx;
}

export default function ArtisanBatchDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [request, setRequest] = useState(null);
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStartForm, setShowStartForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const { data: requests, error } = await getAssignedProcessingRequests();
    if (!error) {
      const found = (requests || []).find(r => r.id === id);
      setRequest(found || null);
      if (found?.batch?._id || found?.batch?.id) {
        const batchId = found.batch._id || found.batch.id;
        const { data: batchData } = await getBatchById(batchId);
        setBatch(batchData);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status) {
    setSubmitting(true);
    const { error } = await updateProcessingRequestStatus(id, status, notes);
    setSubmitting(false);
    if (error) {
      toast.showError(t('somethingWrongTryAgain'));
      return;
    }
    if (status === 'in_progress') toast.showSuccess(t('successProcessingStarted'));
    else if (status === 'completed') toast.showSuccess(t('successProcessingCompleted'));
    else toast.showSuccess(t('successProcessingUpdated'));
    setNotes('');
    setShowStartForm(false);
    load();
  }

  if (loading) {
    return (
      <main className="page-shell max-w-3xl">
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="page-shell max-w-3xl">
        <div className="p-10 text-center rounded-3xl bg-surface border border-border">
          <p className="text-textSecondary text-sm">{t('batchNotFound')}</p>
          <Link to="/artisan/batches" className="text-link mt-4 inline-flex">
            <ArrowLeft size={14} /> <span>{t('backToDashboard')}</span>
          </Link>
        </div>
      </main>
    );
  }

  const stageIdx = currentStageIndex(batch?.status);

  return (
    <main className="page-shell max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/artisan/batches"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>{t('assignedWool')}</span>
        </Link>
        <span className="text-xs text-primary font-bold flex items-center gap-1">
          <ShieldCheck size={14} /> {t('woolPassportTitle')}
        </span>
      </div>

      {/* A. Wool Information */}
      <Card className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primaryLight text-primary shrink-0">
            <Package size={20} />
          </span>
          <div>
            <h2 className="font-bold text-lg text-textPrimary">{request.batch_id}</h2>
            <p className="text-xs text-textSecondary font-semibold">{t('woolInformation')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('woolId')}</p>
            <p className="font-semibold text-textPrimary">{request.batch_id}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('quantity')}</p>
            <p className="font-semibold text-textPrimary">{request.quantity_kg} kg</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('origin')}</p>
            <p className="font-semibold text-textPrimary flex items-center gap-1">
              <MapPin size={12} className="text-primary" />
              {batch?.district || batch?.origin?.district}, {batch?.state || batch?.origin?.state}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('farmer')}</p>
            <p className="font-semibold text-textPrimary flex items-center gap-1">
              <User size={12} className="text-primary" /> {request.farmer_name}
            </p>
          </div>
        </div>
      </Card>

      {/* B. Current Quality */}
      <Card className="mb-4">
        <h3 className="font-bold text-sm text-textPrimary mb-3">{t('currentQuality')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('grade')}</p>
            <p className="font-semibold text-textPrimary">{batch?.qualityGrade || t('pending')}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('qualityScore')}</p>
            <p className="font-semibold text-textPrimary">{batch?.qualityScore ?? '—'}</p>
          </div>
          {batch?.notes && (
            <div className="col-span-2 sm:col-span-3">
              <p className="text-[10px] uppercase font-bold text-textMuted">{t('notes')}</p>
              <p className="font-medium text-textSecondary">{batch.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* C. Processing Journey */}
      <Card className="mb-4">
        <h3 className="font-bold text-sm text-textPrimary mb-4 flex items-center gap-1.5">
          <Layers size={15} className="text-primary" /> {t('processingJourney')}
        </h3>
        <div className="relative pl-6 space-y-5 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {JOURNEY_STAGES.map((stage, idx) => {
            const isCurrent = idx === stageIdx;
            const isDone = idx < stageIdx;
            return (
              <div key={stage.key} className="relative">
                <div
                  className={`absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 z-10 ${
                    isCurrent
                      ? 'bg-primary border-primary'
                      : isDone
                      ? 'bg-primary/70 border-primary/70'
                      : 'bg-surface border-border'
                  }`}
                />
                <p className={`text-sm font-semibold ${isCurrent ? 'text-primary' : isDone ? 'text-textPrimary' : 'text-textMuted'}`}>
                  {t(stage.labelKey)}
                  {isCurrent && (
                    <span className="ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primaryLight text-primary">{t('current')}</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* D. Processing Information */}
      <Card className="mb-4">
        <h3 className="font-bold text-sm text-textPrimary mb-3">{t('processingInformationTitle')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('processingTypeLabel')}</p>
            <p className="font-semibold text-textPrimary">{request.service_type}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('currentProcessingStage')}</p>
            <p className="font-semibold text-textPrimary">
              {request.status === 'in_progress' ? t('statusInProgressArtisan') : request.status === 'completed' ? t('completed') : t('statusRequested')}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textMuted">{t('startDateLabel')}</p>
            <p className="font-semibold text-textPrimary flex items-center gap-1">
              <Calendar size={12} className="text-textMuted" />
              {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </Card>

      {/* E. Action buttons */}
      <Card>
        <h3 className="font-bold text-sm text-textPrimary mb-3">{t('quickActions')}</h3>

        {(request.status === 'requested' || request.status === 'accepted') && !showStartForm && (
          <Button icon={Cog} onClick={() => setShowStartForm(true)}>{t('actionStartProcessing')}</Button>
        )}

        {(request.status === 'requested' || request.status === 'accepted') && showStartForm && (
          <div className="mt-2">
            <Input
              label={t('notesOptional')}
              multiline
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('notesOptional')}
            />
            <div className="flex gap-2">
              <Button fullWidth={false} variant="outline" onClick={() => setShowStartForm(false)}>{t('cancel')}</Button>
              <Button fullWidth={false} loading={submitting} onClick={() => handleStatusChange('in_progress')}>{t('submitStartProcessing')}</Button>
            </div>
          </div>
        )}

        {request.status === 'in_progress' && (
          <div className="space-y-3">
            <Input
              label={t('addNoteOptional')}
              multiline
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('addNoteOptional')}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button fullWidth={false} variant="secondary" icon={Cog} loading={submitting} onClick={() => handleStatusChange('in_progress')}>
                {t('updateProcessingAction')}
              </Button>
              <Button fullWidth={false} icon={CheckCircle} loading={submitting} onClick={() => handleStatusChange('completed')}>
                {t('actionMarkComplete')}
              </Button>
              <Button
                fullWidth={false}
                variant="outline"
                icon={ClipboardCheck}
                onClick={() => navigate('/artisan/quality', { state: { batchId: batch?._id || batch?.id, batchLabel: request.batch_id } })}
              >
                {t('actionSendForQuality')}
              </Button>
            </div>
          </div>
        )}

        {request.status === 'completed' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              fullWidth={false}
              variant="outline"
              icon={ClipboardCheck}
              onClick={() => navigate('/artisan/quality', { state: { batchId: batch?._id || batch?.id, batchLabel: request.batch_id } })}
            >
              {t('actionSendForQuality')}
            </Button>
            <Button fullWidth={false} variant="secondary" icon={CheckCircle} onClick={() => navigate('/artisan/completed')}>
              {t('viewCompletedWork')}
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
