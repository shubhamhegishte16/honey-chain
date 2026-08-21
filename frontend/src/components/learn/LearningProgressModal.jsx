import React from 'react';
import { X, Trophy, CheckCircle2, BookOpen, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { TRAINING_TRANSLATIONS } from '../../services/trainingTranslations.service';

export default function LearningProgressModal({ isOpen, onClose, stats }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const { overallPercentage = 0, completedCount = 0, totalCount = 0, categoryBreakdown = [] } = stats || {};
  const langCategories = TRAINING_TRANSLATIONS[language]?.categories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-border shadow-card-lg p-6 sm:p-8 animate-enter">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-background hover:bg-border/60 text-textSecondary transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Trophy size={24} />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary">{t('myLearningProgress')}</h2>
            <p className="text-xs text-textSecondary">{t('trackLearningProgress')}</p>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1c3e27] to-[#3f6b3f] text-white shadow-md mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">{t('overallProgress')}</span>
              <p className="text-3xl font-extrabold">{overallPercentage}%</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/80 font-medium">{t('completed')}</span>
              <p className="text-lg font-bold text-emerald-300">{completedCount} / {totalCount} {t('completedResources')}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-white/20 p-0.5">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted border-b border-border/60 pb-2">
            {t('categoriesBreakdown')}
          </h3>

          {categoryBreakdown.map((cat) => {
            const catLabel = langCategories?.[cat.key]?.title || cat.label;
            return (
              <div
                key={cat.key}
                onClick={() => {
                  onClose();
                  navigate(`/learn/category/${cat.key}`);
                }}
                className="p-3.5 rounded-xl border border-border/70 bg-background hover:bg-surface transition-all cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-textPrimary mb-1.5">
                    <span className="group-hover:text-primary transition-colors">{catLabel}</span>
                    <span className={cat.percentage === 100 ? 'text-emerald-600 flex items-center gap-1' : 'text-textSecondary'}>
                      {cat.percentage === 100 && <CheckCircle2 size={13} />}
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.percentage === 100 ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>

                <ArrowRight size={15} className="text-textMuted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primaryDark transition-colors shadow-sm"
          >
            {t('continueLearning')}
          </button>
        </div>
      </div>
    </div>
  );
}
