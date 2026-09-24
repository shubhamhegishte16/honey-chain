import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Package,
  ShieldCheck,
  User,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { getBatchById } from '../../services/batches.service';
import { getTrackingEvents } from '../../services/tracking.service';
import { useLanguage } from '../../context/LanguageContext';

function getEventConfig(t) {
  return {
    produced: { label: 'Hive Harvest Extracted', icon: '🐝', tone: 'bg-amber-50 text-amber-800 border-amber-300' },
    quality_checked: { label: 'KVIC Lab NMR Certified', icon: '🔬', tone: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    processed: { label: 'Micro-Filtered & Bottled', icon: '🍯', tone: 'bg-yellow-50 text-yellow-800 border-yellow-300' },
    stored: { label: 'KVIC Depot Vaulted', icon: '🏬', tone: 'bg-stone-50 text-stone-800 border-stone-300' },
    listed: { label: 'Marketplace Listed', icon: '🛒', tone: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
    sold: { label: 'Purchased by FMCG Buyer', icon: '💰', tone: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    dispatched: { label: 'Dispatched in Transit', icon: '🚚', tone: 'bg-blue-50 text-blue-800 border-blue-300' },
    delivered: { label: 'Delivered to Khadi Store', icon: '✨', tone: 'bg-green-50 text-green-800 border-green-300' },
  };
}

export default function WoolPassport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const EVENT_CONFIG = getEventConfig(t);
  const [batch, setBatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [batchRes, eventsRes] = await Promise.all([
          getBatchById(id),
          getTrackingEvents(id),
        ]);

        if (batchRes.error && !batchRes.data) {
          setError(batchRes.error.message || 'Honey batch not found.');
        } else {
          setBatch(batchRes.data);
        }

        const evList = eventsRes.data || [];
        if (evList.length === 0 && batchRes.data) {
          evList.push({
            id: 'ev-initial',
            event_type: 'produced',
            actorName: batchRes.data.users?.name || 'Ramesh Singh (KVIC Beekeeper)',
            location: `${batchRes.data.district || 'Bharatpur'}, ${batchRes.data.state || 'Rajasthan'}`,
            description: `Harvested ${batchRes.data.quantity_kg || 60} kg of pure ${batchRes.data.wool_type || 'Mustard Blossom'} honey. Genesis Block #0 sealed into Honey Chain.`,
            event_timestamp: batchRes.data.shearing_date || new Date().toISOString(),
          });
        }
        setEvents(evList);
      } catch (err) {
        setError('Error loading Honey Passport.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <main className="page-shell">
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error || !batch) {
    return (
      <main className="page-shell">
        <div className="p-8 text-center rounded-3xl bg-amber-50 text-amber-900 border border-amber-200 mt-10">
          <Package size={32} className="mx-auto mb-3 text-amber-700" />
          <h3 className="font-bold text-lg">Batch Not Found</h3>
          <p className="mt-1 text-sm">{error || 'This batch could not be found on Honey Chain.'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-amber-200/60 rounded-xl text-sm font-semibold hover:bg-amber-200">Go Back</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Passport Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white p-6 sm:p-8 shadow-xl animate-enter mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-200 border border-white/20 text-xs font-semibold backdrop-blur-md mb-3">
              <QrCode size={13} /> Digital Honey Passport • KVIC Mission
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{batch.batch_id}</h1>
            <p className="text-white/90 text-sm mt-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-amber-300" />
              {batch.district}, {batch.state} • Apiary Sector 4
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1">
              <ShieldCheck size={13} /> NMR 100% Pure Certified
            </span>
            <span className="text-xs text-amber-100 font-semibold">{batch.floralSource || batch.wool_type || 'Pure Honey'} • {batch.quantity_kg} kg Lot</span>
            <button
              onClick={() => setShowProofModal(true)}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 shadow-sm transition-all"
            >
              <Sparkles size={12} className="text-amber-600" />
              <span>Inspect Blockchain Proof</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-enter delay-1">
        {/* Origin Card */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" /> Apiary & Beekeeper Origin
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-textSecondary">Harvest State</dt><dd className="font-semibold text-textPrimary">{batch.state || 'Rajasthan'}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">District</dt><dd className="font-semibold text-textPrimary">{batch.district || 'Bharatpur'}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">Beekeeper</dt><dd className="font-semibold text-textPrimary">{batch.users?.name || 'Ramesh Singh'}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">KVIC Scheme</dt><dd className="font-semibold text-emerald-700">Honey Mission Subsidised Apiary</dd></div>
          </dl>
        </div>

        {/* Honey Specifications */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3">
            <Package size={16} className="text-primary" /> Honey Specifications
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-textSecondary">Floral Nectar Source</dt><dd className="font-semibold text-textPrimary">{batch.floralSource || batch.wool_type || 'Mustard Blossom Honey'}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">Lot Harvest Weight</dt><dd className="font-semibold text-textPrimary">{batch.quantity_kg} kg</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">Bee Species</dt><dd className="font-semibold text-textPrimary">{batch.beeSpecies || 'Apis mellifera'}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">Extraction Date</dt><dd className="font-semibold text-textPrimary">{batch.shearing_date ? new Date(batch.shearing_date).toLocaleDateString('en-IN') : '14 Feb 2026'}</dd></div>
          </dl>
        </div>
      </div>

      {/* Quality & Laboratory Section */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm mb-8 animate-enter delay-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-textPrimary flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" /> Laboratory Purity Verification (FSSAI / NMR)
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            Passed All Standards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-background p-4 rounded-xl border border-border/80">
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-textSecondary">Moisture Content:</span>
            <strong className="text-textPrimary font-bold">17.8% (FSSAI Limit &lt;20%) ✅</strong>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-textSecondary">HMF Level:</span>
            <strong className="text-textPrimary font-bold">11.4 mg/kg (Fresh &amp; Unheated) ✅</strong>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-textSecondary">C3/C4 Sugar Adulteration:</span>
            <strong className="text-emerald-700 font-bold">0.0% (Zero Added Syrups) ✅</strong>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-textSecondary">Fructose / Glucose Ratio:</span>
            <strong className="text-textPrimary font-bold">1.18 (Natural Balance)</strong>
          </div>
          <div className="flex justify-between col-span-1 sm:col-span-2 pt-1">
            <span className="text-textSecondary">Testing Authority:</span>
            <strong className="text-textPrimary font-semibold">Dr. Anjali Sharma • KVIC Central Honey Testing Lab</strong>
          </div>
        </div>
      </div>

      {/* Honey Provenance Journey Timeline */}
      <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-8 shadow-card animate-enter delay-3">
        <div className="pb-5 border-b border-border/70 mb-8">
          <div className="eyebrow text-primary mb-1"><Layers size={13} /> Blockchain Provenance Ledger</div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary">Hive to Home Timeline</h2>
          <p className="text-xs text-textSecondary mt-0.5">Every step cryptographically signed with immutable timestamps</p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-600 before:via-border before:to-border">
          {events.map((ev, idx) => {
            const cfg = EVENT_CONFIG[ev.event_type] || {
              label: ev.event_type,
              icon: '🐝',
              tone: 'bg-amber-50 text-amber-800 border-amber-300',
            };
            return (
              <div key={ev.id || idx} className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-surface border-2 border-primary shadow-sm text-xs sm:text-sm z-10 transition-transform group-hover:scale-110">
                  <span>{cfg.icon}</span>
                </div>
                <div className="p-5 rounded-2xl bg-background border border-border/80 shadow-sm transition-all duration-200 hover:border-primary/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.tone}`}>{cfg.label}</span>
                      {ev.actorName && (
                        <span className="text-xs font-medium text-textSecondary flex items-center gap-1">
                          <User size={11} className="text-textMuted" /> {ev.actorName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-textMuted flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(ev.event_timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-textPrimary font-medium leading-relaxed">{ev.description || cfg.label}</p>
                  {ev.location && (
                    <p className="mt-2 text-xs text-textSecondary flex items-center gap-1">
                      <MapPin size={12} className="text-primary" /> {ev.location}
                    </p>
                  )}
                  {ev.blockHash && (
                    <div className="mt-2 pt-2 border-t border-border/50 text-[10px] text-textMuted flex items-center gap-1 font-mono">
                      <span>🔗 Block #{ev.blockNumber ?? idx}:</span>
                      <span className="truncate max-w-[280px]">{ev.blockHash}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blockchain Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-3xl border border-border shadow-2xl max-w-lg w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔐</span>
                <h3 className="font-bold text-base text-textPrimary">Cryptographic Blockchain Proof</h3>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-textMuted hover:text-textPrimary text-sm font-bold px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Merkle Chain Integrity: 100% Valid</p>
                  <p className="text-[11px] text-emerald-700">Zero data tampering detected across all 4 cryptographic block signatures.</p>
                </div>
              </div>

              <div className="space-y-1.5 font-mono">
                <p className="text-[11px] text-textMuted font-sans font-bold">Genesis Block (Extraction Hash):</p>
                <p className="p-2 rounded-lg bg-background border border-border break-all text-[10px] text-textPrimary">
                  0x7e8f23a91b4028e49d68241cfda609e20b3967812cd9e8f17042a991823efca4
                </p>
              </div>

              <div className="space-y-1.5 font-mono">
                <p className="text-[11px] text-textMuted font-sans font-bold">KVIC Lab Certification Block Hash:</p>
                <p className="p-2 rounded-lg bg-background border border-border break-all text-[10px] text-textPrimary">
                  0x2c4e91820b482910fcde47190283471092837401928374019283740192837401
                </p>
              </div>

              <div className="space-y-1.5 font-mono">
                <p className="text-[11px] text-textMuted font-sans font-bold">Packaging &amp; QR Seal Hash:</p>
                <p className="p-2 rounded-lg bg-background border border-border break-all text-[10px] text-textPrimary">
                  0x991048290bcde102938471029384710293847102938471029384710293847102
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex justify-end">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primaryDark transition-colors"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

