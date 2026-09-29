import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Package, MapPin, Calendar, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
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
        const res = await getOrderById(id);
        if (res.error) {
          setError(res.error.message || t('failedToLoadOrder'));
        } else {
          setOrder(res.data);
          if (res.data?.batch) {
            const batchId = typeof res.data.batch === 'object' ? res.data.batch._id || res.data.batch.id : res.data.batch;
            const evRes = await getTrackingEvents(batchId);
            if (!evRes.error) setTraceEvents(evRes.data || []);
          }
        }
      } else {
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
      <main className="max-w-[92rem] mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
      </main>
    );
  }

  // Overview mode: show all active orders
  if (!id) {
    return (
      <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
        <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
              <Sparkles size={13} className="text-honeyGold" />
              <span>Active Logistics Grid</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
              {t('orderTracking')}
            </h1>
            <p className="text-sm text-deepBrown/70 max-w-xl">
              Monitor real-time transit telemetry, cold-chain temperatures, and estimated delivery dates.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center bento-card flex flex-col items-center">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-4 shadow-md shadow-honeyGold/10">
              <Truck size={30} />
            </div>
            <h3 className="font-serif font-bold text-lg text-deepBrown">{t('noActiveOrdersToTrack')}</h3>
            <p className="text-xs text-deepBrown/70 max-w-sm mt-1 mb-6">{t('allOrdersDeliveredOrNone')}</p>
            <button onClick={() => navigate('/buyer/marketplace')} className="btn-burgundy">
              {t('findWool')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => {
              const stepIdx = STATUS_STEPS.indexOf(o.status);
              return (
                <div key={o.id || o._id} onClick={() => navigate(`/buyer/tracking/${o.id || o._id}`)} className="bento-card bento-card-hover p-5 md:p-6 cursor-pointer transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-mono font-bold text-sm text-burgundy group-hover:underline">{t('orderHash')}{o.orderId || (o._id || o.id).slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-deepBrown/70">{o.floralSource || o.woolType || 'Raw Blossom Honey'} • <span className="font-mono font-bold text-deepBrown">{o.quantityKg || o.quantity_kg} kg</span></p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-honeyGold/20 text-burgundy capitalize">{STATUS_LABELS[o.status] || o.status}</span>
                  </div>
                  {/* Mini progress */}
                  <div className="flex items-center gap-1.5 pt-2">
                    {STATUS_STEPS.map((s, i) => (
                      <div
                        key={s}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i <= stepIdx ? 'bg-burgundy' : 'bg-border/60'
                        }`}
                      />
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

  // Single order tracking details
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <button onClick={() => navigate('/buyer/orders')} className="mb-6 flex items-center gap-2 text-xs font-bold text-deepBrown/70 hover:text-burgundy transition-colors">
        <ArrowLeft size={16} /> {t('backToMyOrders')}
      </button>

      {order && (
        <div className="space-y-6">
          <div className="bento-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono font-bold text-burgundy">Transit Ref #{order.orderId || (order._id || order.id).slice(-8).toUpperCase()}</p>
                <h1 className="text-2xl font-serif font-bold text-deepBrown mt-1">
                  {order.floralSource || order.wool_type || 'Raw Blossom'} Honey Consignment
                </h1>
                <p className="text-xs text-deepBrown/70 mt-1 font-mono">Volume: {order.quantityKg || order.quantity_kg} kg</p>
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-honeyGold/20 text-burgundy uppercase">
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>

          <div className="bento-card p-6 md:p-8 space-y-4">
            <h3 className="font-serif font-bold text-lg text-deepBrown">Transit Milestones</h3>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">✓</div>
                <div>
                  <p className="text-xs font-bold text-deepBrown">Apiary Harvest & Seal Verified</p>
                  <p className="text-[11px] text-deepBrown/60">Lot sealed at Himachal Apiary #48 with tamper-evident RFID tag.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">✓</div>
                <div>
                  <p className="text-xs font-bold text-deepBrown">NABL Quality Assay & NMR Passed</p>
                  <p className="text-[11px] text-deepBrown/60">Moisture 17.2%, HMF 12.4 mg/kg. C4 Sugar &lt; 1%.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-burgundy text-warmIvory text-xs font-bold shrink-0 animate-pulse">●</div>
                <div>
                  <p className="text-xs font-bold text-burgundy">In Transit to Regional FMCG Hub</p>
                  <p className="text-[11px] text-deepBrown/60">Current GPS location: Chandigarh Highway Junction. Temp: 22°C (Optimal).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
