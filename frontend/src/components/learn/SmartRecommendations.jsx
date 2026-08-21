import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Clock, Heart, Scissors, Award, Warehouse, Hammer, TrendingUp, Check } from 'lucide-react';
import { 
  getUserInterests, 
  toggleUserInterest, 
  getSmartRecommendations 
} from '../../services/smartRecommendation.service';
import { getProgress } from '../../services/learningProgress.service';

const AVAILABLE_INTERESTS = [
  { key: 'sheep-care', label: 'Sheep Care', icon: Heart },
  { key: 'shearing', label: 'Shearing', icon: Scissors },
  { key: 'wool-quality', label: 'Wool Quality', icon: Award },
  { key: 'storage', label: 'Storage', icon: Warehouse },
  { key: 'processing', label: 'Processing', icon: Hammer },
  { key: 'selling', label: 'Selling', icon: TrendingUp }
];

export default function SmartRecommendations({ resources = [] }) {
  const navigate = useNavigate();
  const [userInterests, setUserInterests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const refreshRecommendations = () => {
    const interests = getUserInterests();
    setUserInterests(interests);
    const progress = getProgress();
    const recs = getSmartRecommendations(resources, progress);
    setRecommendations(recs);
  };

  useEffect(() => {
    refreshRecommendations();

    const handleUpdate = () => refreshRecommendations();
    window.addEventListener('user_interests_updated', handleUpdate);
    window.addEventListener('user_problem_updated', handleUpdate);
    window.addEventListener('learning_progress_updated', handleUpdate);

    return () => {
      window.removeEventListener('user_interests_updated', handleUpdate);
      window.removeEventListener('user_problem_updated', handleUpdate);
      window.removeEventListener('learning_progress_updated', handleUpdate);
    };
  }, [resources]);

  const handleInterestToggle = (key) => {
    const updated = toggleUserInterest(key);
    setUserInterests(updated);
  };

  if (!resources || resources.length === 0) return null;

  return (
    <div className="bg-surface rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
            <Sparkles size={13} />
            <span>Personalized Learning</span>
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">Recommended for You</h2>
          <p className="text-sm text-textSecondary mt-1">
            Tailored based on your interests, current season, diagnostic problem & learning progress
          </p>
        </div>

        {/* Quick Interest Chips Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase text-textMuted mr-1">Filter Interests:</span>
          {AVAILABLE_INTERESTS.map(item => {
            const isSelected = userInterests.includes(item.key);
            const IconComp = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleInterestToggle(item.key)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-background text-textSecondary border-border hover:border-primary/40 hover:text-textPrimary'
                }`}
              >
                {isSelected ? <Check size={12} /> : <IconComp size={12} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(res => {
          const resId = res._id || res.id;
          return (
            <div
              key={resId}
              onClick={() => navigate(`/learn/resource/${resId}`)}
              className="flex flex-col justify-between p-6 rounded-2xl bg-background border border-border/70 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    res.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                    res.level === 'Intermediate' ? 'bg-amber-50 text-amber-800' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {res.level}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-textMuted font-medium">
                    <Clock size={11} />
                    {res.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {res.title}
                </h3>

                <p className="text-xs text-textSecondary line-clamp-3 leading-relaxed mb-4">
                  {res.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-textMuted">
                  Category: {res.category}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/learn/resource/${resId}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold text-xs group-hover:bg-primaryDark transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>Start Learning</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
