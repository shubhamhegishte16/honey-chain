import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, User, Calendar, Sparkles, Truck, AlertCircle, ShieldCheck } from 'lucide-react';
import { getOrderById } from '../../services/order.service';
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

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getOrderById(id);
      if (res.error) {
        setError(res.error.message || t('failedToLoadOrder'));
      } else {
        setOrder(res.data);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 text-center bento-card text-rose-800">
          <AlertCircle size={36} className="mx-auto mb-3 text-rose-700" />
          <h3 className="font-serif font-bold text-lg">{t('orderNotFound')}</h3>
          <p className="mt-1 text-xs text-deepBrown/70">{error || t('orderCouldNotBeFound')}</p>
          <button onClick={() => navigate('/buyer/orders')} className="mt-5 btn-burgundy text-xs">
            {t('viewAllOrders')}
          </button>
        </div>
      </main>
    );
  }

  const STATUS_LABELS = getStatusLabels(t);
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <button onClick={() => navigate('/buyer/orders')} className="mb-6 flex items-center gap-2 text-xs font-bold text-deepBrown/70 hover:text-burgundy transition-colors">
        <ArrowLeft size={16} /> {t('backToMyOrders')}
      </button>

      {/* Order Header */}
      <div className="bento-card p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold mb-2">
              <Package size={13} className="text-honeyGold" />
              <span>{t('orderDetailsLabel')}</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-deepBrown">{t('orderHash')}{order.orderId || (order._id || order.id).slice(-8).toUpperCase()}</h1>
            <p className="text-xs text-deepBrown/70 mt-1 flex items-center gap-1.5 font-mono">
              <Calendar size={14} className="text-burntOrange" /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider ${
            isCancelled ? 'bg-rose-100 text-rose-800' :
            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
            'bg-honeyGold/20 text-burgundy'
          }`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
      </div>

      {/* Status Progress */}
      {!isCancelled && (
        <div className="bento-card p-6 mb-6">
          <h3 className="font-serif font-bold text-deepBrown mb-5">{t('orderProgress')}</h3>
          <div className="flex items-center justify-between overflow-x-auto pb-3 gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step} className="flex-1 flex flex-col items-center min-w-[80px]">
                  <div className={`grid h-10 w-10 place-items-center rounded-2xl font-bold text-xs transition-all ${
                    isCompleted 
                      ? 'bg-burgundy text-warmIvory shadow-sm' 
                      : 'bg-warmIvory border border-border text-deepBrown/40'
                  }`}>
                    {idx + 1}
                  </div>
                  <p className={`mt-2 text-[11px] font-bold text-center capitalize ${
                    isCompleted ? 'text-burgundy' : 'text-deepBrown/50'
                  }`}>
                    {STATUS_LABELS[step] || step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bento-card p-6 space-y-4">
          <h3 className="font-serif font-bold text-deepBrown flex items-center gap-2">
            <Package size={17} className="text-burgundy" /> Lot Particulars
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-deepBrown/60">Honey Variety</span>
              <span className="font-bold text-deepBrown">{order.floralSource || order.wool_type || 'Raw Blossom Honey'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-deepBrown/60">Procured Quantity</span>
              <span className="font-mono font-bold text-burgundy">{order.quantityKg || order.quantity_kg} kg</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-deepBrown/60">Price per kg</span>
              <span className="font-mono font-semibold text-deepBrown">₹{order.pricePerKg || order.price_per_kg}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="font-bold text-deepBrown">Total Escrow Amount</span>
              <span className="font-mono font-bold text-burgundy">₹{(order.totalPrice || order.total_amount)?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="bento-card p-6 space-y-4">
          <h3 className="font-serif font-bold text-deepBrown flex items-center gap-2">
            <MapPin size={17} className="text-burgundy" /> Delivery Destination
          </h3>
          <div className="text-xs text-deepBrown/80 space-y-1.5">
            <p className="font-bold text-deepBrown">{order.deliveryAddress?.street || 'Consignment Depot'}</p>
            <p>{order.deliveryAddress?.district || 'Kangra'}, {order.deliveryAddress?.state || 'Himachal Pradesh'}</p>
            <p className="font-mono">PIN: {order.deliveryAddress?.pinCode || '176001'}</p>
            <p className="pt-2 text-deepBrown/60">Contact: <span className="font-mono font-semibold text-deepBrown">{order.deliveryAddress?.contactPhone || '+91 98160 44219'}</span></p>
          </div>
        </div>
      </div>
    </main>
  );
}
