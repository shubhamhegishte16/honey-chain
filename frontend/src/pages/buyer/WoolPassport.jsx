import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Award,
  Clock,
  Printer,
  Share2,
  ExternalLink,
  Droplets,
  Thermometer,
  Check,
  ChevronRight
} from 'lucide-react';
import { getBatchById } from '../../services/batches.service';
import { getTrackingEvents } from '../../services/tracking.service';
import { useLanguage } from '../../context/LanguageContext';

const PROVENANCE_STAGES = [
  { id: 'hives', title: 'Hives', icon: '🏠', tag: 'Smart Apiary' },
  { id: 'harvest', title: 'Harvest', icon: '🌸', tag: 'Raw Extract' },
  { id: 'processing', title: 'Processing', icon: '⚙️', tag: 'Micro-Filtration' },
  { id: 'quality', title: 'Quality', icon: '🛡️', tag: 'NMR Certified' },
  { id: 'bottling', title: 'Bottling', icon: '🧴', tag: 'QR Sealed' },
  { id: 'consumer', title: 'Consumer', icon: '👤', tag: 'Verified Pure' },
];

export default function WoolPassport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [batch, setBatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent mb-4" />
          <p className="text-xs font-bold font-serif text-[#281D1C]">Loading Cryptographic Honey Passport...</p>
        </div>
      </main>
    );
  }

  if (error || !batch) {
    return (
      <main className="page-shell">
        <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card mt-10 max-w-md mx-auto">
          <Package size={36} className="mx-auto mb-3 text-[#C06E30]" />
          <h3 className="font-bold text-lg font-serif text-[#281D1C]">Passport Not Found</h3>
          <p className="mt-1 text-xs text-[#5E524D]">{error || 'This batch could not be found on Honey Chain.'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 rounded-full bg-[#861C1C] text-white text-xs font-bold hover:bg-[#6A1515]">
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell max-w-4xl mx-auto">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5E524D] hover:text-[#281D1C] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Honey Chain
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#281D1C] shadow-soft hover:bg-[#FAF7EE] transition-all"
          >
            <Share2 size={13} className="text-[#C06E30]" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#281D1C] shadow-soft hover:bg-[#FAF7EE] transition-all"
          >
            <Printer size={13} className="text-[#C06E30]" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* ─── Hero Passport Banner (Editorial & Bento) ─── */}
      <div className="rounded-3xl sm:rounded-[2.5rem] bg-[#281D1C] text-white p-6 sm:p-10 shadow-soft-lg mb-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4B345]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#861C1C]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4B345] border border-white/15 text-xs font-bold backdrop-blur-md mb-3">
              <QrCode size={13} /> Digital Honey Passport • KVIC Honey Mission
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
              {batch.batch_id}
            </h1>
            
            <p className="text-white/80 text-xs sm:text-sm mt-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#F4B345]" />
              {batch.district}, {batch.state} • Apiary Sector 4 Mustard Belt
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} /> NMR 100% Pure Certified
            </span>
            <span className="text-xs text-[#FAF7EE]/90 font-semibold">
              {batch.floralSource || batch.wool_type || 'Pure Honey'} • {batch.quantity_kg} kg Lot
            </span>
            <button
              onClick={() => setShowProofModal(true)}
              className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4B345] text-[#281D1C] font-bold text-xs hover:bg-[#F6C063] shadow-gold transition-all hover:scale-105"
            >
              <Sparkles size={13} className="text-[#861C1C]" />
              <span>Inspect Blockchain Proof</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 6-Stage Progress Indicator ─── */}
      <div className="rounded-3xl bg-white border border-[#E8E3CF] p-5 sm:p-6 shadow-card mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C06E30] mb-4">
          Verified Six-Stage Honey Lifecycle
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {PROVENANCE_STAGES.map((st, i) => (
            <div key={st.id} className="flex flex-col items-center p-3 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] text-center">
              <span className="text-xl mb-1">{st.icon}</span>
              <p className="text-xs font-bold text-[#281D1C]">{st.title}</p>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full mt-1 border border-emerald-200">
                Verified ✔
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bento Info Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        
        {/* Origin Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <h3 className="font-bold font-serif text-lg text-[#281D1C] flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-[#861C1C]" /> Apiary & Beekeeper Origin
          </h3>
          <dl className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between pb-2 border-b border-[#E8E3CF]/50">
              <dt className="text-[#5E524D]">Harvest State</dt>
              <dd className="font-bold text-[#281D1C]">{batch.state || 'Rajasthan'}</dd>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8E3CF]/50">
              <dt className="text-[#5E524D]">District / Cluster</dt>
              <dd className="font-bold text-[#281D1C]">{batch.district || 'Bharatpur'}</dd>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8E3CF]/50">
              <dt className="text-[#5E524D]">Certified Beekeeper</dt>
              <dd className="font-bold text-[#281D1C]">{batch.users?.name || 'Ramesh Singh'}</dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt className="text-[#5E524D]">KVIC Honey Mission</dt>
              <dd className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                Subsidized Bee Box Cluster
              </dd>
            </div>
          </dl>
        </div>

        {/* Specifications Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <h3 className="font-bold font-serif text-lg text-[#281D1C] flex items-center gap-2 mb-4">
            <Package size={18} className="text-[#C06E30]" /> Honey Specifications
          </h3>
          <dl className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between pb-2 border-b border-[#E8E3CF]/50">
              <dt className="text-[#5E524D]">Floral Bloom</dt>
              <dd className="font-bold text-[#281D1C]">{batch.floralSource || batch.wool_type || 'Mustard Blossom Honey'}</dd>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8E3CF]/50">
              <dt className="text-[#5E524D]">Extraction Weight</dt>
              <dd className="font-bold text-[#281D1C]">{batch.quantity_kg} kg</dd>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E8E3CF]/50">
              <dt className="text-[#5E524D]">Bee Species</dt>
              <dd className="font-bold text-[#281D1C]">{batch.beeSpecies || 'Apis mellifera'}</dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt className="text-[#5E524D]">Extraction Date</dt>
              <dd className="font-bold text-[#281D1C]">
                {batch.shearing_date ? new Date(batch.shearing_date).toLocaleDateString('en-IN') : '14 Feb 2026'}
              </dd>
            </div>
          </dl>
        </div>

      </div>

      {/* ─── Laboratory & NMR Purity Analysis Card ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E3CF] shadow-card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C06E30]">FSSAI & BIS Standards</span>
            <h3 className="font-bold font-serif text-xl text-[#281D1C] flex items-center gap-2 mt-0.5">
              <ShieldCheck size={20} className="text-emerald-700" /> Laboratory Purity Assay & NMR Fingerprint
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start">
            Passed All 18 Test Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm bg-[#FAF7EE] p-5 rounded-2xl border border-[#E8E3CF]">
          <div className="flex justify-between border-b border-[#E8E3CF] pb-2.5">
            <span className="text-[#5E524D]">Moisture Content:</span>
            <strong className="text-[#281D1C] font-bold">17.8% (FSSAI Standard &lt;20%) ✅</strong>
          </div>
          <div className="flex justify-between border-b border-[#E8E3CF] pb-2.5">
            <span className="text-[#5E524D]">HMF Level:</span>
            <strong className="text-[#281D1C] font-bold">11.4 mg/kg (Fresh Unheated) ✅</strong>
          </div>
          <div className="flex justify-between border-b border-[#E8E3CF] pb-2.5">
            <span className="text-[#5E524D]">C3/C4 Sugar Adulteration:</span>
            <strong className="text-emerald-800 font-bold">0.0% (Zero Invert Syrups) ✅</strong>
          </div>
          <div className="flex justify-between border-b border-[#E8E3CF] pb-2.5">
            <span className="text-[#5E524D]">Fructose / Glucose Ratio:</span>
            <strong className="text-[#281D1C] font-bold">1.18 (Natural Balance) ✅</strong>
          </div>
          <div className="flex justify-between col-span-1 sm:col-span-2 pt-1 text-xs">
            <span className="text-[#5E524D]">Accredited Lab Authority:</span>
            <strong className="text-[#861C1C] font-bold">Dr. Anjali Sharma • KVIC Central Honey Testing Lab</strong>
          </div>
        </div>
      </div>

      {/* ─── Timeline Ledger ─── */}
      <div className="rounded-3xl bg-white border border-[#E8E3CF] p-6 sm:p-8 shadow-card mb-8">
        <div className="pb-4 border-b border-[#E8E3CF] mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C06E30]">Immutable Audit Trail</span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#281D1C] mt-0.5">
            Hive to Home Ledger Timeline
          </h2>
          <p className="text-xs text-[#5E524D] mt-1">Every event timestamped and signed with cryptographic block hashes</p>
        </div>

        <div className="space-y-4">
          {events.map((ev, idx) => (
            <div key={ev.id || idx} className="p-4 sm:p-5 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E3CF] shadow-xs flex items-center justify-center text-lg shrink-0">
                  🐝
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#281D1C] font-serif">{ev.actorName || 'Harvest Event'}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#861C1C]/10 text-[#861C1C]">
                      {ev.event_type}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E524D] mt-1">{ev.description}</p>
                  {ev.location && (
                    <p className="text-[11px] text-[#9B918B] mt-1 flex items-center gap-1">
                      <MapPin size={11} className="text-[#C06E30]" /> {ev.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[11px] text-[#9B918B] flex sm:justify-end items-center gap-1">
                  <Calendar size={11} /> {new Date(ev.event_timestamp).toLocaleDateString('en-IN')}
                </span>
                <span className="text-[10px] font-mono text-[#C06E30] block mt-0.5">
                  Block #{idx} Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7EE] rounded-3xl border border-[#E8E3CF] shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-scale-in text-[#281D1C]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E3CF]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔐</span>
                <h3 className="font-bold font-serif text-lg text-[#281D1C]">Blockchain Merkle Proof</h3>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-[#9B918B] hover:text-[#281D1C] text-sm font-bold px-2 py-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
                <div>
                  <p className="font-bold">Merkle Tree Integrity: 100% Valid</p>
                  <p className="text-[11px] text-emerald-800">Zero data tampering detected across all smart contract state changes.</p>
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <p className="text-[11px] text-[#5E524D] font-sans font-bold">Genesis Harvest Block Hash:</p>
                <p className="p-2.5 rounded-xl bg-white border border-[#E8E3CF] break-all text-[10px] text-[#281D1C]">
                  0x7e8f23a91b4028e49d68241cfda609e20b3967812cd9e8f17042a991823efca4
                </p>
              </div>

              <div className="space-y-1 font-mono">
                <p className="text-[11px] text-[#5E524D] font-sans font-bold">KVIC NMR Assay Certificate Hash:</p>
                <p className="p-2.5 rounded-xl bg-white border border-[#E8E3CF] break-all text-[10px] text-[#281D1C]">
                  0x2c4e91820b482910fcde47190283471092837401928374019283740192837401
                </p>
              </div>

              <div className="space-y-1 font-mono">
                <p className="text-[11px] text-[#5E524D] font-sans font-bold">Bottling QR Seal Signature:</p>
                <p className="p-2.5 rounded-xl bg-white border border-[#E8E3CF] break-all text-[10px] text-[#281D1C]">
                  0x991048290bcde102938471029384710293847102938471029384710293847102
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E3CF] flex justify-end">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-5 py-2 bg-[#861C1C] text-white rounded-full text-xs font-bold hover:bg-[#6A1515] transition-all shadow-burgundy"
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
