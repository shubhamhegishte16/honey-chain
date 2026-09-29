import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
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
  Users,
  Feather
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
  'sheep-care': { label: 'Bee Colony Care', dbCategories: ['Colony Health', 'Hive Inspection'] },
  'shearing': { label: 'Honey Harvesting', dbCategories: ['Extraction Techniques', 'Comb Management'] },
  'wool-quality': { label: 'Honey Purity Standards', dbCategories: ['Moisture Testing', 'NMR Quality'] },
  'storage': { label: 'Storage & Conditioning', dbCategories: ['Honey Barrel Storage', 'Humidity Control'] },
  'processing': { label: 'Filtration & Bottling', dbCategories: ['Micro-Filtration', 'Packaging'] },
  'selling': { label: 'Honey Mandi & Direct Trade', dbCategories: ['Marketing', 'Digital Selling'] },
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
      title: 'Apiary & Hive Management',
      desc: 'Colony nutrition, seasonal queen rearing, and mite prevention.',
      icon: Heart,
    },
    {
      key: 'shearing',
      title: 'Honey Harvesting Methods',
      desc: 'Comb uncapping, centrifugal spin, and sustainable harvest cycles.',
      icon: Feather,
    },
    {
      key: 'wool-quality',
      title: 'Purity & NMR Standards',
      desc: 'FSSAI moisture thresholds, HMF parameters, and pollen analysis.',
      icon: Award,
    },
    {
      key: 'storage',
      title: 'Barrel Conditioning',
      desc: 'Food-grade stainless steel storage and ambient temperature controls.',
      icon: Warehouse,
    },
    {
      key: 'processing',
      title: 'Filtration & Bottling',
      desc: 'Micro-filtration protocols, glass sterilization, and tamper-proof seals.',
      icon: Hammer,
    },
    {
      key: 'selling',
      title: 'Mandi Trading & Escrow',
      desc: 'Direct-to-brand contract negotiation and APMC market intelligence.',
      icon: TrendingUp,
    }
  ];

  const loadResourcesAndStats = async () => {
    try {
      const { data, error } = await getTrainingResources();
      if (!error && data) {
        setRawResources(data);

        const categoryCounts = {
          'sheep-care': 0,
          'shearing': 0,
          'wool-quality': 0,
          'storage': 0,
          'processing': 0,
          'selling': 0,
        };

        data.forEach(item => {
          const cat = item.category?.toLowerCase() || '';
          if (cat.includes('care') || cat.includes('health') || cat.includes('feed')) categoryCounts['sheep-care']++;
          else if (cat.includes('shear') || cat.includes('harvest')) categoryCounts['shearing']++;
          else if (cat.includes('qual') || cat.includes('grad') || cat.includes('purity')) categoryCounts['wool-quality']++;
          else if (cat.includes('stor') || cat.includes('ware')) categoryCounts['storage']++;
          else if (cat.includes('proc') || cat.includes('spin') || cat.includes('filter')) categoryCounts['processing']++;
          else if (cat.includes('sell') || cat.includes('mark') || cat.includes('trade')) categoryCounts['selling']++;
        });

        setCounts(categoryCounts);
        const stats = calculateProgressStats(data, CATEGORY_MAP_FOR_STATS);
        setProgressStats(stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResourcesAndStats();
  }, [language]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/learn/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans space-y-8">
      {/* Editorial Hero Banner */}
      <section className="bento-card p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>KVIC Honey Mission Academy</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-deepBrown leading-tight">
            Scientific Beekeeping & <br />
            <span className="text-burgundy">Honey Traceability Academy</span>
          </h1>

          <p className="text-xs sm:text-sm text-deepBrown/75 leading-relaxed">
            Curated field manuals, seasonal apiary advisories, and BIS testing guides designed for beekeeping self-help groups and commercial refiners.
          </p>

          <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-deepBrown/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides (e.g., moisture testing, comb extraction)..."
                className="w-full pl-10 pr-4 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium shadow-xs"
              />
            </div>
            <button type="submit" className="btn-burgundy text-xs py-2.5 px-4 shrink-0">
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-3 shrink-0 relative z-10">
          <div className="p-4 rounded-3xl bg-honeyGold/10 border border-honeyGold/30 text-center space-y-2">
            <Trophy size={28} className="mx-auto text-burgundy" />
            <p className="text-xs font-bold text-deepBrown">Learning Progress</p>
            <p className="text-2xl font-serif font-bold text-burgundy">{progressStats.overallPercentage}%</p>
            <button
              onClick={() => setIsProgressOpen(true)}
              className="text-[11px] font-bold text-burgundy hover:underline block"
            >
              View Certificate Progress →
            </button>
          </div>
        </div>
      </section>

      {/* 6 Category Bento Cards */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-deepBrown">
          Curated Knowledge Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                onClick={() => navigate(`/learn/category/${cat.key}`)}
                className="bento-card bento-card-hover p-6 cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-honeyGold transition-colors">
                      <Icon size={20} />
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-honeyGold/20 text-deepBrown">
                      {counts[cat.key] || 4} Guides
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-deepBrown group-hover:text-burgundy transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-deepBrown/70 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-burgundy group-hover:translate-x-1 transition-transform border-t border-border/60">
                  <span>Explore Guides</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Advisory & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeasonalAdvisory />
        <SmartRecommendations />
      </div>

      <WoolProblemGuide />

      {isProgressOpen && (
        <LearningProgressModal
          isOpen={isProgressOpen}
          onClose={() => setIsProgressOpen(false)}
          stats={progressStats}
        />
      )}
    </main>
  );
}