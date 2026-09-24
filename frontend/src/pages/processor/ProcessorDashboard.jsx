import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ArrowRight, Activity, Package, Inbox, CheckCircle, ChevronRight, Sparkles, MapPin } from 'lucide-react';
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
    { label: 'Micro-Filtration & Conditioning', desc: 'Warm cloth filtration at 40°C & moisture control', icon: Activity, route: '/processor/active', tone: 'bg-primary text-white', accent: 'border-primary/30 hover:border-primary' },
    { label: 'Raw Honey Intake', desc: 'Review incoming apiary extraction requests', icon: Inbox, route: '/processor/requests', tone: 'bg-accent text-white', accent: 'border-accent/30 hover:border-accent' },
    { label: 'Incoming Lots', desc: 'Receive 30kg raw honey barrels', icon: Package, route: '/processor/incoming', tone: 'bg-info text-white', accent: 'border-info/30 hover:border-info' },
    { label: 'Bottling & QR Labeling', desc: 'Pack into 250g, 500g jars with QR stickers', icon: CheckCircle, route: '/processor/batches', tone: 'bg-emerald-600 text-white', accent: 'border-emerald-500/30 hover:border-emerald-600' },
  ];

  return (
    <main className="page-shell">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-6 sm:p-9 shadow-xl animate-enter">
        <div className="hero-orb orb-one opacity-20" />
        <div className="hero-orb orb-two opacity-15" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles size={13} className="text-amber-300" />
              <span>Honey Processing & Bottling Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome, {profile?.name?.split(' ')[0] || 'Bottling Master'}. <br />
              <span className="text-amber-200 font-medium text-xl sm:text-2xl lg:text-3xl">Manage honey intake, micro-filtration, and packaging.</span>
            </h1>
            <p className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-white/80">
              <MapPin size={14} className="text-amber-300" />
              <span>{profile?.district || 'Bharatpur'}, {profile?.state || 'Rajasthan'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="dashboard-grid animate-enter delay-1 mt-6">
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600"><Inbox size={22} /></span></div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('procPendingRequests', 'Pending Requests')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">{stats?.pendingRequests || 0}</p>
          </div>
        </div>
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700"><Activity size={22} /></span></div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">Active Processing</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">{stats?.activeProcessing || 0}</p>
          </div>
        </div>
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle size={22} /></span></div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('procTotalProcessedVol', 'Total Processed Vol')}</p>
            <p className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">{stats?.totalProcessedVolume || 0} <span className="text-base text-textSecondary font-semibold">kg</span></p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-10 animate-enter delay-2">
        <div className="section-heading mb-4">
          <div><p className="eyebrow text-primary"><Sparkles size={13} /> Navigation</p><h2 className="text-xl font-bold text-textPrimary">{t('procQuickActions', 'Quick Actions')}</h2></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button key={action.label} onClick={() => navigate(action.route)} className={`flex items-center gap-3.5 p-4 rounded-2xl bg-surface border ${action.accent} shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover text-left group`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${action.tone} shadow-sm`}><Icon size={20} /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors leading-tight">{action.label}</p>
                  <p className="text-xs text-textSecondary mt-0.5 truncate">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-textMuted transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Processing Preview */}
      <div className="mt-12 animate-enter delay-3">
        <section>
          <div className="section-heading mb-4">
            <div><p className="eyebrow text-primary"><Layers size={13} /> Activity</p><h2 className="text-xl font-bold text-textPrimary">Active Processing</h2></div>
            <Link to="/processor/active" className="text-link"><span>View All</span><ArrowRight size={14} /></Link>
          </div>
          {loading ? (
             <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : active.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No active processing batches.</p></div>
          ) : (
            <div className="grid gap-3">
              {active.map(batch => (
                <div key={batch.id} onClick={() => navigate('/processor/active')} className="p-4 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group">
                  <div>
                    <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors">Batch {batch.id}</p>
                    <p className="text-xs text-textSecondary">Current Qty: {batch.quantity} kg • Original: {batch.originalQuantity} kg</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase rounded-md">{batch.stage}</span>
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
