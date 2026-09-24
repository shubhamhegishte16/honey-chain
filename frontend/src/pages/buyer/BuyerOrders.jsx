import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Search, ArrowRight, MapPin } from 'lucide-react';
import { getUserOrders } from '../../services/order.service';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_TABS = ['all', 'placed', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];

const getStatusBadge = (status) => {
  const map = {
    placed: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    dispatched: 'bg-sky-100 text-sky-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-rose-100 text-rose-800',
  };
  return <span className={`px-2 py-1 ${map[status] || 'bg-gray-100 text-gray-800'} text-[10px] font-bold uppercase rounded-md`}>{status}</span>;
};

export default function BuyerOrders() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getUserOrders();
      if (!res.error) setOrders(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div>
          <p className="eyebrow text-primary"><ShoppingCart size={13} /> {t('purchaseHistory')}</p>
          <h1 className="text-2xl font-extrabold text-textPrimary">{t('myOrders')}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm'
                : 'bg-background text-textSecondary hover:text-textPrimary hover:bg-border/40'
            }`}
          >
            {t('status' + tab.charAt(0).toUpperCase() + tab.slice(1) + (tab === 'dispatched' || tab === 'delivered' ? 'Tab' : ''))}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3">
            <Package size={28} />
          </span>
          <h3 className="font-bold text-base text-textPrimary">
            {activeTab === 'all' ? t('noOrdersYet') : t('noStatusOrders').replace('{status}', activeTab)}
          </h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-5">
            {activeTab === 'all' ? t('startExploringMarketplace') : t('tryDifferentFilter')}
          </p>
          {activeTab === 'all' ? (
            <button onClick={() => navigate('/buyer/marketplace')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primaryDark transition-all">
              <Search size={15} /> Browse Honey Mandi
            </button>
          ) : (
            <button onClick={() => setActiveTab('all')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-textPrimary font-bold text-xs hover:bg-border/30 transition-all">
              {t('viewAllOrders')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div
              key={order.id || order._id}
              onClick={() => navigate(`/buyer/orders/${order.id || order._id}`)}
              className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primaryLight text-primary font-bold shrink-0">
                    <Package size={18} />
                  </span>
                  <div>
                    <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors">
                      {t('orderHash')}{order.orderId}
                    </p>
                    <p className="text-xs text-textSecondary">
                      {order.floralSource || order.woolType || 'Raw Blossom Honey'} • {order.quantityKg} kg • ₹{order.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-[10px] text-textMuted">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  <ArrowRight size={14} className="text-textMuted group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-textMuted">
                <span>{t('sellerLabel')}: {order.sellerName}</span>
                <span>{t('batchLabel')}: {order.batchId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
