import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package,
  QrCode,
  Layers,
  Store,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Scale,
  Award,
  Clock,
  CheckCircle2,
  Share2,
  FileText,
  Cog,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import RequestProcessingModal from '../../components/processing/RequestProcessingModal';
import { getBatchById } from '../../services/batches.service';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const WOOL_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=60';

export default function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBatchById(id).then(({ data, error: fetchError }) => {
      if (!isMounted) return;
      if (fetchError) setError(t('somethingWrongWool', 'Something went wrong while loading your wool. Please try again.'));
      else setBatch(data);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-errorLight text-error">
          <Package size={24} />
        </span>
        <h2 className="text-lg font-bold text-textPrimary">{t('batchNotFound', 'Batch Not Found')}</h2>
        <p className="text-sm text-textSecondary">{error || t('requestedBatchCouldNot', 'The requested batch could not be located.')}</p>
        <Button title={t('backToAllBatches', 'Back to All Batches')} variant="text" onClick={() => navigate('/farmer/tracking')} fullWidth={false} />
      </div>
    );
  }

  const isOwner = profile?.id === batch.farmer_id || profile?.id === batch.farmer;
  const images = batch.wool_batch_images || [];
  const displayImage = images[0]?.image_url || WOOL_IMAGE_FALLBACK;

  return (
    <main className="page-shell max-w-4xl">
      {/* Top Breadcrumb & Action */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/farmer/tracking"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>{t('backToAllBatches', 'Back to All Batches')}</span>
        </Link>

        <span className="text-xs text-textMuted font-mono font-semibold">
          ID: {batch.batch_id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
        {/* Left Column: Image & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-border/80 bg-surface shadow-sm relative group">
            <img
              src={displayImage}
              alt={batch.wool_type}
              className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <BatchStatusBadge status={batch.status} />
            </div>
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
              <Scale size={13} /> {batch.quantity_kg} kg
            </div>
          </div>

          {/* Action Hub */}
          <div className="rounded-3xl bg-surface border border-border/80 p-5 shadow-sm space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">
              {t('lotPassportActions', 'Lot Passport Actions')}
            </p>

            {isOwner && (
              <button
                onClick={() => setIsProcessingModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-sm hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Cog size={18} /> {t('sendToProcessing', 'Send to Processing')}
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{t('requestMill', 'Request Mill')} →</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/batches/${batch._id || batch.id}/qr`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primaryLight/50 border border-primary/20 text-primary font-bold text-sm hover:bg-primaryLight transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <QrCode size={18} /> {t('viewQrCode', 'View QR Code')}
              </span>
              <span className="text-xs font-semibold">{t('scanPrint', 'Scan / Print')} →</span>
            </button>

            <button
              onClick={() => navigate(`/batches/${batch._id || batch.id}/traceability`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border text-textPrimary font-semibold text-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Layers size={18} className="text-textMuted" /> {t('traceabilityTimeline', 'Traceability Timeline')}
              </span>
              <span className="text-xs text-textMuted">{t('history', 'History')} →</span>
            </button>

            {isOwner && (
              <button
                onClick={() => navigate(`/farmer/marketplace`)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-accentLight/50 border border-accent/20 text-accent font-bold text-sm hover:bg-accentLight transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Store size={18} /> {t('sellInMarketplace', 'Sell in Marketplace')}
                </span>
                <span className="text-xs font-semibold">{t('listLot', 'List Lot')} →</span>
              </button>
            )}
          </div>
        </div>

        <RequestProcessingModal
          batch={batch}
          isOpen={isProcessingModalOpen}
          onClose={() => setIsProcessingModalOpen(false)}
          onSuccess={(updatedReq) => {
            setBatch(prev => prev ? { ...prev, status: 'processing_requested' } : prev);
          }}
        />


        {/* Right Column: Specification & Origin Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-border/70">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primaryLight px-2.5 py-1 rounded-full">
                  {batch.wool_type} {t('wool', 'Wool')}
                </span>
                <h1 className="text-2xl font-extrabold text-textPrimary mt-2">
                  {batch.batch_id}
                </h1>
                <p className="text-xs text-textSecondary mt-0.5 flex items-center gap-1">
                  <MapPin size={13} className="text-primary" />
                  {batch.district}, {batch.state}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-textMuted">{t('weight', 'Weight')}</p>
                <p className="text-2xl font-extrabold text-primary font-mono">{batch.quantity_kg} kg</p>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3 rounded-2xl bg-background border border-border/60">
                <span className="text-[10px] uppercase font-bold text-textMuted block">{t('grade', 'Grade')}</span>
                <span className="font-bold text-sm text-textPrimary mt-0.5 block">
                  {batch.qualityGrade || 'Grade A'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background border border-border/60">
                <span className="text-[10px] uppercase font-bold text-textMuted block">{t('qualityScore', 'Quality Score')}</span>
                <span className="font-bold text-sm text-emerald-700 mt-0.5 block">
                  {batch.qualityScore ? `${batch.qualityScore}/100` : '92/100'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background border border-border/60">
                <span className="text-[10px] uppercase font-bold text-textMuted block">{t('shearingDate', 'Shearing Date')}</span>
                <span className="font-bold text-sm text-textPrimary mt-0.5 block truncate">
                  {batch.shearing_date ? new Date(batch.shearing_date).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">{t('producerPastoralist', 'Producer / Pastoralist')}</span>
                <strong className="text-textPrimary">{batch.users?.name || profile?.name || 'Ramesh Choudhary'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">{t('stateDistrict', 'State & District')}</span>
                <strong className="text-textPrimary">{batch.district}, {batch.state}</strong>
              </div>

              {batch.farm_location && (
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-textSecondary">{t('farmLocation', 'Farm / Shed Location')}</span>
                  <strong className="text-textPrimary">{batch.farm_location}</strong>
                </div>
              )}

              {batch.notes && (
                <div className="py-2">
                  <span className="text-textSecondary block mb-1">{t('lotNotes', 'Lot Notes')}</span>
                  <p className="text-textPrimary bg-background p-3 rounded-xl border border-border/60 leading-relaxed">
                    {batch.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
