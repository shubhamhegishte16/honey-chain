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
  ArrowUpRight
} from 'lucide-react';
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent mb-3" />
        <p className="text-xs font-bold font-serif text-[#281D1C]">Loading Honey Lot...</p>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FBEBEB] text-[#861C1C]">
          <Package size={24} />
        </span>
        <h2 className="text-lg font-bold font-serif text-[#281D1C]">Honey Batch Not Found</h2>
        <p className="text-xs text-[#5E524D]">{error || 'The requested honey batch could not be located.'}</p>
        <button onClick={() => navigate('/farmer/tracking')} className="mt-2 px-5 py-2 rounded-full bg-[#861C1C] text-white text-xs font-bold">
          Back to Honey Lots
        </button>
      </div>
    );
  }

  const isOwner = true;
  const floralSource = batch.floralSource || batch.wool_type || 'Mustard Blossom Raw Honey';
  const batchIdDisplay = batch.batch_id || batch.batchId || batch.id;

  return (
    <main className="page-shell max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/farmer/tracking"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E524D] hover:text-[#281D1C] transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Honey Lots</span>
        </Link>

        <span className="text-xs text-[#C06E30] font-mono font-bold">
          Lot ID: {batchIdDisplay}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
        
        {/* Left Column: Showcase & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Visual Showcase Card */}
          <div className="rounded-3xl overflow-hidden border border-[#E8E3CF] bg-gradient-to-br from-[#281D1C] to-[#3D2928] text-white p-6 shadow-card relative flex flex-col items-center justify-center min-h-[240px]">
            <div className="absolute top-3 right-3">
              <BatchStatusBadge status={batch.status} />
            </div>
            
            <div className="w-16 h-16 rounded-2xl bg-[#F4B345] text-[#281D1C] flex items-center justify-center text-3xl shadow-gold mb-3">
              🍯
            </div>
            
            <h3 className="font-bold font-serif text-lg text-white text-center">{floralSource}</h3>
            <p className="text-xs text-[#F4B345] text-center mt-0.5">Single-Origin Raw Bee Honey</p>
            
            <div className="mt-4 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/15">
              <Scale size={13} className="text-[#F4B345]" /> {batch.quantity_kg || batch.quantityKg || 60} kg Lot
            </div>
          </div>

          {/* Action Hub Bento Card */}
          <div className="rounded-3xl bg-white border border-[#E8E3CF] p-5 shadow-card space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C06E30] block mb-1">
              Honey Lot Passport Actions
            </span>

            <button
              onClick={() => navigate(`/batches/${batch._id || batch.id}/qr`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FEF6E4] border border-[#F4B345]/40 text-[#281D1C] font-bold text-xs hover:bg-[#FDE8B5] transition-all hover:scale-[1.01]"
            >
              <span className="flex items-center gap-2.5">
                <QrCode size={18} className="text-[#C06E30]" /> Print Consumer QR Stickers
              </span>
              <span className="text-[11px] text-[#C06E30] font-bold">Print →</span>
            </button>

            <button
              onClick={() => navigate(`/buyer/honey-passport/${batchIdDisplay}`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs hover:bg-emerald-100 transition-all hover:scale-[1.01]"
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-700" /> View Public Honey Passport
              </span>
              <span className="text-[11px] text-emerald-800 font-bold">Inspect →</span>
            </button>

            <button
              onClick={() => navigate(`/batches/${batch._id || batch.id}/traceability`)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] text-[#281D1C] font-bold text-xs hover:border-[#D6CEB5] transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Layers size={18} className="text-[#5E524D]" /> Blockchain Traceability Ledger
              </span>
              <span className="text-[11px] text-[#5E524D]">Blocks #0-3 →</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setIsProcessingModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#861C1C] text-white font-bold text-xs shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-[1.01]"
              >
                <span className="flex items-center gap-2.5">
                  <Cog size={18} /> Send to Bottling Facility
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Process →</span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => navigate(`/farmer/marketplace`)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#C06E30] text-white font-bold text-xs shadow-sm hover:bg-[#A95D26] transition-all hover:scale-[1.01]"
              >
                <span className="flex items-center gap-2.5">
                  <Store size={18} /> List on Buyer Mandi
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Trade →</span>
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

        {/* Right Column: Details & Provenance Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E8E3CF] p-6 sm:p-8 shadow-card">
            
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E8E3CF]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#861C1C] bg-[#FBEBEB] px-3 py-1 rounded-full border border-[#861C1C]/20">
                  {floralSource}
                </span>
                <h1 className="text-2xl font-bold font-serif text-[#281D1C] mt-2">
                  {batchIdDisplay}
                </h1>
                <p className="text-xs text-[#5E524D] mt-1 flex items-center gap-1">
                  <MapPin size={13} className="text-[#861C1C]" />
                  {batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B]">Harvest Weight</span>
                <p className="text-2xl font-black text-[#861C1C] font-serif">{batch.quantity_kg || batch.quantityKg || 60} kg</p>
              </div>
            </div>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
                <span className="text-[10px] uppercase font-bold text-[#9B918B] block">Purity Grade</span>
                <span className="font-bold text-xs sm:text-sm text-[#281D1C] mt-0.5 block">
                  {batch.qualityGrade || 'Grade A+ (NMR Certified)'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
                <span className="text-[10px] uppercase font-bold text-[#9B918B] block">Purity Score</span>
                <span className="font-bold text-xs sm:text-sm text-emerald-800 mt-0.5 block">
                  {batch.qualityScore ? `${batch.qualityScore}/100` : '98/100'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
                <span className="text-[10px] uppercase font-bold text-[#9B918B] block">Extraction Date</span>
                <span className="font-bold text-xs sm:text-sm text-[#281D1C] mt-0.5 block truncate">
                  {batch.extractionDate || batch.shearing_date ? new Date(batch.extractionDate || batch.shearing_date).toLocaleDateString() : '14 Feb 2026'}
                </span>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E8E3CF]/50">
                <span className="text-[#5E524D]">Certified Beekeeper</span>
                <strong className="text-[#281D1C]">{batch.users?.name || batch.farmer?.name || profile?.name || 'Ramesh Singh'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-[#E8E3CF]/50">
                <span className="text-[#5E524D]">Apiary Cluster &amp; Region</span>
                <strong className="text-[#281D1C]">{batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-[#E8E3CF]/50">
                <span className="text-[#5E524D]">Bee Box Units</span>
                <strong className="text-[#281D1C]">{batch.farm_location || batch.farmLocation || 'KVIC Hive Units #1 to #25'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-[#E8E3CF]/50">
                <span className="text-[#5E524D]">Bee Species</span>
                <strong className="text-[#281D1C]">{batch.beeSpecies || 'Apis mellifera'}</strong>
              </div>

              <div className="flex justify-between py-2 border-b border-[#E8E3CF]/50">
                <span className="text-[#5E524D]">Genesis Block Hash</span>
                <strong className="text-[#861C1C] font-mono text-[11px] truncate max-w-[220px]">
                  {batch.blockHash || '0x7e8f23a91b4028e49d68241cfda609e2'}
                </strong>
              </div>

              {batch.notes && (
                <div className="py-2">
                  <span className="text-[#5E524D] block mb-1">Harvest &amp; Extraction Remarks</span>
                  <p className="text-[#281D1C] bg-[#FAF7EE] p-3.5 rounded-2xl border border-[#E8E3CF] leading-relaxed">
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
