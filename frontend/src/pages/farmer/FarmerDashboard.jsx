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

  const primaryActions = [
    {
      label: t('addNewWool', 'Add Wool Clip'),
      desc: t('recordFirstBatch', 'Record today’s shearing clip & lot weight'),
      icon: ClipboardPlus,
      route: '/batches/add',
      tone: 'bg-primary text-white',
      accent: 'border-primary/30 hover:border-primary',
    },
    {
      label: t('todayWoolPrice', "Today's Price"),
      desc: t('liveMandiRateDesc', 'Live APMC Mandi rates & market trends'),
      icon: TrendingUp,
      route: '/farmer/market',
      tone: 'bg-emerald-600 text-white',
      accent: 'border-emerald-500/30 hover:border-emerald-600',
    },
    {
      label: t('sellWool', 'Sell Wool'),
      desc: t('listLotsForVerified', 'List lots directly for verified buyers & mills'),
      icon: Store,
      route: '/farmer/marketplace',
      tone: 'bg-accent text-white',
      accent: 'border-accent/30 hover:border-accent',
    },
    {
      label: t('myWool', 'My Wool Lots'),
      desc: t('viewBatchesWeights', 'View your recorded clips & status'),
      icon: Package,
      route: '/farmer/tracking',
      tone: 'bg-info text-white',
      accent: 'border-info/30 hover:border-info',
    },
    {
      label: t('myQrPassport', 'My QR / Passport'),
      desc: t('viewPassportQrDesc', 'View lot digital passports & print QR codes'),
      icon: QrCode,
      route: '/farmer/tracking',
      tone: 'bg-sky-700 text-white',
      accent: 'border-sky-600/30 hover:border-sky-700',
    },
    {
      label: t('learnNav', 'Learn & Improve'),
      desc: t('learnTrainingDesc', 'Best practices for shearing, flock health & yield'),
      icon: Sparkles,
      route: '/learn',
      tone: 'bg-purple-600 text-white',
      accent: 'border-purple-500/30 hover:border-purple-600',
    },
  ];

  return (
    <main className="page-shell">
      {/* ─── Hero Welcome Banner ─── */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-4 sm:p-8 shadow-md animate-fade-in-down">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 border border-white/15 text-[11px] font-semibold mb-2">
              <img src="/logo.png" alt="Emblem" className="h-3.5 w-3.5 object-contain rounded-full" />
              <span>{t('woolconnectSparkles', 'WoolConnect ✨')}</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {t('namaste')}, {profile?.name?.split(' ')[0] || t('farmerFallback')}
            </h1>

            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <MapPin size={13} className="text-emerald-300 shrink-0" />
              <span>{profile?.district || t('bikaner')}, {profile?.state || t('rajasthan')}</span>
              {profile?.flockSize ? (
                <>
                  <span className="mx-1 opacity-40">•</span>
                  <span>{profile.flockSize} {t('sheepCount')}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            <button
              onClick={() => navigate('/batches/add')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <ClipboardPlus size={16} />
              <span>{t('addNewWool')}</span>
            </button>

            <button
              onClick={() => navigate('/farmer/tracking')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all"
            >
              <span>{t('myWool')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Metric Cards Grid ─── */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 mt-3 sm:mt-5">
        {/* Card 1: Available Inventory */}
        <div className="bg-surface p-3.5 sm:p-5 rounded-2xl border border-border/80 shadow-xs flex flex-col justify-between animate-fade-in-up delay-1">
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-primaryLight text-primary">
              <Package size={19} />
            </span>
            <span className="text-[10px] font-bold text-primary bg-primaryLight px-2 py-0.5 rounded-full">
              {t('onFarm', 'On Farm')}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-textMuted">{t('totalWool')}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-textPrimary mt-0.5 tracking-tight">
              {inventory !== null ? `${inventory.toLocaleString()} kg` : '0 kg'}
            </p>
          </div>
        </div>

        {/* Card 2: Local Mandi Benchmark */}
        <div className="bg-surface p-3.5 sm:p-5 rounded-2xl border border-border/80 shadow-xs flex flex-col justify-between animate-fade-in-up delay-2">
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-amber-50 text-amber-800">
              <BadgeIndianRupee size={19} />
            </span>
            {price && (
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  Number(price.change_percent || 0) >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {Number(price.change_percent || 0) >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(Number(price.change_percent || 0))}%
              </span>
            )}
          </div>

          <div className="mt-3">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-textMuted">{t('todaysPrice')}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-textPrimary mt-0.5 tracking-tight">
              {price ? `₹${price.price_per_kg}` : '₹310'}<span className="text-xs font-semibold text-textSecondary">/kg</span>
            </p>
          </div>
        </div>

        {/* Card 3: Traceability & QR Status - full width on phone */}
        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-surface to-primaryLight/20 p-3.5 sm:p-5 rounded-2xl border border-border/80 shadow-xs flex flex-col justify-between animate-fade-in-up delay-3">
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
              <QrCode size={19} />
            </span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
              {t('hundredPercentVerified', '100% Verified')}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-textMuted">{t('qrPassportStatus')}</p>
              <p className="text-lg sm:text-2xl font-bold text-textPrimary mt-0.5 tracking-tight">
                {recentBatches.length} {t('batchesTagged')}
              </p>
            </div>
            <Link
              to="/farmer/tracking"
              className="text-xs font-bold text-primary hover:text-primaryDark inline-flex items-center gap-0.5"
            >
              <span>{t('viewAllPassports')}</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6 Core Action Cards Grid ─── */}
      <section className="mt-6 sm:mt-10 animate-fade-in-up delay-4">
        <div className="section-heading mb-3">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={12} /> {t('quickTools')}</p>
            <h2 className="text-lg sm:text-xl font-bold text-textPrimary">{t('whatToDo')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {primaryActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-surface border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-sm active:scale-[0.98] transition-all text-left group min-h-[90px] sm:min-h-[80px]"
              >
                <span className={`grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl ${action.tone} shadow-xs`}>
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm text-textPrimary group-hover:text-primary transition-colors leading-tight">
                    {action.label}
                  </p>
                  <p className="hidden sm:block text-[10px] sm:text-xs text-textSecondary mt-0.5 sm:mt-1 line-clamp-2 leading-snug">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Recent Wool Batches ─── */}
      <section className="mt-12 animate-fade-in-up delay-5">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow text-primary"><Layers size={13} /> {t('harvestLedger')}</p>
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
            <p className="hidden sm:block text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-5">
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
                    {t('detailsArrow')} <ArrowUpRight size={14} />
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
