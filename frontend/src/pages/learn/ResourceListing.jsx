import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, Search, Sparkles, Filter } from 'lucide-react';
import { getTrainingResources, CATEGORY_LABELS } from '../../services/training.service';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../context/LanguageContext';

export default function ResourceListing() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [levelFilter, setLevelFilter] = useState('');

  const isAll = categoryName === 'all';
  const categoryLabel = isAll ? t('allResourcesLabel') : (CATEGORY_LABELS[categoryName] || t('resourcesFallback'));

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          category: isAll ? undefined : categoryName,
          level: levelFilter || undefined,
          search: searchTerm || undefined
        };
        const { data, error } = await getTrainingResources(params);
        if (error) {
          setError(t('failedLoadResources'));
        } else {
          setResources(data || []);
        }
      } catch (err) {
        setError(t('unexpectedError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [categoryName, levelFilter, searchTerm, isAll]);

  // Sync state search term with query param search term if it changes
  useEffect(() => {
    if (querySearch !== searchTerm) {
      setSearchTerm(querySearch);
    }
  }, [querySearch]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setSearchParams(val ? { search: val } : {});
  };

  return (
    <main className="page-shell animate-enter">
      {/* Back button */}
      <button
        onClick={() => navigate('/learn')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-textSecondary hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>{t('backToLearn')}</span>
      </button>

      {/* Header */}
      <div className="section-heading mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-primary flex items-center gap-1">
            <BookOpen size={12} /> {categoryLabel}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight">
            {isAll ? t('searchAllTraining') : `${categoryLabel} ${t('guidesSuffix')}`}
          </h1>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-surface p-4 rounded-2xl border border-border/80 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('searchInCategory')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background text-textPrimary placeholder:text-textMuted text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 text-textMuted" size={15} />
        </div>

        {/* Level Filter */}
        <div className="relative min-w-[180px] flex items-center gap-2">
          <Filter size={15} className="text-textMuted shrink-0" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all appearance-none cursor-pointer"
          >
            <option value="">{t('allLevelsOption')}</option>
            <option value="Beginner">{t('levelBeginner')}</option>
            <option value="Intermediate">{t('levelIntermediate')}</option>
            <option value="Advanced">{t('levelAdvanced')}</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-textSecondary mt-3 font-semibold">{t('loadingGuides')}</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl border border-rose-100 bg-rose-50/50">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            {t('retry2')}
          </button>
        </div>
      ) : resources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3">
            <BookOpen size={28} />
          </span>
          <h3 className="font-bold text-base text-textPrimary">{t('noResourcesFoundTitle')}</h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-5">
            {t('noResourcesFoundDesc')}
          </p>
          {(searchTerm || levelFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setLevelFilter(''); setSearchParams({}); }}
              className="px-4 py-2 bg-primary hover:bg-primaryDark text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              interactive={true}
              onClick={() => navigate(`/learn/resource/${resource.id}`)}
              className="flex flex-col justify-between p-6 cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover transition-all group"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    resource.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                    resource.level === 'Intermediate' ? 'bg-amber-50 text-amber-800' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {resource.level}
                  </span>
                  
                  <span className="flex items-center gap-1 text-[11px] text-textMuted font-medium">
                    <Clock size={11} />
                    {resource.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-textPrimary group-hover:text-primary transition-colors leading-tight mb-2">
                  {resource.title}
                </h3>
                <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                  {t('categoryColonLabel')}: {resource.category}
                </p>
                <p className="text-sm text-textSecondary leading-relaxed">
                  {resource.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between w-full border-t border-border/40 pt-4">
                <span className="text-xs text-textMuted font-medium">
                  {resource.views || 0} {t('viewsSuffix')}
                </span>
                <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>{t('readGuide2')}</span>
                  <ArrowLeft className="rotate-180" size={14} />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
