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
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { getBatchById } from '../../services/batches.service';
import { getTrackingEvents } from '../../services/tracking.service';
import { useLanguage } from '../../context/LanguageContext';

const EVENT_CONFIG = {
  produced: {
    label: 'Sheared & Produced',
    desc: 'Wool harvest logged on-farm',
    icon: '🐑',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  quality_checked: {
    label: 'Quality Graded',
    desc: 'Micron, yield & staple tested',
    icon: '🔬',
    tone: 'bg-sky-50 text-sky-800 border-sky-300',
  },
  sorted: {
    label: 'Graded & Sorted',
    desc: 'Sorted by color and fleece grade',
    icon: '📑',
    tone: 'bg-purple-50 text-purple-800 border-purple-300',
  },
  stored: {
    label: 'Warehouse Vaulted',
    desc: 'Humidity-controlled storage deposit',
    icon: '🏬',
    tone: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  processed: {
    label: 'Scoured & Carded',
    desc: 'Industrial processing completed',
    icon: '🧵',
    tone: 'bg-teal-50 text-teal-800 border-teal-300',
  },
  listed: {
    label: 'Listed in Marketplace',
    desc: 'Available for purchase bids',
    icon: '🛒',
    tone: 'bg-indigo-50 text-indigo-800 border-indigo-300',
  },
  sold: {
    label: 'Order Confirmed',
    desc: 'Purchased by textile mill / buyer',
    icon: '💰',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  dispatched: {
    label: 'In Transit',
    desc: 'Dispatched via regional agro-freight',
    icon: '🚚',
    tone: 'bg-blue-50 text-blue-800 border-blue-300',
  },
  delivered: {
    label: 'Delivered',
    desc: 'Received and verified by destination mill',
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
          // Generate realistic default produced event if none exist yet
          evList.push({
            id: 'ev-initial',
            event_type: 'produced',
            actorName: batchResult.data.users?.name || 'Pastoralist Producer',
            location: `${batchResult.data.district || 'Bikaner'}, ${batchResult.data.state || 'Rajasthan'}`,
            description: `Batch registered on WoolConnect digital ledger. Weight: ${batchResult.data.quantity_kg} kg ${batchResult.data.wool_type}.`,
            event_timestamp: batchResult.data.shearing_date || new Date().toISOString(),
          });
        }
        setEvents(evList);
        setLoading(false);
      }
    );
  }, [id]);

  return (
    <main className="page-shell max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={batch ? `/batches/${batch._id || batch.id}/details` : '/farmer/tracking'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>{t('backToPassport')}</span>
        </Link>

        <span className="text-xs text-primary font-bold flex items-center gap-1">
          <ShieldCheck size={14} /> {t('verified')}
        </span>
      </div>

      <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-8 shadow-card animate-enter">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70 mb-8">
          <div>
            <div className="eyebrow text-primary mb-1">
              <Layers size={13} /> {t('woolJourney')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary">
              {t('traceabilityTimeline')}
            </h1>
            {batch && (
              <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
                {batch.batch_id} • <span className="font-semibold text-textPrimary">{batch.wool_type}</span> ({batch.quantity_kg} kg)
              </p>
            )}
          </div>

          {batch && <BatchStatusBadge status={batch.status} />}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center bg-background rounded-2xl border border-border text-textSecondary text-sm">
            {t('pending')}
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-border">
            {events.map((ev, idx) => {
              const cfg = EVENT_CONFIG[ev.event_type] || {
                label: ev.event_type,
                desc: 'Milestone recorded',
                icon: '📌',
                tone: 'bg-gray-50 text-gray-700 border-gray-300',
              };

              return (
                <div key={ev.id || idx} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-6 sm:-left-8 top-0.5 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-surface border-2 border-primary shadow-sm text-xs sm:text-sm z-10 transition-transform group-hover:scale-110">
                    <span>{cfg.icon}</span>
                  </div>

                  {/* Event Card */}
                  <div className="p-5 rounded-2xl bg-background border border-border/80 shadow-sm transition-all duration-200 hover:border-primary/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.tone}`}>
                          {cfg.label}
                        </span>
                        {ev.actorName && (
                          <span className="text-xs font-medium text-textSecondary flex items-center gap-1">
                            <User size={11} className="text-textMuted" /> {ev.actorName}
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-textMuted flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(ev.event_timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-textPrimary font-medium leading-relaxed">
                      {ev.description || cfg.desc}
                    </p>

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
