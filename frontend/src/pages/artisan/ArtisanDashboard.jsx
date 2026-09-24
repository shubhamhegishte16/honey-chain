import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Cog,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAssignedProcessingRequests } from '../../services/processing.service';

export default function ArtisanDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAssignedProcessingRequests().then(({ data, error }) => {
      if (!error) setRequests(data || []);
      setLoading(false);
    });
  }, []);

  const assignedCount = requests.filter(r => r.status !== 'completed' && r.status !== 'rejected').length;
  const processingCount = requests.filter(r => r.status === 'in_progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const qualityCount = requests.filter(
    r => ['in_progress', 'completed'].includes(r.status) && r.batch?.qualityGrade === 'Pending Inspection'
  ).length;

  const cards = [
    { label: t('assignedWool'), value: assignedCount, icon: Package, tone: 'bg-primaryLight text-primary', route: '/artisan/batches' },
    { label: t('processing'), value: processingCount, icon: Cog, tone: 'bg-sky-50 text-sky-700', route: '/artisan/processing' },
    { label: t('readyCompleted'), value: completedCount, icon: CheckCircle, tone: 'bg-emerald-50 text-emerald-700', route: '/artisan/completed' },
    { label: t('qualityPending'), value: qualityCount, icon: ShieldCheck, tone: 'bg-amber-50 text-amber-800', route: '/artisan/quality' },
  ];

  const primaryActions = [
    { label: t('viewAssignedWool'), icon: Package, route: '/artisan/batches', tone: 'bg-primary text-white', accent: 'border-primary/30 hover:border-primary' },
    { label: t('startProcessingAction'), icon: Cog, route: '/artisan/processing', tone: 'bg-accent text-white', accent: 'border-accent/30 hover:border-accent' },
    { label: t('updateProcessingAction'), icon: ShieldCheck, route: '/artisan/quality', tone: 'bg-info text-white', accent: 'border-info/30 hover:border-info' },
    { label: t('viewCompletedWork'), icon: CheckCircle, route: '/artisan/completed', tone: 'bg-emerald-600 text-white', accent: 'border-emerald-500/30 hover:border-emerald-600' },
  ];

  return (
    <main className="page-shell">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-4 sm:p-8 shadow-md animate-fade-in-down">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 border border-white/15 text-[11px] font-semibold mb-2">
              <img src="/logo.png" alt="Emblem" className="h-3.5 w-3.5 object-contain rounded-full" />
              <span>HONEYCHAIN</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {t('namaste')}, {profile?.name?.split(' ')[0] || t('artisanFallback')}
            </h1>

            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <MapPin size={13} className="text-emerald-300 shrink-0" />
              <span>{profile?.district || ''}{profile?.district && profile?.state ? ', ' : ''}{profile?.state || ''}</span>
            </p>
          </div>

          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              onClick={() => navigate('/artisan/batches')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <Package size={16} />
              <span>{t('viewAssignedWool')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric cards (2x2 on mobile, 4-col on desktop) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-3 sm:mt-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.route)}
              className={`bg-surface p-3.5 sm:p-5 rounded-2xl border border-border/80 shadow-xs flex flex-col justify-between text-left hover:border-primary/40 active:scale-95 transition-all animate-fade-in-up delay-${Math.min(idx + 1, 6)}`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl ${card.tone}`}>
                  <Icon size={19} />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-textMuted">{card.label}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-textPrimary mt-0.5 tracking-tight">
                  {loading ? '–' : card.value}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {/* Primary actions (2-col on mobile) */}
      <section className="mt-6 sm:mt-10 animate-fade-in-up delay-4">
        <div className="section-heading mb-3">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={12} /> {t('quickActions')}</p>
            <h2 className="text-lg sm:text-xl font-bold text-textPrimary">{t('manageWorkOnePlace')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {primaryActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-sm active:scale-95 transition-all text-left group min-h-[75px]"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${action.tone} shadow-xs`}>
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm text-textPrimary group-hover:text-primary transition-colors leading-tight">
                    {action.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent assigned honey */}
      <section className="mt-12 animate-fade-in-up delay-5">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow text-primary"><Package size={13} /> {t('assignedWool')}</p>
            <h2 className="text-xl font-bold text-textPrimary">{t('assignedWool')}</h2>
          </div>
          <Link to="/artisan/batches" className="text-link">
            <span>{t('viewAssignedWool')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/40 shadow-sm animate-skeleton-pulse flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-xl bg-border/50 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-border/50 rounded w-1/2" />
                    <div className="h-3 bg-border/30 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
            <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3">
              <Package size={28} />
            </span>
            <h3 className="font-bold text-base text-textPrimary">{t('noBatchesAssigned')}</h3>
            <p className="hidden sm:block text-xs sm:text-sm text-textSecondary max-w-sm mt-1">{t('noBatchesAssignedHelp')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {requests.slice(0, 4).map(req => (
              <div
                key={req.id}
                onClick={() => navigate(`/artisan/batches/${req.id}`)}
                className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-card-hover cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primaryLight text-primary font-bold shrink-0">
                    <Package size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-textPrimary truncate">{req.batch_id}</p>
                    <p className="text-xs text-textSecondary font-medium truncate">{req.service_type} • {req.quantity_kg} kg</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-textMuted group-hover:text-primary shrink-0" />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
