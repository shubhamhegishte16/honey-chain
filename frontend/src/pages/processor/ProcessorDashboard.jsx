import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ArrowRight, Activity, Package, Inbox, CheckCircle, ChevronRight, Sparkles, MapPin, ShieldCheck, Factory, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getProcessorStats, getActiveProcessing } from '../../services/processor.service';

export default function ProcessorDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [active, setActive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [statsRes, activeRes] = await Promise.all([getProcessorStats(), getActiveProcessing()]);
      if (!statsRes.error) setStats(statsRes.data);
      if (!activeRes.error) setActive(activeRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const quickActions = [
    { label: 'Micro-Filtration & Settling', desc: 'Gentle filtration at 40°C & moisture stabilization', icon: Activity, route: '/processor/active', tone: 'bg-[#861C1C] text-white' },
    { label: 'Raw Honey Intake', desc: 'Review incoming apiary extraction requests', icon: Inbox, route: '/processor/requests', tone: 'bg-[#C06E30] text-white' },
    { label: 'Incoming Lots', desc: 'Receive 30kg raw honey food-grade barrels', icon: Package, route: '/processor/incoming', tone: 'bg-[#281D1C] text-white' },
    { label: 'Bottling & QR Packaging', desc: 'Pack into 250g, 500g glass jars with QR passports', icon: CheckCircle, route: '/processor/batches', tone: 'bg-[#F4B345] text-[#281D1C]' },
  ];

  return (
    <main className="page-shell">
      
      {/* ─── Hero Welcome Banner ─── */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-[#281D1C] text-white p-6 sm:p-10 shadow-soft-lg mb-6">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4B345]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4B345] border border-white/15 text-xs font-bold backdrop-blur-md mb-3">
              <Factory size={14} /> Honey Conditioning &amp; Bottling Facility
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-white leading-tight">
              Welcome, {profile?.name || 'Vikramjit Sahni'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/80 flex items-center gap-2">
              <span>{profile?.organization || 'Golden Nectar Agrotech Processing Unit'}</span>
              <span className="opacity-40">•</span>
              <span className="text-[#F4B345] font-semibold">{profile?.district || 'Amritsar'}, {profile?.state || 'Punjab'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/processor/batches')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4B345] text-[#281D1C] font-bold text-xs sm:text-sm shadow-gold hover:bg-[#F6C063] transition-all hover:scale-105 active:scale-95"
            >
              <QrCode size={16} />
              <span>Packaging &amp; QR Minting</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Metrics Bento ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        
        <div className="p-6 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30]">
              <Inbox size={20} />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Pending Intake
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">Raw Intake Requests</p>
            <p className="text-3xl font-extrabold text-[#281D1C] font-serif mt-1">{stats?.pendingRequests || 2} Lots</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FBEBEB] text-[#861C1C]">
              <Activity size={20} />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Vats
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">In Micro-Filtration</p>
            <p className="text-3xl font-extrabold text-[#281D1C] font-serif mt-1">{stats?.activeProcessing || 1} Batches</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckCircle size={20} />
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Bottled
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E524D]">Total Processed Volume</p>
            <p className="text-3xl font-extrabold text-emerald-800 font-serif mt-1">{stats?.totalProcessedVolume || 640} <span className="text-sm font-normal text-[#5E524D]">kg</span></p>
          </div>
        </div>

      </section>

      {/* ─── Quick Actions Bento ─── */}
      <section className="mb-8">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><Sparkles size={12} /> Facility Controls</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Processing Operations</h2>
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
                  Open →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Active Processing Vats ─── */}
      <section className="mb-10">
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><Activity size={12} /> Live Conditioning</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">Active Micro-Filtration Batches</h2>
          </div>
          <Link to="/processor/active" className="text-link">
            <span>View All Active Vats</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {active.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
            <span className="text-3xl">🍯</span>
            <h3 className="font-bold font-serif text-lg text-[#281D1C] mt-2">All Processing Vats Idle</h3>
            <p className="text-xs text-[#5E524D] mt-1">Check incoming requests to start raw honey micro-filtration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map(b => (
              <div
                key={b.id}
                onClick={() => navigate(`/processor/active`)}
                className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E3CF]">
                    <span className="font-mono text-xs font-bold text-[#861C1C] bg-[#FBEBEB] px-2.5 py-0.5 rounded-full border border-[#861C1C]/20">
                      Vat #{b.batchId || b.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      Settling at 38°C
                    </span>
                  </div>

                  <h3 className="font-bold font-serif text-base text-[#281D1C] mt-3">
                    {b.woolType || 'Mustard Blossom Raw Honey'}
                  </h3>
                  <p className="text-xs text-[#5E524D] mt-0.5">
                    Volume: <strong className="text-[#281D1C]">{b.quantityKg || 60} kg</strong> • Stage: <strong className="text-[#861C1C]">Cloth Micro-Filtration</strong>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3CF] flex items-center justify-between text-xs text-[#5E524D]">
                  <span>Beekeeper: {b.farmer?.name || 'Ramesh Singh'}</span>
                  <span className="font-bold text-[#861C1C] flex items-center gap-1">
                    Manage Process →
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
