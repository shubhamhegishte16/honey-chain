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
  Sparkles
} from 'lucide-react';
import { getTrainingResources } from '../../services/training.service';

const CATEGORIES = [
  {
    key: 'sheep-care',
    title: 'Sheep Care',
    desc: 'Best practices for flock health, feeding, and disease prevention.',
    icon: Heart,
    color: 'bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300'
  },
  {
    key: 'shearing',
    title: 'Shearing',
    desc: 'Modern techniques for clean, stress-free fleece removal.',
    icon: Scissors,
    color: 'bg-amber-50 text-amber-800 border-amber-100 hover:border-amber-300'
  },
  {
    key: 'wool-quality',
    title: 'Wool Quality',
    desc: 'Understanding micron grades, skirting, and grading standards.',
    icon: Award,
    color: 'bg-sky-50 text-sky-700 border-sky-100 hover:border-sky-300'
  },
  {
    key: 'storage',
    title: 'Storage',
    desc: 'Protecting wool inventory from humidity, pests, and moisture.',
    icon: Warehouse,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300'
  },
  {
    key: 'processing',
    title: 'Processing',
    desc: 'Scouring, carding, and dyeing methods to add premium value.',
    icon: Hammer,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300'
  },
  {
    key: 'selling',
    title: 'Selling',
    desc: 'Maximizing returns using direct marketplace listings and QR codes.',
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300'
  }
];

export default function LearnLanding() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResourceCounts() {
      try {
        const { data, error } = await getTrainingResources();
        if (!error && data) {
          // Count resources per category
          const categoryCounts = {
            'sheep-care': 0,
            'shearing': 0,
            'wool-quality': 0,
            'storage': 0,
            'processing': 0,
            'selling': 0
          };
          
          // Map DB category to UI category key for counting
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
        }
      } catch (err) {
        console.error('Error counting resources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResourceCounts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/learn/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="page-shell">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-8 sm:p-12 shadow-xl animate-enter">
        <div className="hero-orb orb-one opacity-20" />
        <div className="hero-orb orb-two opacity-15" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-4">
            <BookOpen size={13} />
            <span>Knowledge & Training Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Learn & Grow.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
            Boost your flock yield, enhance wool grading, and maximize your profits with guidance from agricultural and textile experts.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-8 relative max-w-md">
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
      </section>

      {/* Categories Grid */}
      <section className="mt-12 animate-enter delay-1">
        <div className="section-heading mb-6">
          <div>
            <p className="eyebrow text-primary"><Sparkles size={13} /> Training Modules</p>
            <h2 className="text-2xl font-bold text-textPrimary">Select a Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
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
    </main>
  );
}
