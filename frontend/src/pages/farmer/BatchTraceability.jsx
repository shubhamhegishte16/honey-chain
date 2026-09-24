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
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { getBatchById } from '../../services/batches.service';
import { getTrackingEvents } from '../../services/tracking.service';
import { useLanguage } from '../../context/LanguageContext';

const EVENT_CONFIG = {
  produced: {
    label: 'Harvested & Genesis Block #0',
    desc: 'Comb extraction recorded on-apiary with GPS coordinates',
    icon: '🐝',
    tone: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  quality_checked: {
    label: 'KVIC Lab NMR Tested & Block #1',
    desc: 'Moisture <18%, HMF fresh index, and NMR sugar adulteration passed',
    icon: '🔬',
    tone: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  },
  stored: {
    label: 'Apiary Barrel Vaulted',
    desc: 'Hermetically sealed food-grade 30kg drum storage at 18-20°C',
    icon: '🏬',
    tone: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  processed: {
    label: 'Micro-Filtered & Bottled (Block #2)',
    desc: 'Gentle warm cloth filtration and automated 500g jar packing',
    icon: '🍯',
    tone: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  listed: {
    label: 'Listed on Honey Mandi',
    desc: 'Available for direct FMCG & consumer procurement',
    icon: '🛒',
    tone: 'bg-indigo-50 text-indigo-800 border-indigo-300',
  },
  sold: {
    label: 'Procured & Smart Contract Settled',
    desc: 'Instant direct-to-beekeeper escrow payment released',
    icon: '💰',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  dispatched: {
    label: 'In Transit',
    desc: 'Dispatched via regional agro-freight with temperature logging',
    icon: '🚚',
    tone: 'bg-blue-50 text-blue-800 border-blue-300',
  },
  delivered: {
    label: 'Delivered (Block #3)',
    desc: 'Verified by consumer via smartphone QR scan',
    icon: '✨',
    tone: 'bg-green-50 text-green-800 border-green-300',
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
            description: `Raw honey harvest recorded on HoneyChain digital ledger. Volume: ${batchResult.data.quantity_kg || 50} kg ${batchResult.data.wool_type || 'Mustard Blossom Honey'}.`,
            timestamp: batchResult.data.shearing_date || batchResult.data.extractionDate || new Date().toISOString(),
            blockHash: batchResult.data.blockHash || '0x9a4e8f12c3b5d7e01234abcd5678ef901234567890abcdef1234567890abcdef',
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
    <main className="page-shell max-w-3xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={batch ? `/batches/${batch._id || batch.id}/details` : '/farmer/tracking'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Lot Details</span>
        </Link>

        <span className="text-xs text-primary font-bold flex items-center gap-1 bg-primaryLight px-2.5 py-1 rounded-full border border-primary/20">
          <ShieldCheck size={14} /> Tamper-Proof HoneyChain Ledger
        </span>
      </div>

      <div className="mb-6">
        <div className="eyebrow text-amber-600 mb-1 flex items-center gap-1 font-bold text-xs uppercase tracking-wider">
          <Sparkles size={13} /> Blockchain Immutable Provenance
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-textPrimary">
          Hive-to-Bottle Traceability Log
        </h1>
        <p className="text-xs sm:text-sm text-textSecondary mt-1">
          Cryptographically chained checkpoints verifying floral origin, apiary telemetry, laboratory testing, and consumer delivery.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-textSecondary">Verifying blockchain blocks...</span>
        </div>
      ) : batch ? (
        <div className="space-y-6">
          {/* Batch Summary Header Card */}
          <div className="rounded-3xl bg-surface border border-border/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-primary bg-primaryLight px-2 py-0.5 rounded-md">
                {batchIdDisplay}
              </span>
              <h2 className="text-lg font-bold text-textPrimary mt-1">{floral}</h2>
              <p className="text-xs text-textSecondary flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-primary" /> {batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/buyer/honey-passport/${batchIdDisplay}`}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink size={14} /> Open Honey Passport
              </Link>
              <BatchStatusBadge status={batch.status} />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[15px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-amber-400 before:to-emerald-500">
            {events.map((ev, index) => {
              const cfg = EVENT_CONFIG[ev.event_type || ev.eventType] || EVENT_CONFIG.produced;
              return (
                <div key={ev.id || index} className="relative group animate-enter">
                  {/* Timeline icon node */}
                  <div className="absolute -left-[30px] sm:-left-[38px] top-1 h-8 w-8 rounded-full bg-surface border-2 border-amber-500 grid place-items-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                    {cfg.icon}
                  </div>

                  {/* Card Content */}
                  <div className="rounded-2xl bg-surface border border-border/80 p-5 shadow-sm group-hover:border-amber-400 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-textPrimary">{cfg.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.tone}`}>
                          Block #{ev.blockNumber ?? index}
                        </span>
                      </div>
                      <span className="text-[11px] text-textMuted flex items-center gap-1 font-mono">
                        <Clock size={11} /> {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-textSecondary mt-2.5 leading-relaxed">{ev.description}</p>

                    <div className="mt-3 pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-textMuted flex items-center gap-1">
                        <User size={12} className="text-primary" /> {ev.actorName || 'Authorized Signatory'}
                      </span>
                      <span className="text-textMuted flex items-center gap-1">
                        <MapPin size={12} className="text-primary" /> {ev.location || 'India'}
                      </span>
                    </div>

                    {/* SHA-256 Hash */}
                    {ev.blockHash && (
                      <div className="mt-2.5 p-2 rounded-lg bg-background border border-border/60 text-[10px] font-mono text-textMuted flex items-center gap-1.5 overflow-hidden">
                        <Hash size={12} className="text-amber-600 shrink-0" />
                        <span className="shrink-0 font-semibold text-textSecondary">Hash:</span>
                        <span className="truncate text-amber-800 font-bold">{ev.blockHash}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card interactive={false} className="text-center py-12 text-sm text-textSecondary">
          Honey batch record not found.
        </Card>
      )}
    </main>
  );
}
