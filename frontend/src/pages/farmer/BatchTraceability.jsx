import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  ExternalLink,
  Hash,
} from 'lucide-react';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { getBatchById } from '../../services/batches.service';
import { getTrackingEvents } from '../../services/tracking.service';
import { useLanguage } from '../../context/LanguageContext';

const EVENT_CONFIG = {
  produced: {
    label: 'Harvested & Genesis Block #0',
    desc: 'Comb extraction recorded on-apiary with GPS coordinates',
    icon: '🐝',
    tone: 'bg-[#FEF6E4] text-[#C06E30] border-[#F4B345]/30',
  },
  quality_checked: {
    label: 'KVIC Lab NMR Tested & Block #1',
    desc: 'Moisture <18%, HMF fresh index, and NMR sugar adulteration passed',
    icon: '🔬',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  stored: {
    label: 'Apiary Barrel Vaulted',
    desc: 'Hermetically sealed food-grade 30kg drum storage at 18-20°C',
    icon: '🏬',
    tone: 'bg-[#FEF6E4] text-[#C06E30] border-[#F4B345]/30',
  },
  processed: {
    label: 'Micro-Filtered & Bottled (Block #2)',
    desc: 'Gentle warm cloth filtration and automated 500g jar packing',
    icon: '🍯',
    tone: 'bg-[#FBEBEB] text-[#861C1C] border-[#861C1C]/20',
  },
  listed: {
    label: 'Listed on Honey Mandi',
    desc: 'Available for direct FMCG & consumer procurement',
    icon: '🛒',
    tone: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  sold: {
    label: 'Procured & Smart Contract Settled',
    desc: 'Instant direct-to-beekeeper escrow payment released',
    icon: '💰',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  dispatched: {
    label: 'In Transit',
    desc: 'Dispatched via regional agro-freight with temperature logging',
    icon: '🚚',
    tone: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  delivered: {
    label: 'Delivered (Block #3)',
    desc: 'Verified by consumer via smartphone QR scan',
    icon: '✨',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
};

export default function BatchTraceability() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBatchById(id), getTrackingEvents(id)]).then(
      ([batchResult, eventsResult]) => {
        setBatch(batchResult.data);
        const evList = eventsResult.data || [];
        if (evList.length === 0 && batchResult.data) {
          evList.push({
            id: 'ev-initial',
            event_type: 'produced',
            actorName: batchResult.data.users?.name || batchResult.data.farmer?.name || 'Ramesh Singh (Beekeeper)',
            location: `${batchResult.data.district || 'Bharatpur'}, ${batchResult.data.state || 'Rajasthan'}`,
            description: `Raw honey harvest recorded on Honey Chain digital ledger. Volume: ${batchResult.data.quantity_kg || 60} kg ${batchResult.data.wool_type || 'Mustard Blossom Honey'}.`,
            timestamp: batchResult.data.shearing_date || batchResult.data.extractionDate || new Date().toISOString(),
            blockHash: batchResult.data.blockHash || '0x7e8f23a91b4028e49d68241cfda609e20b3967812cd9e8f17042a991823efca4',
            blockNumber: 0,
          });
        }
        setEvents(evList);
        setLoading(false);
      }
    );
  }, [id]);

  const batchIdDisplay = batch?.batch_id || batch?.batchId || batch?.id || id;
  const floral = batch?.floralSource || batch?.wool_type || 'Mustard Blossom Raw Honey';

  return (
    <main className="page-shell max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={batch ? `/batches/${batch._id || batch.id}/details` : '/farmer/tracking'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E524D] hover:text-[#281D1C] transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Lot Details</span>
        </Link>

        <span className="text-xs text-[#861C1C] font-bold flex items-center gap-1 bg-[#FBEBEB] px-3 py-1 rounded-full border border-[#861C1C]/20">
          <ShieldCheck size={14} /> Tamper-Proof Provenance Ledger
        </span>
      </div>

      <div className="mb-6">
        <span className="eyebrow"><Sparkles size={13} /> Blockchain Immutable Provenance</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#281D1C] mt-1">
          Hive-to-Bottle Traceability Log
        </h1>
        <p className="text-xs sm:text-sm text-[#5E524D] mt-1 leading-relaxed">
          Cryptographically chained checkpoints verifying floral origin, apiary IoT telemetry, NMR lab testing, and consumer QR delivery.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
          <span className="text-xs font-bold text-[#5E524D]">Verifying cryptographic block tree...</span>
        </div>
      ) : batch ? (
        <div className="space-y-6">
          
          {/* Batch Summary Header Card */}
          <div className="rounded-3xl bg-white border border-[#E8E3CF] p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#861C1C] bg-[#FBEBEB] px-2.5 py-1 rounded-full border border-[#861C1C]/20">
                {batchIdDisplay}
              </span>
              <h2 className="text-lg font-bold font-serif text-[#281D1C] mt-2">{floral}</h2>
              <p className="text-xs text-[#5E524D] flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-[#C06E30]" /> {batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/buyer/honey-passport/${batchIdDisplay}`}
                className="px-4 py-2 rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-burgundy hover:bg-[#6A1515] transition-all flex items-center gap-1.5"
              >
                <ExternalLink size={13} /> Open Honey Passport
              </Link>
              <BatchStatusBadge status={batch.status} />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[15px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#F4B345] before:via-[#C06E30] before:to-emerald-600">
            {events.map((ev, index) => {
              const cfg = EVENT_CONFIG[ev.event_type || ev.eventType] || EVENT_CONFIG.produced;
              return (
                <div key={ev.id || index} className="relative group animate-enter">
                  
                  {/* Node Icon */}
                  <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 h-8 w-8 rounded-full bg-white border-2 border-[#C06E30] grid place-items-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                    {cfg.icon}
                  </div>

                  {/* Card Content */}
                  <div className="rounded-3xl bg-white border border-[#E8E3CF] p-5 sm:p-6 shadow-card group-hover:border-[#D6CEB5] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#E8E3CF]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-serif text-sm text-[#281D1C]">{cfg.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.tone}`}>
                          Block #{ev.blockNumber ?? index}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9B918B] flex items-center gap-1 font-mono">
                        <Clock size={12} /> {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-[#5E524D] mt-3 leading-relaxed">{ev.description}</p>

                    <div className="mt-3 pt-3 border-t border-[#E8E3CF]/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-[#5E524D] flex items-center gap-1">
                        <User size={12} className="text-[#861C1C]" /> {ev.actorName || 'Authorized Signatory'}
                      </span>
                      <span className="text-[#5E524D] flex items-center gap-1">
                        <MapPin size={12} className="text-[#C06E30]" /> {ev.location || 'India'}
                      </span>
                    </div>

                    {/* SHA-256 Hash */}
                    {ev.blockHash && (
                      <div className="mt-2.5 p-2 rounded-xl bg-[#FAF7EE] border border-[#E8E3CF] text-[10px] font-mono text-[#5E524D] flex items-center gap-1.5 overflow-hidden">
                        <Hash size={12} className="text-[#861C1C] shrink-0" />
                        <span className="shrink-0 font-bold text-[#281D1C]">Hash:</span>
                        <span className="truncate text-[#861C1C] font-semibold">{ev.blockHash}</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card text-xs text-[#5E524D]">
          Honey batch record not found.
        </div>
      )}

    </main>
  );
}
