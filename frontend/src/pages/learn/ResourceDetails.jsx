import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, Eye, User, Tag, CheckCircle, CheckCircle2, Volume2, AlertCircle } from 'lucide-react';
import { getTrainingResourceById } from '../../services/training.service';
import Card from '../../components/ui/Card';
import VoiceLearningPlayer from '../../components/learn/VoiceLearningPlayer';
import { isResourceCompleted, toggleResourceCompletion, markResourceCompleted } from '../../services/learningProgress.service';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslatedResource } from '../../services/trainingTranslations.service';
import { speakWithLanguage } from '../../utils/ttsVoice.util';

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [rawResource, setRawResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  // null = no error; string = voice unavailability message to display in step guide
  const [stepVoiceError, setStepVoiceError] = useState(null);

  const resource = rawResource ? getTranslatedResource(rawResource, language) : null;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('woolconnect_completed_steps');
      if (stored) setCompletedSteps(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const toggleStepCheck = (stepKey) => {
    setCompletedSteps(prev => {
      const updated = { ...prev, [stepKey]: !prev[stepKey] };
      try {
        localStorage.setItem('woolconnect_completed_steps', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  useEffect(() => {
    async function loadResource() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await getTrainingResourceById(id);
        if (error) {
          setError(t('somethingWrongWool'));
        } else {
          setRawResource(data);
          setCompleted(isResourceCompleted(data._id || data.id));
        }
      } catch (err) {
        setError(t('somethingWrongWool'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [id]);

  // Scroll to bottom auto-completion detector
  useEffect(() => {
    const handleScroll = () => {
      if (completed || !resource) return;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // When user reaches ~85% down the page, auto-mark completed
      if (scrollTop + windowHeight >= documentHeight - 150) {
        markResourceCompleted(resource._id || resource.id);
        setCompleted(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [completed, resource]);

  const handleToggleCompletion = () => {
    if (!resource) return;
    const resId = resource._id || resource.id;
    const newState = toggleResourceCompletion(resId);
    setCompleted(newState);
  };

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
      {/* Back button & Completion Button Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-textSecondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{t('backToLearn')}</span>
        </button>

        {resource && (
          <button
            onClick={handleToggleCompletion}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              completed
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-surface border border-border text-textSecondary hover:text-primary hover:border-primary/40'
            }`}
          >
            {completed ? <CheckCircle size={15} /> : <CheckCircle2 size={15} />}
            <span>{completed ? `✓ ${t('completed')}` : t('markAsComplete')}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-textSecondary mt-3 font-semibold">{t('loading')}...</p>
        </div>
      ) : error || !resource ? (
        <div className="p-8 text-center rounded-2xl border border-rose-100 bg-rose-50/50">
          <p className="text-sm font-semibold text-rose-700">{error || t('noResourcesFound')}</p>
          <button
            onClick={() => navigate('/learn')}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            {t('backToLearn')}
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
                  {resource.views} {t('views')}
                </span>

                {completed && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ {t('completed')}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight mb-3">
                {resource.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-textMuted border-b border-border/60 pb-5 mb-5">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  <span>{t('byAuthor')} {resource.author}</span>
                </span>
                <span>•</span>
                <span>{t('categoryLabel')} {resource.category}</span>
              </div>

              {/* Summary Block */}
              <div className="p-4 rounded-xl bg-background border-l-4 border-l-primary/60 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-1">{t('summary')}</p>
                <p className="text-sm text-textSecondary italic">{resource.summary}</p>
              </div>

              {/* 📋 Step-by-Step Guide (Farmer-Friendly Design) */}
              {(() => {
                const steps = resource.practicalSteps || [];
                if (steps.length === 0) return null;

                // Voice synthesis for steps — uses shared ttsVoice utility
                // so the language mapping is identical to VoiceLearningPlayer
                const handleListenToSteps = () => {
                  setStepVoiceError(null); // clear previous error
                  let stepText = `${resource.title}. `;
                  steps.forEach((s, idx) => {
                    const title = typeof s === 'string' ? s : s.title || `${t('step')} ${idx + 1}`;
                    const desc  = typeof s === 'string' ? '' : s.description || '';
                    stepText += `${t('step')} ${idx + 1}: ${title}. ${desc}. `;
                  });

                  speakWithLanguage(stepText, language, {
                    rate: 0.9,
                    onVoiceUnavailable: (voiceCode) => {
                      // No Marathi/Hindi voice on this browser — show a clear message
                      setStepVoiceError(
                        `${voiceCode} ${t('regionalVoiceNotAvailable')}`
                      );
                    },
                    onError: (e) => console.error('Step TTS error:', e),
                  });
                };

                const defaultIcons = ['💧', '📦', '⬆️', '☔', '🔍', '✂️', '🧶', '🎨', '💰', '🐑'];

                return (
                  <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-surface border-2 border-emerald-100 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border/70">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold mb-1.5">
                          <span>📋 {t('practicalProcedure')}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-textPrimary tracking-tight">
                          {t('stepByStepGuide')}
                        </h2>
                        <p className="text-xs text-textSecondary font-semibold">
                          {t('followSimpleSteps')}
                        </p>
                      </div>

                      <button
                        onClick={handleListenToSteps}
                        className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-2"
                      >
                        <Volume2 size={16} />
                        <span>🔊 {t('listenToSteps')}</span>
                      </button>
                    </div>

                    {/* Voice unavailability warning */}
                    {stepVoiceError && (
                      <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0 text-amber-600" />
                        <span>{stepVoiceError}</span>
                      </div>
                    )}

                    {/* Step Cards Flow */}
                    <div className="space-y-4">
                      {steps.map((item, idx) => {
                        const stepNum = typeof item === 'object' && item.step ? item.step : idx + 1;
                        const title = typeof item === 'object' ? item.title : item;
                        const description = typeof item === 'object' ? item.description : '';
                        const icon = typeof item === 'object' && item.icon ? item.icon : defaultIcons[idx % defaultIcons.length];
                        const stepKey = `step_${resource._id || resource.id}_${idx}`;
                        const isStepDone = completedSteps[stepKey];

                        return (
                          <React.Fragment key={idx}>
                            <div
                              onClick={() => toggleStepCheck(stepKey)}
                              className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                                isStepDone
                                  ? 'bg-emerald-50/70 border-emerald-300'
                                  : 'bg-background border-border/80 hover:border-primary/50 hover:shadow-md'
                              }`}
                            >
                              {/* Large Step Circle / Number */}
                              <div className="flex flex-col items-center shrink-0">
                                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-lg font-black shadow-sm transition-transform group-hover:scale-105 ${
                                  isStepDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-primary text-white'
                                }`}>
                                  {isStepDone ? '✓' : stepNum}
                                </span>
                              </div>

                              {/* Title & Description */}
                              <div className="flex-1 pt-0.5">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xl">{icon}</span>
                                  <h3 className="text-base sm:text-lg font-extrabold text-textPrimary tracking-tight uppercase">
                                    {title}
                                  </h3>
                                </div>
                                {description && (
                                  <p className="text-sm text-textSecondary font-medium leading-relaxed mt-1">
                                    {description}
                                  </p>
                                )}
                              </div>

                              {/* Interactive Step Check Circle */}
                              <button
                                aria-label="Toggle step complete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStepCheck(stepKey);
                                }}
                                className={`grid h-7 w-7 place-items-center rounded-full border-2 transition-all ${
                                  isStepDone
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-border text-transparent hover:border-emerald-500'
                                }`}
                              >
                                <CheckCircle2 size={18} fill={isStepDone ? 'currentColor' : 'none'} className={isStepDone ? 'text-white' : 'text-transparent'} />
                              </button>
                            </div>

                            {/* Down Arrow Flow Connector */}
                            {idx < steps.length - 1 && (
                              <div className="flex justify-center my-1 text-emerald-600/60">
                                <span className="text-lg font-black">↓</span>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Voice Learning Component */}
              <VoiceLearningPlayer resource={resource} />

              {/* YouTube Video Section */}
              {(() => {
                const getYouTubeEmbedUrl = (url) => {
                  if (!url) return null;
                  const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url);
                  if (!isYouTube) return null;
                  try {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    if (match && match[2] && match[2].length === 11) {
                      return `https://www.youtube.com/embed/${match[2]}`;
                    }
                  } catch (e) {}
                  return null;
                };
                const embedUrl = getYouTubeEmbedUrl(resource.youtubeUrl);
                if (!embedUrl) return null;

                return (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base sm:text-lg font-bold text-textPrimary">📺 {t('trainingVideoLabel')}</span>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider">
                        Video Guide
                      </span>
                    </div>
                    <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-md border border-border/80 bg-black">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={embedUrl}
                        title={`${resource.title} Video Guide`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              })()}

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
                <span>{t('keyTakeawaysLabel')}</span>
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
                <p className="text-xs text-textMuted">{t('noKeyTakeawaysSpecified')}</p>
              )}
            </Card>

            {/* Tags card */}
            {resource.tags && resource.tags.length > 0 && (
              <Card interactive={false} className="p-6">
                <h3 className="text-base font-bold text-textPrimary flex items-center gap-2 mb-3">
                  <Tag className="text-primary" size={16} />
                  <span>{t('relatedTagsLabel')}</span>
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

            {/* Mark as Complete Bottom Sticky Card */}
            <Card interactive={false} className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <h4 className="text-sm font-bold text-emerald-950 mb-1">Track Learning Progress</h4>
              <p className="text-xs text-emerald-800 mb-4">
                Finished studying this module? Mark it as complete to update your training stats.
              </p>
              <button
                onClick={handleToggleCompletion}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                  completed
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-primary text-white hover:bg-primaryDark'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}