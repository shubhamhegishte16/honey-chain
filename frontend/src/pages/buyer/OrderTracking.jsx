import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Package, MapPin, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { getUserOrders, getOrderById } from '../../services/order.service';
import { getTrackingEvents } from '../../services/tracking.service';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'dispatched', 'delivered'];
function getStatusLabels(t) {
  return {
    placed: t('statusOrderPlaced'),
    confirmed: t('statusConfirmedLabel'),
    processing: t('statusProcessingLabel'),
    dispatched: t('statusDispatchedLabel'),
    delivered: t('statusDeliveredLabel'),
    cancelled: t('statusCancelledLabel'),
  };
}

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [traceEvents, setTraceEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (id) {
        // Single order tracking
        const res = await getOrderById(id);
        if (res.error) {
          setError(res.error.message || t('failedToLoadOrder'));
        } else {
          setOrder(res.data);
          // Also fetch traceability events for the batch
          if (res.data?.batch) {
            const batchId = typeof res.data.batch === 'object' ? res.data.batch._id || res.data.batch.id : res.data.batch;
            const evRes = await getTrackingEvents(batchId);
            if (!evRes.error) setTraceEvents(evRes.data || []);
          }
        }
      } else {
        // All active orders for tracking overview
        const res = await getUserOrders();
        if (!res.error) {
          setOrders((res.data || []).filter(o => !['delivered', 'cancelled'].includes(o.status)));
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const STATUS_LABELS = getStatusLabels(t);

  if (loading) {
    return (
      <main className="page-shell"><div className="py-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div></main>
    );
  }

  // Overview mode: show all active orders
  if (!id) {
    return (
      <main className="page-shell">
        <div className="section-heading mb-6">
          <div>
            <p className="eyebrow text-primary"><Truck size={13} /> {t('liveTracking')}</p>
            <h1 className="text-2xl font-extrabold text-textPrimary">{t('orderTracking')}</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
            <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3"><Truck size={28} /></span>
            <h3 className="font-bold text-base text-textPrimary">{t('noActiveOrdersToTrack')}</h3>
            <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-5">{t('allOrdersDeliveredOrNone')}</p>
            <button onClick={() => navigate('/buyer/marketplace')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primaryDark transition-all">{t('findWool')}</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => {
              const stepIdx = STATUS_STEPS.indexOf(o.status);
              return (
                <div key={o.id || o._id} onClick={() => navigate(`/buyer/tracking/${o.id || o._id}`)} className="p-5 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-bold text-sm text-textPrimary group-hover:text-primary">{t('orderHash')}{o.orderId}</p>
                      <p className="text-xs text-textSecondary">{o.woolType} • {o.quantityKg} kg</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 capitalize">{STATUS_LABELS[o.status] || o.status}</span>
                  </div>
                  {/* Mini progress */}
                  <div className="flex items-center gap-1">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s} className={`flex-1 h-1.5 rounded-full ${i <= stepIdx ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    );
  }

  // Single order tracking view
  if (error || !order) {
    return (
      <main className="page-shell">
        <div className="p-8 text-center rounded-3xl bg-rose-50 text-rose-800 border border-rose-200 mt-10">
          <AlertCircle size={32} className="mx-auto mb-3" />
          <h3 className="font-bold text-lg">{t('orderNotFound')}</h3>
          <p className="mt-1 text-sm">{error}</p>
          <button onClick={() => navigate('/buyer/tracking')} className="mt-4 px-4 py-2 bg-rose-100 rounded-lg text-sm font-semibold hover:bg-rose-200">{t('backToTracking')}</button>
        </div>
      </main>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="page-shell max-w-3xl mx-auto">
      <button onClick={() => navigate('/buyer/tracking')} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
        <ArrowLeft size={16} /> {t('allTracking')}
      </button>

      {/* Order summary */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card animate-enter mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-primary"><Truck size={13} /> {t('tracking2')}</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-textPrimary">{t('orderHash')}{order.orderId}</h1>
            <p className="text-sm text-textSecondary mt-1">{order.woolType} • {order.quantityKg} kg</p>
          </div>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase ${
            isCancelled ? 'bg-rose-100 text-rose-800' :
            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
      </div>

      {/* Visual Timeline */}
      {!isCancelled && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm mb-6 animate-enter delay-1">
          <h3 className="font-bold text-textPrimary mb-6">{t('deliveryProgress')}</h3>
          <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-border">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const historyEntry = order.statusHistory?.find(h => h.status === step);
              return (
                <div key={step} className="relative">
                  <div className={`absolute -left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 z-10 ${
                    isCompleted ? 'bg-primary text-white border-primary' : 'bg-surface text-textMuted border-border'
                  } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-2' : ''}`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div className={`p-3 rounded-xl ${isCurrent ? 'bg-primaryLight/30 border border-primary/20' : ''}`}>
                    <p className={`text-sm font-bold ${isCompleted ? 'text-textPrimary' : 'text-textMuted'}`}>{STATUS_LABELS[step]}</p>
                    {historyEntry && (
                      <p className="text-[10px] text-textMuted mt-0.5">{new Date(historyEntry.timestamp).toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Traceability Events */}
      {traceEvents.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm mb-6 animate-enter delay-2">
          <h3 className="font-bold text-textPrimary mb-4">{t('woolJourneyEvents')}</h3>
          <div className="space-y-3">
            {traceEvents.map((ev, i) => (
              <div key={ev.id || i} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/50">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-textPrimary capitalize">{ev.event_type?.replace(/_/g, ' ')}</p>
                  <p className="text-[10px] text-textMuted">{new Date(ev.event_timestamp).toLocaleString('en-IN')}</p>
                  {ev.description && <p className="text-xs text-textSecondary mt-0.5">{ev.description}</p>}
                  {ev.location && <p className="text-[10px] text-textMuted flex items-center gap-1 mt-0.5"><MapPin size={10} /> {ev.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      {order.batch && (
        <button
          onClick={() => navigate(`/buyer/wool-passport/${typeof order.batch === 'object' ? order.batch._id || order.batch.id : order.batch}`)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primaryLight/50 text-primary font-bold text-sm border border-primary/10 hover:bg-primaryLight transition-all animate-enter delay-3"
        >
          <Sparkles size={16} /> {t('viewWoolPassport')}
        </button>
      )}
    </main>
  );
}
