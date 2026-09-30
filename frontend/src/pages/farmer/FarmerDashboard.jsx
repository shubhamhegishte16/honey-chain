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
  Cpu,
  Thermometer,
  Droplets,
  Volume2,
  Scale,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
        setRecentBatches((batchesResult.data || []).slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [profile?.id, profile?.state]);

  const primaryActions = [
    {
      label: 'Log Honey Harvest',
      desc: 'Record extraction weight, bloom & GPS coordinates',
      icon: ClipboardPlus,
      route: '/batches/add',
      tone: 'bg-[#861C1C] text-white',
    },
    {
      label: 'Honey Mandi Rates',
      desc: 'Live APMC benchmark rates & state trends',
      icon: TrendingUp,
      route: '/farmer/market',
      tone: 'bg-[#C06E30] text-white',
    },
    {
      label: 'Sell Raw Honey',
      desc: 'List barrels to verified FMCG & Ayurvedic buyers',
      icon: Store,
      route: '/farmer/marketplace',
      tone: 'bg-[#F4B345] text-[#281D1C]',
    },
    {
      label: 'My Apiary Lots',
      desc: 'View recorded lots, NMR status & traceability',
      icon: Package,
      route: '/farmer/tracking',
      tone: 'bg-[#281D1C] text-white',
    },
    {
      label: 'Print QR Passports',
      desc: 'Generate printable cryptographic QR stickers',
      icon: QrCode,
      route: '/farmer/tracking',
      tone: 'bg-[#861C1C] text-white',
    },
    {
      label: 'Beekeeping Hub',
      desc: 'Flora migration calendar & swarm guidance',
      icon: Sparkles,
      route: '/learn',
      tone: 'bg-[#C06E30] text-white',
    },
  ];

  return (
    <main className="page-shell">
      
      {/* ─── 1. HERO BENTO WELCOME BANNER (CLEAN & MINIMAL) ─── */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white border border-[#E8E3CF] shadow-card mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF6E4] text-[#861C1C] border border-[#F4B345]/30 text-xs font-bold mb-3">
              <span className="text-sm">🐝</span>
              <span>KVIC Honey Mission • Smart Beekeeper Console</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#281D1C] leading-tight">
              Namaste, {profile?.name || 'Ramesh Singh'}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#5E524D] flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[#C06E30] font-semibold">
                <MapPin size={14} /> {profile?.district || 'Bharatpur'}, {profile?.state || 'Rajasthan'}
              </span>
              <span className="opacity-40">•</span>
              <span className="font-semibold text-[#281D1C]">{profile?.flockSize || 65} Active Bee Boxes</span>
              <span className="opacity-40">•</span>
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200">Apis mellifera Certified</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-36 sm:w-44 h-24 sm:h-28 rounded-2xl overflow-hidden border border-[#E8E3CF] shadow-sm hidden md:block">
              <img
                src="/smart-apiary.jpg"
                alt="Smart Apiary Bee Boxes"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1.5 px-2 py-0.5 rounded-full bg-[#281D1C]/80 text-[9px] font-bold text-[#F4B345] backdrop-blur-xs">
                Apiary Sector 4
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigate('/batches/add')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#861C1C] text-white font-bold text-xs sm:text-sm shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95"
              >
                <ClipboardPlus size={16} />
                <span>Log Honey Harvest</span>
              </button>

              <button
                onClick={() => navigate('/farmer/tracking')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF7EE] border border-[#E8E3CF] text-[#281D1C] font-semibold text-xs sm:text-sm hover:bg-white hover:border-[#D6CEB5] transition-all"
              >
                <span>My Lots &amp; QR</span>
                <ArrowRight size={14} />
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#861C1C] transition-colors"
              >
                <span>← Main Page</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. STATS & METRICS BENTO ─── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30]">
              <Package size={20} />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Apiary Inventory
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">Total Raw Honey</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#281D1C] font-serif mt-0.5">
              {inventory !== null ? `${inventory.toLocaleString()} kg` : '60 kg'}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FBEBEB] text-[#861C1C]">
              <BadgeIndianRupee size={20} />
            </span>
            {price && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${Number(price.change_percent || 0) >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                {price.change_percent >= 0 ? `+${price.change_percent}%` : `${price.change_percent}%`}
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">Today's Mandi Benchmark</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#281D1C] font-serif mt-0.5">
              {price ? `₹${price.price_per_kg}` : '₹285'}<span className="text-xs font-normal text-[#5E524D]">/kg</span>
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FAF7EE] text-[#281D1C]">
              <QrCode size={20} />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF6E4] text-[#C06E30] border border-[#F4B345]/30">
              Blockchain Sealed
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">Active Honey Lots</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#281D1C] font-serif mt-0.5">
              {recentBatches.length || 3} Lots
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={20} />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              100% Purity
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">KVIC Lab Clearance</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-serif mt-0.5">
              Grade A+
            </p>
          </div>
        </div>

      </section>

      {/* ─── 3. LIVE SMART BEEHIVE TELEMETRY BENTO CARD (CLEAN & MINIMAL) ─── */}
      <section className="rounded-3xl bg-white text-[#281D1C] p-6 sm:p-8 shadow-card mb-8 border border-[#E8E3CF] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E3CF] gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30] font-bold text-xl border border-[#F4B345]/30">
              🐝
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-serif text-[#281D1C]">Smart Hive IoT Telemetry</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Simulated LoRaWAN Telemetry
                </span>
              </div>
              <p className="text-xs text-[#5E524D] mt-0.5">Box #HIVE-RJ-042 • Mustard Bloom Apiary</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5E524D] bg-[#FAF7EE] px-3 py-1 rounded-full border border-[#E8E3CF]">
              Queen: <strong className="text-emerald-800">Active</strong>
            </span>
            <span className="text-xs text-[#5E524D] bg-[#FAF7EE] px-3 py-1 rounded-full border border-[#E8E3CF]">
              Colony: <strong className="text-[#861C1C]">48,000 Bees</strong>
            </span>
          </div>
        </div>

        {/* 4 Sensor Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
          <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
            <div className="flex items-center gap-1.5 text-[#C06E30] text-xs font-bold mb-1">
              <Thermometer size={14} /> Brood Temp
            </div>
            <p className="text-2xl font-black text-[#281D1C]">34.8°C</p>
            <p className="text-[10px] text-emerald-800 font-semibold mt-1">● Optimal (34° – 35.5°C)</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
            <div className="flex items-center gap-1.5 text-sky-700 text-xs font-bold mb-1">
              <Droplets size={14} /> Humidity
            </div>
            <p className="text-2xl font-black text-[#281D1C]">58%</p>
            <p className="text-[10px] text-emerald-800 font-semibold mt-1">● Healthy Comb Ripening</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
            <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold mb-1">
              <Scale size={14} /> Daily Surge
            </div>
            <p className="text-2xl font-black text-[#861C1C]">+1.4 kg</p>
            <p className="text-[10px] text-emerald-800 font-semibold mt-1">● High Flow (Ready)</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF]">
            <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold mb-1">
              <Volume2 size={14} /> Frequency
            </div>
            <p className="text-2xl font-black text-[#281D1C]">232 Hz</p>
            <p className="text-[10px] text-emerald-800 font-semibold mt-1">● Normal Acoustic State</p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E8E3CF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-[#5E524D]">
            AI Diagnosis: <strong className="text-[#281D1C]">Varroa Mite Density &lt;0.8% (Clean)</strong> • Zero Swarm Hazard
          </span>
          <Link
            to="/quality"
            className="text-xs font-bold text-[#861C1C] hover:underline flex items-center gap-1"
          >
            <span>Open AI Lab Diagnostics</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </section>

      {/* ─── 4. QUICK ACTIONS BENTO ─── */}
      <section className="mb-8">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><Sparkles size={12} /> Beekeeper Toolkit</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Primary Actions</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {primaryActions.map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                onClick={() => navigate(act.route)}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all hover:-translate-y-0.5 text-left group"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${act.tone} shadow-sm shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-bold text-sm text-[#281D1C] group-hover:text-[#861C1C] transition-colors font-serif">
                    {act.label}
                  </p>
                  <p className="text-xs text-[#5E524D] mt-0.5 line-clamp-2">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 5. RECENT HONEY LOTS LEDGER ─── */}
      <section className="mb-10">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><Layers size={12} /> Harvest Ledger</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Recent Honey Batches</h2>
          </div>
          <Link to="/farmer/tracking" className="text-link">
            <span>View All Lots</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentBatches.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col items-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30] mb-3">
              <Package size={24} />
            </span>
            <h3 className="font-bold font-serif text-lg text-[#281D1C]">No Honey Lots Logged Yet</h3>
            <p className="text-xs text-[#5E524D] mt-1 max-w-sm">Log your first honey extraction to generate a cryptographic blockchain batch ID.</p>
            <button
              onClick={() => navigate('/batches/add')}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#861C1C] text-white text-xs font-bold hover:bg-[#6A1515] shadow-burgundy transition-all"
            >
              Log First Harvest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBatches.map(b => (
              <div
                key={b.id || b._id}
                onClick={() => navigate(`/batches/${b.id || b._id}/details`)}
                className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all hover:-translate-y-0.5 cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30] text-lg font-bold shrink-0">
                      🍯
                    </span>
                    <div>
                      <p className="font-bold text-sm text-[#281D1C] group-hover:text-[#861C1C] transition-colors font-serif">
                        {b.batch_id}
                      </p>
                      <p className="text-xs text-[#5E524D]">
                        {b.floralSource || b.wool_type || 'Mustard Blossom Honey'} • <strong className="text-[#281D1C]">{b.quantity_kg} kg</strong>
                      </p>
                    </div>
                  </div>
                  <BatchStatusBadge status={b.status} />
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3CF] flex items-center justify-between text-xs text-[#5E524D]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin size={12} className="text-[#C06E30]" /> {b.district}, {b.state}
                  </span>
                  <span className="font-bold text-[#861C1C] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Batch <ArrowUpRight size={13} />
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
