import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, Eye, User, Tag, CheckCircle } from 'lucide-react';
import { getTrainingResourceById } from '../../services/training.service';
import Card from '../../components/ui/Card';

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadResource() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await getTrainingResourceById(id);
        if (error) {
          setError('Failed to fetch the resource details.');
        } else {
          setResource(data);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [id]);

  const renderContent = (text = '') => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-base sm:text-lg font-bold text-textPrimary mt-6 mb-2.5">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-textPrimary mt-8 mb-3 border-b border-border/60 pb-1.5">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.substring(2);
        return <li key={idx} className="ml-5 list-disc text-sm text-textSecondary mb-2 leading-relaxed">{parseInlineBold(bulletText)}</li>;
      }
      if (trimmed === '') {
        return <div key={idx} className="h-3" />;
      }
      return <p key={idx} className="text-sm text-textSecondary mb-3.5 leading-relaxed">{parseInlineBold(trimmed)}</p>;
    });
  };

  const parseInlineBold = (line) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="font-bold text-textPrimary">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }
    return parts.length > 0 ? parts : line;
  };

  return (
    <main className="page-shell animate-enter">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-textSecondary hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-textSecondary mt-3 font-semibold">Loading resource details...</p>
        </div>
      ) : error || !resource ? (
        <div className="p-8 text-center rounded-2xl border border-rose-100 bg-rose-50/50">
          <p className="text-sm font-semibold text-rose-700">{error || 'Resource not found.'}</p>
          <button
            onClick={() => navigate('/learn')}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Back to Learn
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl border border-border/80 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
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

                <span className="flex items-center gap-1 text-[11px] text-textMuted font-medium">
                  <Eye size={11} />
                  {resource.views} views
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight mb-3">
                {resource.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-textMuted border-b border-border/60 pb-5 mb-5">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  <span>By: {resource.author}</span>
                </span>
                <span>•</span>
                <span>Category: {resource.category}</span>
              </div>

              {/* Summary Block */}
              <div className="p-4 rounded-xl bg-background border-l-4 border-l-primary/60 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">Summary</p>
                <p className="text-sm text-textSecondary italic">{resource.summary}</p>
              </div>

              {/* Body Content */}
              <div className="prose max-w-none">
                {renderContent(resource.content)}
              </div>
            </div>
          </div>

          {/* Sidebar key takeaways */}
          <div className="space-y-6">
            <Card interactive={false} className="p-6">
              <h3 className="text-base font-bold text-textPrimary flex items-center gap-2 mb-4 border-b border-border/60 pb-2">
                <CheckCircle className="text-primary" size={18} />
                <span>Key Takeaways</span>
              </h3>
              
              {resource.keyTakeaways && resource.keyTakeaways.length > 0 ? (
                <ul className="space-y-3">
                  {resource.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex gap-2.5 items-start">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primaryLight text-primary text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                        {takeaway}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-textMuted">No key takeaways specified.</p>
              )}
            </Card>

            {/* Tags card */}
            {resource.tags && resource.tags.length > 0 && (
              <Card interactive={false} className="p-6">
                <h3 className="text-base font-bold text-textPrimary flex items-center gap-2 mb-3">
                  <Tag className="text-primary" size={16} />
                  <span>Related Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs text-textSecondary font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
