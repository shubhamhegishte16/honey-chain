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
  ShieldCheck,
  Activity,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import RequestProcessingModal from '../../components/processing/RequestProcessingModal';
import { getBatchById } from '../../services/batches.service';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

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
      if (fetchError) setError('Unable to load honey lot details.');
      else setBatch(data);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

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
        <h2 className="text-lg font-bold text-textPrimary">Honey Batch Not Found</h2>
        <p className="text-sm text-textSecondary">{error || 'The requested honey batch could not be located.'}</p>
        <Button title="Back to Honey Lots" variant="text" onClick={() => navigate('/farmer/tracking')} fullWidth={false} />
      </div>
    );
  }

  const isOwner = true; // allow testing directly on localhost
  const floralSource = batch.floralSource || batch.wool_type || 'Mustard Blossom Raw Honey';
  const batchIdDisplay = batch.batch_id || batch.batchId || batch.id;

  return (
    <main className="page-shell max-w-4xl mx-auto py-6">
      {/* Top Breadcrumb & Action */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/farmer/tracking"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to All Apiary Batches</span>
        </Link>

        <span className="text-xs text-textMuted font-mono font-semibold">
          Lot ID: {batchIdDisplay}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
        {/* Left Column: Image & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-br from-amber-500/20 via-amber-100 to-amber-200/40 p-6 shadow-sm relative group flex flex-col items-center justify-center min-h-[220px]">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-amber-500 text-white shadow-md mb-3">
              <span className="text-3xl">🍯</span>
            </div>
            <h3 className="font-extrabold text-base text-amber-950 text-center">{floralSource}</h3>
            <p className="text-xs text-amber-800 text-center mt-1">Single-Origin Raw Bee Honey</p>
            <div className="absolute top-3 right-3">
              <BatchStatusBadge status={batch.status} />
            </div>
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
              <Scale size={13} /> {batch.quantity_kg || batch.quantityKg || 50} kg
            </div>
          </div>

          {/* Action Hub */}
          <div className="rounded-3xl bg-surface border border-border/80 p-5 shadow-sm space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">
              Honey Lot Passport Actions
            </p>

            <button
              onClick={() => navigate(`/batches/${batch._id || batch.id}/qr`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primaryLight/70 border border-primary/30 text-amber-900 font-bold text-sm hover:bg-primaryLight transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <QrCode size={18} className="text-primary" /> Consumer QR Label
              </span>
              <span className="text-xs font-semibold text-primary">Print QR →</span>
            </button>

            <button
              onClick={() => navigate(`/buyer/honey-passport/${batchIdDisplay}`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm hover:bg-emerald-100 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-700" /> Digital Honey Passport
              </span>
              <span className="text-xs font-semibold text-emerald-800">View Public →</span>
            </button>

            <button
              onClick={() => navigate(`/batches/${batch._id || batch.id}/traceability`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border text-textPrimary font-semibold text-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Layers size={18} className="text-textMuted" /> Blockchain Timeline
              </span>
              <span className="text-xs text-textMuted">Blocks #0-3 →</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setIsProcessingModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-sm shadow-sm hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Cog size={18} /> Send to Bottling Plant
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">Process →</span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => navigate(`/farmer/marketplace`)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-accentLight/50 border border-accent/20 text-accent font-bold text-sm hover:bg-accentLight transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Store size={18} /> List on Honey Mandi
                </span>
                <span className="text-xs font-semibold">Trade Lot →</span>
              </button>
            )}
          </div>
        </div>

        <RequestProcessingModal
          batch={batch}
          isOpen={isProcessingModalOpen}
          onClose={() => setIsProcessingModalOpen(false)}
          onSuccess={() => {
            setBatch(prev => prev ? { ...prev, status: 'processing_requested' } : prev);
          }}
        />

        {/* Right Column: Specification & Origin Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-border/70">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primaryLight px-2.5 py-1 rounded-full">
                  {floralSource}
                </span>
                <h1 className="text-2xl font-black text-textPrimary mt-2">
                  {batchIdDisplay}
                </h1>
                <p className="text-xs text-textSecondary mt-0.5 flex items-center gap-1">
                  <MapPin size={13} className="text-primary" />
                  {batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-textMuted">Harvest Weight</p>
                <p className="text-2xl font-extrabold text-primary font-mono">{batch.quantity_kg || batch.quantityKg || 50} kg</p>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3 rounded-2xl bg-background border border-border/60">
                <span className="text-[10px] uppercase font-bold text-textMuted block">Purity Grade</span>
                <span className="font-bold text-sm text-textPrimary mt-0.5 block">
                  {batch.qualityGrade || 'Grade A+ (NMR Certified)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background border border-border/60">
                <span className="text-[10px] uppercase font-bold text-textMuted block">Purity Score</span>
                <span className="font-bold text-sm text-emerald-700 mt-0.5 block">
                  {batch.qualityScore ? `${batch.qualityScore}/100` : '98/100'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background border border-border/60">
                <span className="text-[10px] uppercase font-bold text-textMuted block">Extraction Date</span>
                <span className="font-bold text-sm text-textPrimary mt-0.5 block truncate">
                  {batch.extractionDate || batch.shearing_date ? new Date(batch.extractionDate || batch.shearing_date).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">Beekeeper / Apiary Master</span>
                <strong className="text-textPrimary">{batch.users?.name || batch.farmer?.name || profile?.name || 'Ramesh Singh'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">Honey Cluster & District</span>
                <strong className="text-textPrimary">{batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">Bee Box Identification</span>
                <strong className="text-textPrimary">{batch.farm_location || batch.farmLocation || 'KVIC Hive Units #1 to #25'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">Bee Species</span>
                <strong className="text-textPrimary">{batch.beeSpecies || 'Apis mellifera (Italian Bee)'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-textSecondary">Blockchain Genesis Block</span>
                <strong className="text-amber-800 font-mono text-[11px] truncate max-w-[200px]">
                  {batch.blockHash || '0x9a4e8f12c3b5d7e0...'}
                </strong>
              </div>

              {batch.notes && (
                <div className="py-2">
                  <span className="text-textSecondary block mb-1">Harvest & Extraction Notes</span>
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
