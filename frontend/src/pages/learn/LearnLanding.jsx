import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Scissors, 
  Award, 
  Warehouse, 
  Hammer, 
  TrendingUp, 
  Heart, 
  Search, 
  ArrowRight,
  Sparkles,
  Trophy,
  BarChart2,
  CheckCircle2,
  Users
} from 'lucide-react';
import { getTrainingResources } from '../../services/training.service';
import SeasonalAdvisory from '../../components/learn/SeasonalAdvisory';
import WoolProblemGuide from '../../components/learn/WoolProblemGuide';
import SmartRecommendations from '../../components/learn/SmartRecommendations';
import LearningProgressModal from '../../components/learn/LearningProgressModal';
import { calculateProgressStats } from '../../services/learningProgress.service';
import { useLanguage } from '../../context/LanguageContext';
import { TRAINING_TRANSLATIONS, getTranslatedResource } from '../../services/trainingTranslations.service';

const CATEGORY_MAP_FOR_STATS = {
  'sheep-care': { label: 'Sheep Care', dbCategories: ['Sheep Management'] },
  'shearing': { label: 'Shearing', dbCategories: ['Wool Shearing'] },
  'wool-quality': { label: 'Wool Quality', dbCategories: ['Wool Handling', 'Wool Grading'] },
  'storage': { label: 'Storage', dbCategories: ['Wool Storage'] },
  'processing': { label: 'Processing', dbCategories: ['Wool Processing', 'Dyeing', 'Product Development'] },
  'selling': { label: 'Selling', dbCategories: ['Marketing', 'Digital Selling'] },
};

export default function LearnLanding() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({});
  const [rawResources, setRawResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressStats, setProgressStats] = useState({ overallPercentage: 0, completedCount: 0, totalCount: 0, categoryBreakdown: [] });

  const categories = [
    {
      key: 'sheep-care',
      title: t('catSheepCare'),
      desc: t('descSheepCare'),
      icon: Heart,
      color: 'bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300',
    },
    {
      key: 'shearing',
      title: t('catShearing'),
      desc: t('descShearing'),
      icon: Scissors,
      color: 'bg-amber-50 text-amber-800 border-amber-100 hover:border-amber-300',
    },
    {
      key: 'wool-quality',
      title: t('catWoolQuality'),
      desc: t('descWoolQuality'),
      icon: Award,
      color: 'bg-sky-50 text-sky-700 border-sky-100 hover:border-sky-300',
    },
    {
      key: 'storage',
      title: t('catStorage'),
      desc: t('descStorage'),
      icon: Warehouse,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300',
    },
    {
      key: 'processing',
      title: t('catProcessing'),
      desc: t('descProcessing'),
      icon: Hammer,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300',
    },
    {
      key: 'selling',
      title: t('catSelling'),
      desc: t('descSelling'),
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300',
    }
  ];

  const loadResourcesAndStats = async () => {
    try {
      const { data, error } = await getTrainingResources();
      if (!error && data) {
        setRawResources(data);

        // Count resources per category
        const categoryCounts = {
          'sheep-care': 0,
          'shearing': 0,
          'wool-quality': 0,
          'storage': 0,
          'processing': 0,
          'selling': 0
        };
        
        data.forEach(item => {
          const cat = item.category;
          if (cat === 'Sheep Management') categoryCounts['sheep-care']++;
          else if (cat === 'Wool Shearing') categoryCounts['shearing']++;
          else if (['Wool Handling', 'Wool Grading'].includes(cat)) categoryCounts['wool-quality']++;
          else if (cat === 'Wool Storage') categoryCounts['storage']++;
          else if (['Wool Processing', 'Dyeing', 'Product Development'].includes(cat)) categoryCounts['processing']++;
          else if (['Marketing', 'Digital Selling'].includes(cat)) categoryCounts['selling']++;
        });
        
        setCounts(categoryCounts);

        // Calculate progress stats
        const stats = calculateProgressStats(data, CATEGORY_MAP_FOR_STATS);
        setProgressStats(stats);
      }
    } catch (err) {
      console.error('Error loading training resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResourcesAndStats();

    const handleProgressUpdate = () => {
      loadResourcesAndStats();
    };

    window.addEventListener('learning_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('learning_progress_updated', handleProgressUpdate);
  }, []);

  // Translated resources array
  const resources = rawResources.map(r => getTranslatedResource(r, language));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/learn/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="page-shell space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-8 sm:p-12 shadow-xl animate-enter">
        <div className="hero-orb orb-one opacity-20" />
        <div className="hero-orb orb-two opacity-15" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-4">
              <BookOpen size={13} />
              <span>{t('knowledgeTrainingCenter')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t('learnAndGrow')}
            </h1>
            <p className="mt-3 text-base text-white/80 leading-relaxed">
              {t('boostFlockYield')}
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mt-6 relative max-w-md">
              <input
                type="text"
                placeholder={t('searchGuidesStandards')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-textPrimary placeholder:text-textMuted text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all border border-transparent"
              />
              <Search className="absolute left-4 top-3.5 text-textMuted" size={17} />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primaryDark transition-colors shadow-sm"
              >
                {t('search')}
              </button>
            </form>
          </div>

          {/* Quick Learning Progress Card in Hero */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl md:w-72 shrink-0 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                  <Trophy size={14} /> {t('myLearningProgress')}
                </span>
                <span className="text-xs font-extrabold text-white">
                  {progressStats.overallPercentage}%
                </span>
              </div>

              <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden mb-3">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressStats.overallPercentage}%` }}
                />
              </div>

              <p className="text-xs text-white/80">
                {t('completed')} <strong className="text-white font-bold">{progressStats.completedCount}</strong> / {progressStats.totalCount} {t('completedResources')}
              </p>
            </div>

            <button
              onClick={() => setIsProgressOpen(true)}
              className="mt-4 w-full py-2 rounded-xl bg-white text-primary font-extrabold text-xs hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <BarChart2 size={14} />
              <span>{t('trackProgressBtn')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. Smart Recommendations Section */}
      <section className="animate-enter delay-1">
        <SmartRecommendations resources={resources} />
      </section>

      {/* 2. Seasonal Farmer Advisory Section */}
      <section className="animate-enter delay-2">
        <SeasonalAdvisory resources={resources} />
      </section>

      {/* 3. Wool Problem Identification Guide Section */}
      <section className="animate-enter delay-3">
        <WoolProblemGuide resources={resources} />
      </section>

      {/* 4. Training Categories Grid */}
      <section className="animate-enter delay-4">
        <div className="section-heading mb-6">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={13} /> {t('trainingModules')}</p>
            <h2 className="text-2xl font-bold text-textPrimary">{t('selectCategory')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const resourceCount = counts[cat.key] ?? 0;

            return (
              <button
                key={cat.key}
                onClick={() => navigate(`/learn/category/${cat.key}`)}
                className={`flex flex-col justify-between p-6 rounded-2xl bg-surface border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover text-left group`}
              >
                <div>
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${cat.color} border shadow-sm mb-4`}>
                    <IconComponent size={22} />
                  </span>
                  <h3 className="text-lg font-bold text-textPrimary group-hover:text-primary transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-textSecondary leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between w-full border-t border-border/60 pt-4">
                  <span className="text-xs text-textMuted font-medium">
                    {loading ? t('loading') : `${resourceCount} ${t('completedResources')}`}
                  </span>
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>{t('startLearning')}</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Producers & Artisans Section */}
      <section className="animate-enter delay-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#2d3a6b]/10 via-[#3b4d8a]/8 to-[#4a5faa]/10 border border-blue-200/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700 shadow-sm">
              <Users size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-textPrimary mb-1">Producers & Artisans</h3>
              <p className="text-sm text-textSecondary leading-relaxed max-w-md">
                Explore wool producers and artisans by state and region and discover useful training resources.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/learn/producers')}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#3b4d8a] text-white font-bold text-sm shadow-md hover:bg-[#2d3a6b] transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
          >
            <span>Explore Producers & Artisans</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Learning Progress Modal */}
      <LearningProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        stats={progressStats}
      />
    </main>
  );
}

