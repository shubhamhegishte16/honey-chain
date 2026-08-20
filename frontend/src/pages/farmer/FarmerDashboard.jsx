import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Package,
  ClipboardPlus,
  Store,
  MapPin,
  Sparkles,
  QrCode,
  ArrowUpRight,
  BadgeIndianRupee,
  Layers,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/ui/Card';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { getBatchesByFarmer, getTotalInventory } from '../../services/batches.service';
import { getAllStatePrices } from '../../services/market.service';

export default function FarmerDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [price, setPrice] = useState(null);
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    if (!profile?.id) return;
    try {
      const [invResult, priceResult, batchesResult] = await Promise.all([
        getTotalInventory(profile.id),
        getAllStatePrices(),
        getBatchesByFarmer(profile.id),
      ]);

      if (!invResult.error) setInventory(invResult.data);
      if (!priceResult.error && priceResult.data?.length > 0) {
        const stateMatch = priceResult.data.find(p => p.state === profile.state) || priceResult.data[0];
        setPrice(stateMatch);
      }
      if (!batchesResult.error) {
        setRecentBatches((batchesResult.data || []).slice(0, 5));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [profile?.id, profile?.state]);

  const quickActions = [
    {
      label: 'Record New Batch',
      desc: 'Mint fresh wool lot & QR code',
      icon: ClipboardPlus,
      route: '/batches/add',
      tone: 'bg-primary text-white',
      accent: 'border-primary/30 hover:border-primary',
    },
    {
      label: 'Sell in Marketplace',
      desc: 'List lots for verified buyers & mills',
      icon: Store,
      route: '/farmer/marketplace',
      tone: 'bg-accent text-white',
      accent: 'border-accent/30 hover:border-accent',
    },
    {
      label: 'Trace Batches',
      desc: 'Track scouring & delivery stages',
      icon: Package,
      route: '/farmer/tracking',
      tone: 'bg-info text-white',
      accent: 'border-info/30 hover:border-info',
    },
    {
      label: 'Mandi Rates',
      desc: 'Live state prices & trends',
      icon: TrendingUp,
      route: '/farmer/market',
      tone: 'bg-emerald-600 text-white',
      accent: 'border-emerald-500/30 hover:border-emerald-600',
    },
  ];

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
              <span>WOOLCONNECT</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {t('namaste')}, {profile?.name?.split(' ')[0] || t('farmerFallback')}. <br />
              <span className="text-emerald-200 font-medium text-xl sm:text-2xl lg:text-3xl">
                {t('whatToDo')}
              </span>
            </h1>

            <p className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-white/80">
              <MapPin size={14} className="text-emerald-300" />
              <span>{profile?.district || 'Bikaner'}, {profile?.state || 'Rajasthan'}</span>
              {profile?.flockSize ? (
                <>
                  <span className="mx-1 opacity-40">•</span>
                  <span>Flock Size: {profile.flockSize} Sheep</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => navigate('/batches/add')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-primary font-bold text-sm shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              <ClipboardPlus size={17} />
              <span>{t('addNewWool')}</span>
            </button>

            <button
              onClick={() => navigate('/farmer/tracking')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm backdrop-blur hover:bg-white/20 transition-all"
            >
              <span>{t('myWool')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Metric Cards Grid ─── */}
      <section className="dashboard-grid animate-enter delay-1">
        {/* Card 1: Available Inventory */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primaryLight text-primary">
              <Package size={22} />
            </span>
            <span className="text-[11px] font-bold text-primary bg-primaryLight/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
              On-Farm
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('totalWool')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">
              {inventory !== null ? `${inventory.toLocaleString()} kg` : '0 kg'}
            </p>
            <p className="text-xs text-textSecondary mt-1.5 flex items-center gap-1">
              <span>Across active recorded batches</span>
            </p>
          </div>
        </div>

        {/* Card 2: Local Mandi Benchmark */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-800">
              <BadgeIndianRupee size={22} />
            </span>
            {price && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  Number(price.change_percent || 0) >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {Number(price.change_percent || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(Number(price.change_percent || 0))}%
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('todaysPrice')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">
              {price ? `₹${price.price_per_kg}` : '₹310'}<span className="text-base font-semibold text-textSecondary">/kg</span>
            </p>
            <p className="text-xs text-textSecondary mt-1.5 truncate">
              {price?.wool_type || 'Chokla'} · {price?.state || profile?.state || 'Rajasthan'}
            </p>
          </div>
        </div>

        {/* Card 3: Traceability & QR Status */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-surface via-surface to-primaryLight/30">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700">
              <QrCode size={22} />
            </span>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              100% Verified
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('qrPassportStatus')}</p>
            <p className="text-2xl font-bold text-textPrimary mt-1 tracking-tight">
              {recentBatches.length} {t('batchesTagged')}
            </p>
            <Link
              to="/farmer/tracking"
              className="text-xs font-bold text-primary hover:text-primaryDark mt-2 inline-flex items-center gap-1 group"
            >
              <span>{t('viewAllPassports')}</span>
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Quick Actions ─── */}
      <section className="mt-10 animate-enter delay-2">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={13} /> Quick Tools</p>
            <h2 className="text-xl font-bold text-textPrimary">{t('whatToDo')}</h2>
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

      {/* ─── Recent Wool Batches ─── */}
      <section className="mt-12 animate-enter delay-3">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow text-primary"><Layers size={13} /> Harvest Ledger</p>
            <h2 className="text-xl font-bold text-textPrimary">{t('myWool')}</h2>
          </div>
          <Link to="/farmer/tracking" className="text-link">
            <span>{t('viewWool')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : recentBatches.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
            <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3">
              <Package size={28} />
            </span>
            <h3 className="font-bold text-base text-textPrimary">{t('noWoolYet')}</h3>
            <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-5">
              {t('noWoolHelp')}
            </p>
            <button
              onClick={() => navigate('/batches/add')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primaryDark transition-all"
            >
              <ClipboardPlus size={15} />
              <span>{t('recordFirstBatch')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recentBatches.map(batch => (
              <div
                key={batch.id || batch._id}
                onClick={() => navigate(`/batches/${batch.id || batch._id}/details`)}
                className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-card-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primaryLight text-primary font-bold shrink-0">
                      <Package size={18} />
                    </span>
                    <div>
                      <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors">
                        {batch.batch_id}
                      </p>
                      <p className="text-xs text-textSecondary font-medium">
                        {batch.wool_type} • <span className="font-bold text-textPrimary">{batch.quantity_kg} kg</span>
                      </p>
                    </div>
                  </div>
                  <BatchStatusBadge status={batch.status} />
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-textMuted">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {batch.district}, {batch.state}
                  </span>
                  <span className="font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Details <ArrowUpRight size={14} />
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
