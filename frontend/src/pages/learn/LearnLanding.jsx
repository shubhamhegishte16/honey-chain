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
  CheckCircle2
} from 'lucide-react';
import { getTrainingResources } from '../../services/training.service';
import SeasonalAdvisory from '../../components/learn/SeasonalAdvisory';
import WoolProblemGuide from '../../components/learn/WoolProblemGuide';
import SmartRecommendations from '../../components/learn/SmartRecommendations';
import LearningProgressModal from '../../components/learn/LearningProgressModal';
import { calculateProgressStats } from '../../services/learningProgress.service';

const CATEGORIES = [
  {
    key: 'sheep-care',
    title: 'Sheep Care',
    desc: 'Best practices for flock health, feeding, and disease prevention.',
    icon: Heart,
    color: 'bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300',
    dbCategories: ['Sheep Management']
  },
  {
    key: 'shearing',
    title: 'Shearing',
    desc: 'Modern techniques for clean, stress-free fleece removal.',
    icon: Scissors,
    color: 'bg-amber-50 text-amber-800 border-amber-100 hover:border-amber-300',
    dbCategories: ['Wool Shearing']
  },
  {
    key: 'wool-quality',
    title: 'Wool Quality',
    desc: 'Understanding micron grades, skirting, and grading standards.',
    icon: Award,
    color: 'bg-sky-50 text-sky-700 border-sky-100 hover:border-sky-300',
    dbCategories: ['Wool Handling', 'Wool Grading']
  },
  {
    key: 'storage',
    title: 'Storage',
    desc: 'Protecting wool inventory from humidity, pests, and moisture.',
    icon: Warehouse,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300',
    dbCategories: ['Wool Storage']
  },
  {
    key: 'processing',
    title: 'Processing',
    desc: 'Scouring, carding, and dyeing methods to add premium value.',
    icon: Hammer,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300',
    dbCategories: ['Wool Processing', 'Dyeing', 'Product Development']
  },
  {
    key: 'selling',
    title: 'Selling',
    desc: 'Maximizing returns using direct marketplace listings and QR codes.',
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300',
    dbCategories: ['Marketing', 'Digital Selling']
  }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({});
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressStats, setProgressStats] = useState({ overallPercentage: 0, completedCount: 0, totalCount: 0, categoryBreakdown: [] });

  const loadResourcesAndStats = async () => {
    try {
      const { data, error } = await getTrainingResources();
      if (!error && data) {
        setAllResources(data);

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
              <span>Knowledge & Training Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Learn & Grow.
            </h1>
            <p className="mt-3 text-base text-white/80 leading-relaxed">
              Boost your flock yield, enhance wool grading, and maximize profits with guidance from agricultural and textile experts.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mt-6 relative max-w-md">
              <input
                type="text"
                placeholder="Search guides, standards, or shearing protocols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-textPrimary placeholder:text-textMuted text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all border border-transparent"
              />
              <Search className="absolute left-4 top-3.5 text-textMuted" size={17} />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primaryDark transition-colors shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Learning Progress Card in Hero */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl md:w-72 shrink-0 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                  <Trophy size={14} /> My Learning
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
                Completed <strong className="text-white font-bold">{progressStats.completedCount}</strong> of {progressStats.totalCount} resources
              </p>
            </div>

            <button
              onClick={() => setIsProgressOpen(true)}
              className="mt-4 w-full py-2 rounded-xl bg-white text-primary font-extrabold text-xs hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <BarChart2 size={14} />
              <span>Track Progress</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. Smart Recommendations Section */}
      <section className="animate-enter delay-1">
        <SmartRecommendations resources={allResources} />
      </section>

      {/* 2. Seasonal Farmer Advisory Section */}
      <section className="animate-enter delay-2">
        <SeasonalAdvisory resources={allResources} />
      </section>

      {/* 3. Wool Problem Identification Guide Section */}
      <section className="animate-enter delay-3">
        <WoolProblemGuide resources={allResources} />
      </section>

      {/* 4. Training Categories Grid */}
      <section className="animate-enter delay-4">
        <div className="section-heading mb-6">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={13} /> Training Modules</p>
            <h2 className="text-2xl font-bold text-textPrimary">Select a Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
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
                    {loading ? 'Loading...' : `${resourceCount} ${resourceCount === 1 ? 'Resource' : 'Resources'}`}
                  </span>
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            );
          })}
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

