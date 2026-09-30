import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Wind, 
  Sparkles, 
  Palette, 
  Layers, 
  Scissors, 
  Paintbrush, 
  TrendingUp, 
  Search,
  ArrowRight,
  Video,
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { setLastSelectedProblem } from '../../services/smartRecommendation.service';
import { useLanguage } from '../../context/LanguageContext';
import { TRAINING_TRANSLATIONS } from '../../services/trainingTranslations.service';

const BASE_PROBLEMS = [
  {
    id: 'damp-honey',
    title: 'High Moisture (>20%)',
    icon: Droplets,
    color: 'bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300',
    activeBg: 'bg-blue-600 text-white',
    possibleCause: 'Harvesting unripened/uncapped honey combs or extracting during high monsoon humidity.',
    recommendedAction: [
      'Only harvest combs where at least 75% of cells are capped with wax by bees.',
      'Pass raw honey through a low-temperature vacuum dehumidifier to bring moisture below 18%.',
      'Store in hermetically sealed food-grade containers away from open air.'
    ],
    keyword: 'Moisture',
    categoryKey: 'storage'
  },
  {
    id: 'mold-smell',
    title: 'Fermentation Risk',
    icon: Wind,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:border-emerald-300',
    activeBg: 'bg-emerald-700 text-white',
    possibleCause: 'High moisture and wild osmophilic yeasts causing bubbling, foam, and sour odor.',
    recommendedAction: [
      'Separate affected batches immediately to prevent cross-contamination.',
      'Gentle warming to 40°C in a water bath can stabilize unfermented honey without destroying enzymes.',
      'Maintain honey storage temperature strictly between 18°C and 22°C.'
    ],
    keyword: 'Storage',
    categoryKey: 'storage'
  },
  {
    id: 'dirty-honey',
    title: 'Comb Wax & Debris',
    icon: Sparkles,
    color: 'bg-amber-50 text-amber-900 border-amber-100 hover:border-amber-300',
    activeBg: 'bg-amber-700 text-white',
    possibleCause: 'Coarse extraction without nylon food-grade strainers, leaving wax cappings and propolis bits.',
    recommendedAction: [
      'Use double-stage stainless steel mesh filters (400 micron and 200 micron).',
      'Allow honey to settle in settling tanks for 48 hours for wax to float to surface before skimming.',
      'Avoid high-pressure pumping which pulverizes wax into micro-particles.'
    ],
    keyword: 'Filtration',
    categoryKey: 'processing'
  },
  {
    id: 'discolored-honey',
    title: 'HMF / Heat Darkening',
    icon: Palette,
    color: 'bg-rose-50 text-rose-800 border-rose-100 hover:border-rose-300',
    activeBg: 'bg-rose-600 text-white',
    possibleCause: 'Direct sunlight exposure or excessive heating (>45°C) converting fructose into HMF.',
    recommendedAction: [
      'Never heat honey above 40°C during liquefaction or bottling.',
      'Store honey drums in cool, shaded, ventilated godowns.',
      'Submit sample to KVIC lab for HMF spectroscopic validation.'
    ],
    keyword: 'Grading',
    categoryKey: 'honey-quality'
  },
  {
    id: 'poor-quality',
    title: 'Varroa Mite in Hive',
    icon: Layers,
    color: 'bg-purple-50 text-purple-800 border-purple-100 hover:border-purple-300',
    activeBg: 'bg-purple-700 text-white',
    possibleCause: 'External parasitic mite (Varroa destructor) attacking bee brood and adult bees.',
    recommendedAction: [
      'Apply KVIC-approved organic formic acid or oxalic acid vapor treatments.',
      'Install screened bottom boards with sticky trays for natural mite drop monitoring.',
      'Maintain strong hygienic Italian bee colonies that exhibit grooming behavior.'
    ],
    keyword: 'Disease',
    categoryKey: 'hive-care'
  },
  {
    id: 'crystallization',
    title: 'Rapid Crystallization',
    icon: Layers,
    color: 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:border-indigo-300',
    activeBg: 'bg-indigo-700 text-white',
    possibleCause: 'High glucose content in Mustard or Brassica nectar naturally precipitating glucose hydrate crystals.',
    recommendedAction: [
      'Educate consumers that crystallization is natural proof of pure raw unheated honey.',
      'For liquid preference, warm gently in indirect water bath at 38-40°C.',
      'Blend with Acacia or Eucalyptus honey to balance F/G ratio above 1.15.'
    ],
    keyword: 'Settling',
    categoryKey: 'processing'
  },
  {
    id: 'extraction-problem',
    title: 'Centrifuge Comb Damage',
    icon: Scissors,
    color: 'bg-sky-50 text-sky-800 border-sky-100 hover:border-sky-300',
    activeBg: 'bg-sky-700 text-white',
    possibleCause: 'Spinning manual or electric honey extractors at excessive speed before combs balance.',
    recommendedAction: [
      'Start centrifugal extraction at low RPM, extract 50% from side A, flip to side B, then finish side A.',
      'Use comb frames reinforced with stainless steel wire.',
      'Ensure ambient extraction temperature is ~25-30°C for optimal honey flow without comb breakage.'
    ],
    keyword: 'Extraction',
    categoryKey: 'extraction'
  },
  {
    id: 'nectar-dearth',
    title: 'Nectar Dearth / Brood Weakness',
    icon: Paintbrush,
    color: 'bg-teal-50 text-teal-800 border-teal-100 hover:border-teal-300',
    activeBg: 'bg-teal-700 text-white',
    possibleCause: 'Monsoon dearth period with no flowering flora leading to bee starvation.',
    recommendedAction: [
      'Provide artificial sugar syrup (1:1 ratio) or pollen patties strictly outside honey flow season.',
      'Migrate bee boxes to seasonal floral belts (Mustard in RJ, Acacia in JK, Lychee in Bihar).',
      'Never harvest emergency honey reserves left for colony survival.'
    ],
    keyword: 'Feeding',
    categoryKey: 'processing'
  },
  {
    id: 'selling-problem',
    title: 'Selling & Mandi Realization',
    icon: TrendingUp,
    color: 'bg-orange-50 text-orange-900 border-orange-100 hover:border-orange-300',
    activeBg: 'bg-orange-600 text-white',
    possibleCause: 'Low local trader bids due to lack of quality certification or middleman control.',
    recommendedAction: [
      'Create direct marketplace listings on HoneyChain to bypass local middlemen.',
      'Attach digital QR batch tags proving verified origin and lab grade.',
      'Check live Mandi price intelligence for fair pricing benchmarks.'
    ],
    keyword: 'Digital Selling',
    categoryKey: 'selling'
  }
];

export default function ApiaryProblemGuide({ resources = [] }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const langProblems = TRAINING_TRANSLATIONS[language]?.problems;

  const problems = BASE_PROBLEMS.map(p => {
    const override = langProblems?.[p.id];
    return {
      ...p,
      title: override?.title || p.title,
      possibleCause: override?.cause || p.possibleCause,
      recommendedAction: override?.actions || p.recommendedAction
    };
  });

  const [selectedProblemId, setSelectedProblemId] = useState(problems[0].id);

  const handleSelectProblem = (id) => {
    setSelectedProblemId(id);
    setLastSelectedProblem(id);
  };

  const selectedProblem = problems.find(p => p.id === selectedProblemId) || problems[0];

  const matchedResource = resources.find(r => 
    r.title.toLowerCase().includes(selectedProblem.keyword.toLowerCase()) ||
    r.category.toLowerCase().includes(selectedProblem.keyword.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(selectedProblem.keyword.toLowerCase()))
  ) || resources[0];

  const hasVideo = matchedResource?.youtubeUrl;

  return (
    <div className="bg-surface rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-border/60">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
          <Search size={13} />
          <span>Diagnostic Helper</span>
        </div>
        <h2 className="text-2xl font-bold text-textPrimary">Identify Honey & Apiary Health Problems</h2>
        <p className="text-sm text-textSecondary mt-1">
          Select an issue affecting your hives or extracted honey lot to view KVIC-certified corrective measures.
        </p>
      </div>

      {/* Grid of Problem Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-8">
        {problems.map(p => {
          const isSelected = p.id === selectedProblemId;
          const IconComponent = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectProblem(p.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all duration-200 ${
                isSelected 
                  ? `${p.activeBg} shadow-md border-transparent ring-2 ring-offset-2 ring-primary/40`
                  : `${p.color} shadow-sm hover:-translate-y-0.5`
              }`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white/60'} backdrop-blur-sm`}>
                <IconComponent size={18} />
              </span>
              <span className="text-xs sm:text-sm font-bold line-clamp-1">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Problem Solution Display */}
      {selectedProblem && (
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm animate-enter">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60 mb-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primaryLight text-primary">
                {React.createElement(selectedProblem.icon, { size: 20 })}
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{t('selectedProblem')}</span>
                <h3 className="text-xl font-extrabold text-textPrimary">{selectedProblem.title}</h3>
              </div>
            </div>

            {matchedResource && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/learn/resource/${matchedResource._id || matchedResource.id}`)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primaryDark transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <BookOpen size={14} />
                  <span>{t('viewTrainingGuide')}</span>
                </button>

                {hasVideo && (
                  <button
                    onClick={() => navigate(`/learn/resource/${matchedResource._id || matchedResource.id}`)}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Video size={14} />
                    <span>{t('watchVideo')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Possible Cause */}
            <div className="p-4 rounded-xl bg-surface border border-border/70">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle size={15} />
                <span>{t('possibleCause')}</span>
              </div>
              <p className="text-sm text-textSecondary leading-relaxed font-medium">
                {selectedProblem.possibleCause}
              </p>
            </div>

            {/* Recommended Action */}
            <div className="p-4 rounded-xl bg-surface border border-border/70">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 size={15} />
                <span>{t('recommendedAction')}</span>
              </div>
              <ul className="space-y-2">
                {selectedProblem.recommendedAction.map((act, i) => (
                  <li key={i} className="text-xs text-textSecondary flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Resource Snippet */}
          {matchedResource && (
            <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/60 p-4 rounded-xl">
              <div>
                <p className="text-[10px] font-bold text-textMuted uppercase">{t('recommendedTrainingResource')}</p>
                <p className="text-sm font-bold text-textPrimary">{matchedResource.title}</p>
                <p className="text-xs text-textSecondary line-clamp-1 mt-0.5">{matchedResource.summary}</p>
              </div>
              <button
                onClick={() => navigate(`/learn/resource/${matchedResource._id || matchedResource.id}`)}
                className="text-xs font-bold text-primary hover:underline shrink-0 flex items-center gap-1"
              >
                <span>{t('viewTrainingGuide')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
