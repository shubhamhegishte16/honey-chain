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

const EVENT_CONFIG = {
  produced: { label: 'Sheared & Produced', icon: '🐑', tone: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  quality_checked: { label: 'Quality Graded', icon: '🔬', tone: 'bg-sky-50 text-sky-800 border-sky-300' },
  sorted: { label: 'Graded & Sorted', icon: '📑', tone: 'bg-purple-50 text-purple-800 border-purple-300' },
  stored: { label: 'Warehouse Vaulted', icon: '🏬', tone: 'bg-amber-50 text-amber-900 border-amber-300' },
  processed: { label: 'Scoured & Carded', icon: '🧵', tone: 'bg-teal-50 text-teal-800 border-teal-300' },
  listed: { label: 'Listed in Marketplace', icon: '🛒', tone: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
  sold: { label: 'Order Confirmed', icon: '💰', tone: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  dispatched: { label: 'In Transit', icon: '🚚', tone: 'bg-blue-50 text-blue-800 border-blue-300' },
  delivered: { label: 'Delivered', icon: '✨', tone: 'bg-green-50 text-green-800 border-green-300' },
};

export default function WoolPassport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [batchRes, eventsRes] = await Promise.all([
          getBatchById(id),
          getTrackingEvents(id),
        ]);

        if (batchRes.error) {
          setError(batchRes.error.message || 'Failed to load batch.');
        } else {
          setBatch(batchRes.data);
        }

        const evList = eventsRes.data || [];
        if (evList.length === 0 && batchRes.data) {
          evList.push({
            id: 'ev-initial',
            event_type: 'produced',
            actorName: batchRes.data.users?.name || 'Pastoralist Producer',
            location: `${batchRes.data.district || ''}, ${batchRes.data.state || ''}`,
            description: `Batch registered. Weight: ${batchRes.data.quantity_kg} kg ${batchRes.data.wool_type}.`,
            event_timestamp: batchRes.data.shearing_date || new Date().toISOString(),
          });
        }
        setEvents(evList);
      } catch (err) {
        setError('Something went wrong loading the passport.');
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
        <div className="p-8 text-center rounded-3xl bg-rose-50 text-rose-800 border border-rose-200 mt-10">
          <Package size={32} className="mx-auto mb-3" />
          <h3 className="font-bold text-lg">Batch Not Found</h3>
          <p className="mt-1 text-sm">{error || 'This wool batch could not be found.'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-rose-100 rounded-lg text-sm font-semibold hover:bg-rose-200">Go Back</button>
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
      <div className="rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-6 sm:p-8 shadow-xl animate-enter mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-3">
              <QrCode size={13} /> Digital Wool Passport
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{batch.batch_id}</h1>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-300" />
              {batch.district}, {batch.state}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BatchStatusBadge status={batch.status} />
            <span className="text-xs text-white/60">{batch.wool_type} • {batch.quantity_kg} kg</span>
          </div>
        </div>
      </div>

      {/* Batch Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-enter delay-1">
        {/* Origin */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" /> Origin
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-textSecondary">State</dt><dd className="font-semibold text-textPrimary">{batch.state || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">District</dt><dd className="font-semibold text-textPrimary">{batch.district || '—'}</dd></div>
            {batch.farm_location && <div className="flex justify-between"><dt className="text-textSecondary">Farm</dt><dd className="font-semibold text-textPrimary">{batch.farm_location}</dd></div>}
            <div className="flex justify-between"><dt className="text-textSecondary">Producer</dt><dd className="font-semibold text-textPrimary">{batch.users?.name || '—'}</dd></div>
          </dl>
        </div>

        {/* Batch Details */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3">
            <Package size={16} className="text-primary" /> Batch Information
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-textSecondary">Wool Type</dt><dd className="font-semibold text-textPrimary">{batch.wool_type}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">Quantity</dt><dd className="font-semibold text-textPrimary">{batch.quantity_kg} kg</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">Shearing Date</dt><dd className="font-semibold text-textPrimary">{batch.shearing_date ? new Date(batch.shearing_date).toLocaleDateString('en-IN') : '—'}</dd></div>
            {batch.color && <div className="flex justify-between"><dt className="text-textSecondary">Color</dt><dd className="font-semibold text-textPrimary capitalize">{batch.color}</dd></div>}
          </dl>
        </div>
      </div>

      {/* Quality Section */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm mb-8 animate-enter delay-2">
        <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="text-primary" /> Quality Verification
        </h3>
        {batch.qualityAssessment ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {batch.qualityAssessment.grade && <div className="flex justify-between"><dt className="text-textSecondary">Grade</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.grade}</dd></div>}
            {batch.qualityAssessment.fiberAppearance && <div className="flex justify-between"><dt className="text-textSecondary">Fiber Appearance</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.fiberAppearance}</dd></div>}
            {batch.qualityAssessment.cleanliness && <div className="flex justify-between"><dt className="text-textSecondary">Cleanliness</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.cleanliness}</dd></div>}
            {batch.qualityAssessment.moistureCondition && <div className="flex justify-between"><dt className="text-textSecondary">Moisture</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.moistureCondition}</dd></div>}
            {batch.qualityAssessment.stapleLength && <div className="flex justify-between"><dt className="text-textSecondary">Staple Length</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.stapleLength}</dd></div>}
            {batch.qualityAssessment.micronEstimate && <div className="flex justify-between"><dt className="text-textSecondary">Micron</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.micronEstimate}</dd></div>}
            {batch.qualityAssessment.inspector && <div className="flex justify-between"><dt className="text-textSecondary">Inspector</dt><dd className="font-semibold text-textPrimary">{batch.qualityAssessment.inspector}</dd></div>}
          </dl>
        ) : (
          <p className="text-sm text-textSecondary">Quality assessment data not yet available for this batch.</p>
        )}
      </div>

      {/* Wool Journey Timeline */}
      <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-8 shadow-card animate-enter delay-3">
        <div className="pb-5 border-b border-border/70 mb-8">
          <div className="eyebrow text-primary mb-1"><Layers size={13} /> Provenance Ledger</div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary">Wool Journey</h2>
          <p className="text-xs text-textSecondary mt-0.5">Complete traceability timeline for this batch.</p>
        </div>

        {events.length === 0 ? (
          <div className="p-8 text-center bg-background rounded-2xl border border-border text-textSecondary text-sm">
            No traceability events recorded yet for this batch.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-border">
            {events.map((ev, idx) => {
              const cfg = EVENT_CONFIG[ev.event_type] || {
                label: ev.event_type,
                icon: '📌',
                tone: 'bg-gray-50 text-gray-700 border-gray-300',
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
