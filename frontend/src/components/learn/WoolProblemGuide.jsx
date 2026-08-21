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
    id: 'damp-wool',
    title: 'Damp / Wet Wool',
    icon: Droplets,
    color: 'bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300',
    activeBg: 'bg-blue-600 text-white',
    possibleCause: 'Shearing in high humidity or storing fleece directly exposed to damp ground/monsoon air.',
    recommendedAction: [
      'Immediately move wool bags into a well-ventilated dry shed on elevated pallets.',
      'Never seal damp fleece in airtight plastic bags; use breathable gunny sacks.',
      'Check regularly for heat generation and mildew development.'
    ],
    keyword: 'Monsoon',
    categoryKey: 'storage'
  },
  {
    id: 'mold-smell',
    title: 'Mold / Bad Smell',
    icon: Wind,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:border-emerald-300',
    activeBg: 'bg-emerald-700 text-white',
    possibleCause: 'High moisture retention (>14% RH) causing bacterial growth and fiber rot.',
    recommendedAction: [
      'Separate affected bags immediately to prevent contamination of healthy stock.',
      'Spread fleece in indirect shaded sunlight to dry and air out.',
      'Maintain warehouse relative humidity strictly below 65%.'
    ],
    keyword: 'Storage',
    categoryKey: 'storage'
  },
  {
    id: 'dirty-wool',
    title: 'Dirty Wool',
    icon: Sparkles,
    color: 'bg-amber-50 text-amber-900 border-amber-100 hover:border-amber-300',
    activeBg: 'bg-amber-700 text-white',
    possibleCause: 'Excessive mud, manure, or sand contamination during grazing/shearing.',
    recommendedAction: [
      'Skirt belly and leg wool immediately post-shearing.',
      'Perform preliminary dry dusting before washing/scouring.',
      'Use warm non-ionic detergent scour at 50-55°C.'
    ],
    keyword: 'Scouring',
    categoryKey: 'processing'
  },
  {
    id: 'discolored-wool',
    title: 'Discolored Wool',
    icon: Palette,
    color: 'bg-rose-50 text-rose-800 border-rose-100 hover:border-rose-300',
    activeBg: 'bg-rose-600 text-white',
    possibleCause: 'Canary stain from bacterial sweat during hot humid months or severe dung staining.',
    recommendedAction: [
      'Sort discolored fleece into separate Grade C bales so main main fleece stays Grade A.',
      'Avoid high-temperature alkaline washing which sets yellow stains.',
      'Ensure proper flock shade during peak summer months.'
    ],
    keyword: 'Grading',
    categoryKey: 'wool-quality'
  },
  {
    id: 'poor-quality',
    title: 'Poor Wool Quality',
    icon: Layers,
    color: 'bg-purple-50 text-purple-800 border-purple-100 hover:border-purple-300',
    activeBg: 'bg-purple-700 text-white',
    possibleCause: 'Nutritional deficit, parasite infestation, or irregular micron variance across fleece.',
    recommendedAction: [
      'Provide mineral blocks and legume supplements to encourage staple crimp.',
      'Implement bi-annual deworming pre- and post-monsoon.',
      'Grade wool according to Central Wool Board micron parameters.'
    ],
    keyword: 'Disease',
    categoryKey: 'sheep-care'
  },
  {
    id: 'matted-wool',
    title: 'Matted / Felted Wool',
    icon: Layers,
    color: 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:border-indigo-300',
    activeBg: 'bg-indigo-700 text-white',
    possibleCause: 'Excessive friction and moisture during storage or burr entanglement.',
    recommendedAction: [
      'Pass fleece through carding rollers to untangle fibers into uniform slivers.',
      'Remove vegetable matter (burrs/seeds) before mechanical processing.',
      'Avoid rough agitation during washing.'
    ],
    keyword: 'Carding',
    categoryKey: 'processing'
  },
  {
    id: 'shearing-problem',
    title: 'Shearing Problem',
    icon: Scissors,
    color: 'bg-sky-50 text-sky-800 border-sky-100 hover:border-sky-300',
    activeBg: 'bg-sky-700 text-white',
    possibleCause: 'Frequent second-cuts, skin cuts, or irregular stroke angle by clipper.',
    recommendedAction: [
      'Maintain continuous flat blade contact with sheep skin.',
      'Keep clippers sharp and oiled during shearing sessions.',
      'Withhold feed 12 hours before shearing to keep animals calm.'
    ],
    keyword: 'Shearing',
    categoryKey: 'shearing'
  },
  {
    id: 'dyeing-problem',
    title: 'Dyeing Problem',
    icon: Paintbrush,
    color: 'bg-teal-50 text-teal-800 border-teal-100 hover:border-teal-300',
    activeBg: 'bg-teal-700 text-white',
    possibleCause: 'Uneven dye uptake caused by residual grease or lack of mordanting agent.',
    recommendedAction: [
      'Ensure complete scouring to remove all residual lanolin before dyeing.',
      'Use potassium alum (10% weight of fleece) as a mordant.',
      'Stir gently and maintain consistent dye bath temperatures.'
    ],
    keyword: 'Dyeing',
    categoryKey: 'processing'
  },
  {
    id: 'selling-problem',
    title: 'Selling Problem',
    icon: TrendingUp,
    color: 'bg-orange-50 text-orange-900 border-orange-100 hover:border-orange-300',
    activeBg: 'bg-orange-600 text-white',
    possibleCause: 'Low local trader bids due to lack of quality certification or middleman control.',
    recommendedAction: [
      'Create direct marketplace listings on WoolConnect to bypass local traders.',
      'Attach digital QR batch tags proving verified origin and lab grade.',
      'Check live Mandi price intelligence for fair pricing benchmarks.'
    ],
    keyword: 'Digital Selling',
    categoryKey: 'selling'
  }
];

export default function WoolProblemGuide({ resources = [] }) {
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

  // Match existing training resource based on keyword/category
  const matchedResource = resources.find(r => 
    r.title.toLowerCase().includes(selectedProblem.keyword.toLowerCase()) ||
    r.category.toLowerCase().includes(selectedProblem.keyword.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(selectedProblem.keyword.toLowerCase()))
  ) || resources[0];

  // Check if resource has youtube video
  const hasVideo = matchedResource?.youtubeUrl;

  return (
    <div className="bg-surface rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-border/60">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
          <Search size={13} />
          <span>{t('diagnosticHelper')}</span>
        </div>
        <h2 className="text-2xl font-bold text-textPrimary">{t('identifyWoolProblem')}</h2>
        <p className="text-sm text-textSecondary mt-1">
          {t('selectIssueDesc')}
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
