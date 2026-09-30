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
  Award
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
    { label: t('assignedHoney'), value: assignedCount, icon: Package, tone: 'bg-burgundy/10 text-burgundy', route: '/artisan/batches', tag: 'Assigned Lots' },
    { label: t('processing'), value: processingCount, icon: Cog, tone: 'bg-honeyGold/20 text-burgundy', route: '/artisan/processing', tag: 'In Refinement' },
    { label: t('readyCompleted'), value: completedCount, icon: CheckCircle, tone: 'bg-emerald-100 text-emerald-800', route: '/artisan/completed', tag: 'Finished' },
    { label: t('qualityPending'), value: qualityCount, icon: ShieldCheck, tone: 'bg-burntOrange/15 text-burntOrange', route: '/artisan/quality', tag: 'NMR Pending' },
  ];

  const primaryActions = [
    { label: t('viewAssignedHoney'), icon: Package, route: '/artisan/batches', desc: 'Inspect raw comb consignments' },
    { label: t('startProcessingAction'), icon: Cog, route: '/artisan/processing', desc: 'Manage centrifugation & filtration' },
    { label: t('updateProcessingAction'), icon: ShieldCheck, route: '/artisan/quality', desc: 'Submit moisture & assay test logs' },
    { label: t('viewCompletedWork'), icon: CheckCircle, route: '/artisan/completed', desc: 'Archive of sealed consumer lots' },
  ];

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      {/* Welcome Hero */}
      <section className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>KVIC Beekeeping Cooperative & Artisan Guild</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('namaste')}, {profile?.name?.split(' ')[0] || t('artisanFallback')}
          </h1>

          <p className="text-xs text-deepBrown/70 flex items-center gap-1.5 font-medium">
            <MapPin size={14} className="text-burgundy" />
            <span>{profile?.district || 'Kangra'}{profile?.district && profile?.state ? ', ' : ''}{profile?.state || 'Himachal Pradesh'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/artisan/batches')}
            className="btn-burgundy text-xs"
          >
            <Package size={16} />
            <span>{t('viewAssignedHoney')}</span>
          </button>
        </div>
      </section>

      {/* Metric Cards (Bento) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.route)}
              className="bento-card bento-card-hover p-5 flex flex-col justify-between text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`grid h-10 w-10 place-items-center rounded-2xl ${card.tone}`}>
                  <Icon size={20} />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-border text-deepBrown/70">
                  {card.tag}
                </span>
              </div>
              <div>
                <p className="text-xs text-deepBrown/60 font-medium">{card.label}</p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-deepBrown mt-0.5">{card.value}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* Quick Action Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryActions.map(action => (
          <div
            key={action.label}
            onClick={() => navigate(action.route)}
            className="bento-card bento-card-hover p-6 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-warmIvory w-fit border border-border group-hover:bg-burgundy group-hover:text-honeyGold transition-colors text-deepBrown">
                <action.icon size={20} />
              </div>
              <h3 className="font-serif font-bold text-base text-deepBrown group-hover:text-burgundy transition-colors">
                {action.label}
              </h3>
              <p className="text-xs text-deepBrown/60 leading-relaxed">
                {action.desc}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-burgundy group-hover:translate-x-1 transition-transform">
              <span>Open Console</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
