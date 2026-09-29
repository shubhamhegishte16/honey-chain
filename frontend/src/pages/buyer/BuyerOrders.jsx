import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Search, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { getUserOrders } from '../../services/order.service';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_TABS = ['all', 'placed', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];

const getStatusBadge = (status) => {
  const map = {
    placed: 'bg-honeyGold/20 text-burgundy',
    confirmed: 'bg-sky-100 text-sky-800',
    processing: 'bg-indigo-100 text-indigo-800',
    dispatched: 'bg-teal-100 text-teal-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-rose-100 text-rose-800',
  };
  return <span className={`px-3 py-1 ${map[status] || 'bg-warmIvory text-deepBrown'} text-[11px] font-bold uppercase rounded-full`}>{status}</span>;
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
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>FMCG Consignment Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('myOrders')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Real-time status of wholesale honey consignments with direct blockchain proof passports.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize whitespace-nowrap transition-all shadow-xs ${
              activeTab === tab
                ? 'bg-burgundy text-warmIvory shadow-md shadow-burgundy/15'
                : 'bg-warmIvory/80 text-deepBrown/70 border border-border hover:bg-warmIvory hover:text-burgundy'
            }`}
          >
            {t('status' + tab.charAt(0).toUpperCase() + tab.slice(1) + (tab === 'dispatched' || tab === 'delivered' ? 'Tab' : ''))}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bento-card flex flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-4 shadow-md shadow-honeyGold/10">
            <Package size={30} />
          </div>
          <h3 className="font-serif font-bold text-lg text-deepBrown">
            {activeTab === 'all' ? t('noOrdersYet') : t('noStatusOrders').replace('{status}', activeTab)}
          </h3>
          <p className="text-xs text-deepBrown/70 max-w-sm mt-1 mb-6">
            {activeTab === 'all' ? t('startExploringMarketplace') : t('tryDifferentFilter')}
          </p>
          {activeTab === 'all' ? (
            <button onClick={() => navigate('/buyer/marketplace')} className="btn-burgundy">
              <Search size={15} /> Browse Honey Mandi
            </button>
          ) : (
            <button onClick={() => setActiveTab('all')} className="btn-warm-glass">
              {t('viewAllOrders')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div
              key={order.id || order._id}
              onClick={() => navigate(`/buyer/orders/${order.id || order._id}`)}
              className="bento-card bento-card-hover p-5 md:p-6 cursor-pointer transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-burgundy/10 text-burgundy font-serif font-bold text-base shrink-0 group-hover:bg-burgundy group-hover:text-honeyGold transition-colors">
                    #
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-sm text-burgundy">Order #{order.orderId || (order._id || order.id).slice(-8).toUpperCase()}</p>
                      <span className="text-xs text-deepBrown/50">• {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-bold text-deepBrown mt-0.5">
                      {order.floralSource || order.wool_type || 'Raw Blossom Honey'} – <span className="font-mono font-bold text-burgundy">{order.quantityKg || order.quantity_kg} kg</span>
                    </p>
                    <p className="text-xs text-deepBrown/60 mt-0.5">
                      Beekeeper: <span className="font-semibold text-deepBrown">{order.sellerName || order.farmerName || 'Verified Apiary'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60">
                  <div className="text-left sm:text-right">
                    <p className="font-mono font-bold text-base text-deepBrown">₹{(order.totalPrice || order.total_amount)?.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-deepBrown/50 font-medium">Escrow Protected</p>
                  </div>
                  {getStatusBadge(order.status)}
                  <ArrowRight size={18} className="text-deepBrown/40 group-hover:text-burgundy group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
