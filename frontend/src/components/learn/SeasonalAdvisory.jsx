import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Scissors, Hammer, TrendingUp, Calendar, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { TRAINING_TRANSLATIONS } from '../../services/trainingTranslations.service';

const BASE_SEASONS = [
  {
    key: 'monsoon',
    title: 'Monsoon Care',
    monthsLabel: 'June – September',
    months: [5, 6, 7, 8], // 0-indexed: June-Sept
    icon: CloudRain,
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    headerBg: 'from-sky-900 via-blue-900 to-indigo-950',
    recommendedActions: [
      'Prevent moisture contamination in stored raw honey barrels',
      'Provide supplementary pollen substitute feed during heavy monsoon downpours',
      'Inspect bee boxes weekly for fungal growth, wax moth, and dampness',
      'Keep apiary boxes elevated 30+ cm above wet ground with ant barriers',
      'Avoid harvesting uncapped honey frames during high relative humidity days'
    ],
    targetKeyword: 'Monsoon'
  },
  {
    key: 'harvesting',
    title: 'Extraction & Harvest',
    monthsLabel: 'October – January',
    months: [9, 10, 11, 0], // Oct-Jan
    icon: Scissors,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    headerBg: 'from-amber-900 via-yellow-900 to-orange-950',
    recommendedActions: [
      'Harvest only fully capped comb frames (>80% sealed) for minimum moisture',
      'Use food-grade SS304 centrifugal extractors without heating combs',
      'Store raw honey in airtight food-grade barrels with moisture seals',
      'Record harvest batch details and generate HoneyChain digital QR tokens',
      'Monitor hive health post-extraction and leave adequate winter honey reserves'
    ],
    targetKeyword: 'Extraction'
  },
  {
    key: 'processing',
    title: 'Filtration & Direct Sale',
    monthsLabel: 'February – May',
    months: [1, 2, 3, 4], // Feb-May
    icon: TrendingUp,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    headerBg: 'from-emerald-900 via-teal-900 to-green-950',
    recommendedActions: [
      'Perform micro-filtration (80-100 mesh) to remove wax and bee debris',
      'Test moisture content with digital refractometer (<20% FSSAI compliance)',
      'List certified batches directly on HoneyChain digital marketplace',
      'Compare National Honey Mandi APMC rates before agreeing to buyer quotes',
      'Bottle single-origin floral batches into tamper-evident glass jars'
    ],
    targetKeyword: 'Processing'
  }
];

export default function SeasonalAdvisory({ resources = [] }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const langSeasons = TRAINING_TRANSLATIONS[language]?.seasons;

  const seasons = BASE_SEASONS.map(s => {
    const override = langSeasons?.[s.key];
    return {
      ...s,
      title: override?.title || s.title,
      monthsLabel: override?.monthsLabel || s.monthsLabel,
      recommendedActions: override?.actions || s.recommendedActions
    };
  });

  // Auto-select season based on current month
  const getCurrentSeasonKey = () => {
    const currentMonth = new Date().getMonth();
    const matched = seasons.find(s => s.months.includes(currentMonth));
    return matched ? matched.key : 'monsoon';
  };

  const [selectedSeasonKey, setSelectedSeasonKey] = useState(getCurrentSeasonKey());
  const activeSeason = seasons.find(s => s.key === selectedSeasonKey) || seasons[0];

  // Find matching guide resource
  const matchedResource = resources.find(r => 
    r.title.toLowerCase().includes(activeSeason.targetKeyword.toLowerCase()) ||
    r.category.toLowerCase().includes(activeSeason.targetKeyword.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(activeSeason.targetKeyword.toLowerCase()))
  ) || resources[0];

  return (
    <div className="bg-surface rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
            <Calendar size={13} />
            <span>{t('seasonalAdvisoryTitle')}</span>
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">{t('recommendedForThisSeason')}</h2>
          <p className="text-sm text-textSecondary mt-1">
            {t('seasonalFocusDesc')}
          </p>
        </div>

        {/* Season Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-background border border-border/80 self-start sm:self-auto overflow-x-auto max-w-full">
          {seasons.map(s => {
            const isSelected = s.key === selectedSeasonKey;
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setSelectedSeasonKey(s.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected 
                    ? 'bg-surface text-primary shadow-sm border border-border' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-surface/50'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-primary' : 'text-textMuted'} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Season Banner & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Season Highlight Card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${activeSeason.headerBg} text-white p-6 flex flex-col justify-between shadow-md`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeSeason.badgeColor}`}>
                {t('currentSeason')}
              </span>
              <span className="text-xs text-white/80 font-medium">
                {activeSeason.monthsLabel}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold flex items-center gap-2 mb-2">
              {React.createElement(activeSeason.icon, { size: 28, className: "text-emerald-300" })}
              {activeSeason.title}
            </h3>
            <p className="text-xs text-white/80 leading-relaxed mt-2">
              {t('seasonalFocusDesc')}
            </p>
          </div>

          {matchedResource && (
            <div className="mt-8 pt-4 border-t border-white/15">
              <p className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mb-1">
                {t('featuredGuide')}
              </p>
              <p className="text-xs font-bold text-white line-clamp-1 mb-3">
                {matchedResource.title}
              </p>
              <button
                onClick={() => navigate(`/learn/resource/${matchedResource._id || matchedResource.id}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>{t('learnGuide')}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Recommended Action Items */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-background/50 rounded-2xl p-6 border border-border/60">
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-textMuted mb-4">
              {t('recommendedActionItems')}
            </h4>
            <ul className="space-y-3">
              {activeSeason.recommendedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-textPrimary leading-relaxed">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {matchedResource && (
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-textMuted">
                {t('readFullProtocols')}
              </span>
              <button
                onClick={() => navigate(`/learn/resource/${matchedResource._id || matchedResource.id}`)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primaryDark transition-colors"
              >
                <span>{t('readDetailedGuide')}</span>
                <ExternalLink size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
