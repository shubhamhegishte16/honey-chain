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
  Bookmark
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
      label: t('findWool', 'Find Wool'),
      desc: t('browseMarketplaceListings', 'Browse marketplace listings'),
      icon: Search,
      route: '/buyer/marketplace',
      tone: 'bg-primary text-white',
      accent: 'border-primary/30 hover:border-primary',
    },
    {
      label: t('myOrders', 'My Orders'),
      desc: t('viewActivePastOrders', 'View active and past orders'),
      icon: ShoppingCart,
      route: '/buyer/orders',
      tone: 'bg-accent text-white',
      accent: 'border-accent/30 hover:border-accent',
    },
    {
      label: t('trackDeliveries', 'Track Deliveries'),
      desc: t('realtimeOrderTracking', 'Real-time order tracking'),
      icon: Package,
      route: '/buyer/tracking',
      tone: 'bg-info text-white',
      accent: 'border-info/30 hover:border-info',
    },
    {
      label: t('savedWool', 'Saved Wool'),
      desc: t('yourBookmarkedListings', 'Your bookmarked listings'),
      icon: Bookmark,
      route: '/buyer/saved',
      tone: 'bg-emerald-600 text-white',
      accent: 'border-emerald-500/30 hover:border-emerald-600',
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'placed': return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-md">{t('placed', 'Placed')}</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-md">{t('confirmed', 'Confirmed')}</span>;
      case 'processing': return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase rounded-md">{t('processing', 'Processing')}</span>;
      case 'dispatched': return <span className="px-2 py-1 bg-sky-100 text-sky-800 text-[10px] font-bold uppercase rounded-md">{t('dispatched', 'Dispatched')}</span>;
      case 'delivered': return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md">{t('delivered', 'Delivered')}</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-md">{status}</span>;
    }
  };

  return (
    <main className="page-shell">
      {/* ─── Hero Welcome Banner ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-6 sm:p-9 shadow-xl animate-enter">
        <div className="hero-orb orb-one opacity-20" />
        <div className="hero-orb orb-two opacity-15" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles size={13} className="text-amber-300" />
              <span>{t('woolconnectBuyerPortal', 'WoolConnect Buyer Portal')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {t('welcome', 'Welcome')}, {profile?.name?.split(' ')[0] || 'Buyer'}. <br />
              <span className="text-emerald-200 font-medium text-xl sm:text-2xl lg:text-3xl">
                {t('findVerifiedWoolHistory', 'Find verified wool with a complete digital history.')}
              </span>
            </h1>

            <p className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-white/80">
              <MapPin size={14} className="text-emerald-300" />
              <span>{profile?.district || 'India'}, {profile?.state || 'India'}</span>
              {profile?.organization ? (
                <>
                  <span className="mx-1 opacity-40">•</span>
                  <span>{profile.organization}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => navigate('/buyer/marketplace')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-primary font-bold text-sm shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              <Search size={17} />
              <span>{t('findWool', 'Find Wool')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Metric Cards Grid ─── */}
      <section className="dashboard-grid animate-enter delay-1 mt-6">
        {/* Card 1: Active Orders */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primaryLight text-primary">
              <ShoppingCart size={22} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('activeOrders', 'Active Orders')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">
              {activeOrders.length}
            </p>
            <p className="text-xs text-textSecondary mt-1.5 flex items-center gap-1">
              <span>{t('activeOrdersDesc', 'Orders currently processing or in transit')}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Delivered Orders */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Package size={22} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('deliveredOrders', 'Delivered Orders')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">
              {deliveredOrders.length}
            </p>
            <p className="text-xs text-textSecondary mt-1.5 flex items-center gap-1">
              <span>{t('successfullyReceived', 'Successfully received')}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Total Wool Purchased */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700">
              <TrendingUp size={22} />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('totalWoolSourced', 'Total Wool Sourced')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">
              {totalVolume.toLocaleString()} <span className="text-base text-textSecondary font-semibold">kg</span>
            </p>
            <p className="text-xs text-textSecondary mt-1.5 flex items-center gap-1">
              <span>{t('lifetimeVolume', 'Lifetime volume')}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Quick Actions ─── */}
      <section className="mt-10 animate-enter delay-2">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={13} /> {t('navigation', 'Navigation')}</p>
            <h2 className="text-xl font-bold text-textPrimary">{t('quickActions', 'Quick Actions')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className={`flex items-center gap-3.5 p-4 rounded-2xl bg-surface border ${action.accent} shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover text-left group`}
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${action.tone} shadow-sm`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors leading-tight">
                    {action.label}
                  </p>
                  <p className="text-xs text-textSecondary mt-0.5 truncate">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-textMuted transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Recent Orders & Available Wool ─── */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-enter delay-3">
        
        {/* Recent Orders */}
        <section>
          <div className="section-heading mb-4">
            <div>
              <p className="eyebrow text-primary"><Layers size={13} /> Activity</p>
              <h2 className="text-xl font-bold text-textPrimary">Recent Orders</h2>
            </div>
            <Link to="/buyer/orders" className="text-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
             <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primaryLight text-primary mb-3">
                <ShoppingCart size={24} />
              </span>
              <h3 className="font-bold text-sm text-textPrimary">No orders yet</h3>
              <p className="text-xs text-textSecondary mt-1 mb-4">Start exploring verified wool in the marketplace.</p>
              <button onClick={() => navigate('/buyer/marketplace')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primaryDark transition-all">
                Find Wool
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map(order => (
                <div key={order.id || order._id} onClick={() => navigate(`/buyer/orders/${order.id || order._id}`)} className="p-4 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group">
                  <div>
                    <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors">Order #{order.orderId}</p>
                    <p className="text-xs text-textSecondary">{order.woolType} • {order.quantityKg} kg • ₹{order.totalAmount}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(order.status)}
                    <span className="text-[10px] text-textMuted">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Wool */}
        <section>
          <div className="section-heading mb-4">
            <div>
              <p className="eyebrow text-primary"><Sparkles size={13} /> Marketplace</p>
              <h2 className="text-xl font-bold text-textPrimary">Available Wool</h2>
            </div>
            <Link to="/buyer/marketplace" className="text-link">
              <span>View Market</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
             <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface border border-border">
              <p className="text-sm text-textSecondary">No active listings available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recommendations.map(listing => (
                <div key={listing.id} onClick={() => navigate(`/buyer/marketplace/${listing.id}`)} className="p-4 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors">{listing.wool_type}</p>
                      <p className="text-[11px] text-textSecondary">Grade: <span className="font-semibold text-textPrimary">{listing.grade}</span></p>
                    </div>
                    <span className="font-bold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">₹{listing.price_per_kg}/kg</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-textMuted truncate flex items-center gap-1"><MapPin size={10} /> {listing.location?.district}</span>
                    <span className="text-[11px] font-bold text-textPrimary">{listing.quantity_kg} kg left</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
