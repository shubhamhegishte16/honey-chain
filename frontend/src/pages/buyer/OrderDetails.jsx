import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, User, Calendar, Sparkles, Truck, AlertCircle } from 'lucide-react';
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
      <main className="page-shell"><div className="py-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div></main>
    );
  }

  if (error || !order) {
    return (
      <main className="page-shell">
        <div className="p-8 text-center rounded-3xl bg-rose-50 text-rose-800 border border-rose-200 mt-10">
          <AlertCircle size={32} className="mx-auto mb-3" />
          <h3 className="font-bold text-lg">{t('orderNotFound')}</h3>
          <p className="mt-1 text-sm">{error || t('orderCouldNotBeFound')}</p>
          <button onClick={() => navigate('/buyer/orders')} className="mt-4 px-4 py-2 bg-rose-100 rounded-lg text-sm font-semibold hover:bg-rose-200">{t('viewAllOrders')}</button>
        </div>
      </main>
    );
  }

  const STATUS_LABELS = getStatusLabels(t);
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="page-shell max-w-4xl mx-auto">
      <button onClick={() => navigate('/buyer/orders')} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
        <ArrowLeft size={16} /> {t('backToMyOrders')}
      </button>

      {/* Order Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card animate-enter mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-primary"><Package size={13} /> {t('orderDetailsLabel')}</p>
            <h1 className="text-2xl font-extrabold text-textPrimary">{t('orderHash')}{order.orderId}</h1>
            <p className="text-sm text-textSecondary mt-1 flex items-center gap-1.5">
              <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
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

      {/* Status Progress */}
      {!isCancelled && (
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm mb-6 animate-enter delay-1">
          <h3 className="font-bold text-textPrimary mb-4">{t('orderProgress')}</h3>
          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center min-w-[70px]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      isCompleted ? 'bg-primary text-white border-primary' : 'bg-background text-textMuted border-border'
                    } ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-semibold mt-1.5 text-center ${isCompleted ? 'text-primary' : 'text-textMuted'}`}>
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 min-w-[20px] ${idx < currentStepIdx ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter delay-2">
        {/* Product */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3"><Package size={16} className="text-primary" /> {t('product')}</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-textSecondary">{t('woolTypeLabel')}</dt><dd className="font-semibold text-textPrimary">{order.woolType}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">{t('quantityKg')}</dt><dd className="font-semibold text-textPrimary">{order.quantityKg} kg</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">{t('priceKgLabel')}</dt><dd className="font-semibold text-textPrimary">₹{order.pricePerKg}</dd></div>
            <div className="flex justify-between border-t border-border pt-2"><dt className="font-bold text-textPrimary">{t('total')}</dt><dd className="font-black text-textPrimary text-lg">₹{order.totalAmount?.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-textSecondary">{t('batchIdLabel')}</dt><dd className="font-semibold text-textPrimary">{order.batchId}</dd></div>
          </dl>
        </div>

        {/* Seller */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3"><User size={16} className="text-primary" /> {t('seller')}</h3>
          <p className="font-bold text-textPrimary">{order.sellerName}</p>
          <p className="text-xs text-textSecondary mt-1">{t('verifiedWoolConnectProducer')}</p>
        </div>

        {/* Delivery */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3"><MapPin size={16} className="text-primary" /> {t('deliveryAddress')}</h3>
          {order.deliveryAddress ? (
            <div className="text-sm text-textSecondary space-y-1">
              {order.deliveryAddress.street && <p>{order.deliveryAddress.street}</p>}
              <p>{order.deliveryAddress.district}, {order.deliveryAddress.state}</p>
              {order.deliveryAddress.pinCode && <p>{t('pinLabel')}: {order.deliveryAddress.pinCode}</p>}
              <p>{t('phoneLabel')}: {order.deliveryAddress.contactPhone}</p>
            </div>
          ) : (
            <p className="text-sm text-textSecondary">{t('noDeliveryAddress')}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-3"><Calendar size={16} className="text-primary" /> {t('statusHistory')}</h3>
          {order.statusHistory && order.statusHistory.length > 0 ? (
            <div className="space-y-3">
              {order.statusHistory.map((sh, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-textPrimary capitalize">{STATUS_LABELS[sh.status] || sh.status}</p>
                    <p className="text-[10px] text-textMuted">{new Date(sh.timestamp).toLocaleString('en-IN')}</p>
                    {sh.note && <p className="text-xs text-textSecondary mt-0.5">{sh.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-textSecondary">{t('noHistoryEvents')}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3 animate-enter delay-3">
        <button
          onClick={() => navigate(`/buyer/tracking/${order.id || order._id}`)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow hover:bg-primaryDark transition-all"
        >
          <Truck size={16} /> {t('trackOrder')}
        </button>
        {order.batch && (
          <button
            onClick={() => navigate(`/buyer/wool-passport/${typeof order.batch === 'object' ? order.batch._id || order.batch.id : order.batch}`)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primaryLight/50 text-primary font-bold text-sm border border-primary/10 hover:bg-primaryLight transition-all"
          >
            <Sparkles size={16} /> {t('viewWoolPassport')}
          </button>
        )}
      </div>
    </main>
  );
}
