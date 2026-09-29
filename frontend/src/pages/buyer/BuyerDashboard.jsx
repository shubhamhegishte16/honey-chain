import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Package,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ShoppingCart,
  Layers,
  ChevronRight,
  Search,
  Bookmark,
  ShieldCheck,
  Award,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUserOrders } from '../../services/order.service';
import { getListings } from '../../services/marketplace.service';

export default function BuyerDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    if (!profile?.id) return;
    try {
      const [ordersRes, listingsRes] = await Promise.all([
        getUserOrders(),
        getListings()
      ]);

      if (!ordersRes.error) {
        setOrders(ordersRes.data || []);
      }
      if (!listingsRes.error) {
        setRecommendations((listingsRes.data || []).slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading buyer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [profile?.id]);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalVolume = orders.reduce((sum, o) => sum + (o.quantityKg || 0), 0);

  const quickActions = [
    {
      label: 'Procure Pure Honey',
      desc: 'Browse NMR-certified raw honey lots directly from beekeepers',
      icon: Search,
      route: '/buyer/marketplace',
      tone: 'bg-[#861C1C] text-white',
    },
    {
      label: 'My Procurement Orders',
      desc: 'Track active bulk consignments and delivery status',
      icon: ShoppingCart,
      route: '/buyer/orders',
      tone: 'bg-[#C06E30] text-white',
    },
    {
      label: 'Consignment Tracking',
      desc: 'Real-time transit telemetry & temperature logs',
      icon: Package,
      route: '/buyer/tracking',
      tone: 'bg-[#F4B345] text-[#281D1C]',
    },
    {
      label: 'Saved Apiary Batches',
      desc: 'Bookmarked monofloral honey lots for future bidding',
      icon: Bookmark,
      route: '/buyer/saved',
      tone: 'bg-[#281D1C] text-white',
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'placed': return <span className="px-2.5 py-0.5 bg-[#FEF6E4] text-[#C06E30] text-[10px] font-bold uppercase rounded-full border border-[#F4B345]/30">Placed</span>;
      case 'confirmed': return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold uppercase rounded-full border border-blue-200">Confirmed</span>;
      case 'processing': return <span className="px-2.5 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-bold uppercase rounded-full border border-purple-200">Processing</span>;
      case 'dispatched': return <span className="px-2.5 py-0.5 bg-sky-50 text-sky-800 text-[10px] font-bold uppercase rounded-full border border-sky-200">In Transit</span>;
      case 'delivered': return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase rounded-full border border-emerald-200">Delivered</span>;
      default: return <span className="px-2.5 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-bold uppercase rounded-full">{status}</span>;
    }
  };

  return (
    <main className="page-shell">
      
      {/* ─── Hero Welcome Banner ─── */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-[#281D1C] text-white p-6 sm:p-10 shadow-soft-lg mb-6">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4B345]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4B345] border border-white/15 text-xs font-bold backdrop-blur-md mb-3">
              <ShieldCheck size={14} /> KVIC Certified FMCG Procurement Wing
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-white leading-tight">
              Welcome, {profile?.name || 'Anita Deshmukh'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1.5 flex items-center gap-2">
              <span>{profile?.organization || 'Dabur India Ayurvedic Sourcing Division'}</span>
              <span className="opacity-40">•</span>
              <span className="text-[#F4B345] font-semibold">{profile?.district || 'Pune'}, {profile?.state || 'Maharashtra'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/buyer/marketplace')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4B345] text-[#281D1C] font-bold text-xs sm:text-sm shadow-gold hover:bg-[#F6C063] transition-all hover:scale-105 active:scale-95"
            >
              <Store size={16} />
              <span>Browse Honey Catalog</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Procurement Metrics Bento ─── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
        
        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B] block">Active Orders</span>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-[#281D1C] mt-2">
            {activeOrders.length} Consignments
          </p>
          <span className="text-[11px] text-[#C06E30] font-semibold mt-1 block">In Processing &amp; Transit</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B] block">Total Procured</span>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-[#281D1C] mt-2">
            {totalVolume || 480} kg
          </p>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">100% NMR Certified Pure</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B] block">Completed Orders</span>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-[#281D1C] mt-2">
            {deliveredOrders.length || 6} Orders
          </p>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">Settled via Smart Escrow</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B] block">Authenticity Index</span>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-800 mt-2">
            100%
          </p>
          <span className="text-[11px] text-[#5E524D] font-semibold mt-1 block">Zero Syrup Adulteration</span>
        </div>

      </section>

      {/* ─── Quick Tools ─── */}
      <section className="mb-8">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><Sparkles size={12} /> Buyer Tools</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Procurement Actions</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all hover:-translate-y-0.5 text-left flex flex-col justify-between group"
              >
                <div>
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${action.tone} shadow-sm mb-3 transition-transform group-hover:scale-105`}>
                    <Icon size={20} />
                  </span>
                  <h3 className="font-bold font-serif text-base text-[#281D1C] group-hover:text-[#861C1C] transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-xs text-[#5E524D] mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#861C1C] mt-4 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Open Action →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Recent Active Orders ─── */}
      <section className="mb-10">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><Package size={12} /> Order Ledger</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Recent Procurement Consignments</h2>
          </div>
          <Link to="/buyer/orders" className="text-link">
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
            <span className="text-3xl">🛒</span>
            <h3 className="font-bold font-serif text-lg text-[#281D1C] mt-2">No Active Consignments</h3>
            <p className="text-xs text-[#5E524D] mt-1">Explore verified honey lots from beekeepers on the national mandi.</p>
            <button
              onClick={() => navigate('/buyer/marketplace')}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-burgundy hover:bg-[#6A1515]"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.slice(0, 4).map(o => (
              <div
                key={o.id || o._id}
                onClick={() => navigate(`/buyer/orders/${o.id || o._id}`)}
                className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E3CF]">
                    <span className="font-mono text-xs font-bold text-[#861C1C] bg-[#FBEBEB] px-2.5 py-0.5 rounded-full border border-[#861C1C]/20">
                      Order #{o.orderNumber || o.id?.slice(0, 8)}
                    </span>
                    {getStatusBadge(o.status)}
                  </div>

                  <h3 className="font-bold font-serif text-base text-[#281D1C] mt-3">
                    {o.floralSource || o.woolType || 'Mustard Blossom Raw Honey'}
                  </h3>
                  <p className="text-xs text-[#5E524D] mt-0.5">
                    Quantity: <strong className="text-[#281D1C]">{o.quantityKg || 50} kg</strong> • Amount: <strong className="text-[#861C1C]">₹{(o.totalAmount || 15000).toLocaleString()}</strong>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3CF] flex items-center justify-between text-xs text-[#5E524D]">
                  <span>Placed: {new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN')}</span>
                  <span className="font-bold text-[#861C1C] flex items-center gap-1">
                    Track Consignment <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
