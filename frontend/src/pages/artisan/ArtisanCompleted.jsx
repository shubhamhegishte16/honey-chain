import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAssignedProcessingRequests } from '../../services/processing.service';

export default function ArtisanCompleted() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAssignedProcessingRequests().then(({ data, error }) => {
      if (!error) setRequests((data || []).filter(r => r.status === 'completed'));
      setLoading(false);
    });
  }, []);

  return (
    <main className="page-shell">
      <div className="mb-6">
        <div className="eyebrow text-primary mb-1">
          <Sparkles size={13} /> {t('completedWorkTitle')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
          {t('completedWorkTitle')}
        </h1>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-10 sm:p-16 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primaryLight text-primary mb-4 shadow-sm">
            <CheckCircle size={32} />
          </span>
          <h3 className="font-bold text-lg text-textPrimary">{t('noCompletedWork')}</h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1">{t('noCompletedWorkHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => (
            <div
              key={req.id}
              className="p-5 rounded-3xl bg-surface border border-border/80 shadow-sm hover:shadow-card-hover hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold shrink-0">
                    <Package size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-textPrimary leading-tight">{req.batch_id}</h3>
                    <p className="text-xs text-textSecondary font-semibold mt-0.5">
                      {req.service_type} • <span className="text-primary font-bold">{req.quantity_kg} kg</span>
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                  {t('completed')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-2xl bg-background border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-textMuted block">{t('completionDateLabel')}</span>
                  <span className="font-semibold text-textPrimary flex items-center gap-1 mt-0.5">
                    <Calendar size={11} className="text-textMuted shrink-0" />
                    {req.completion_date ? new Date(req.completion_date).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-textMuted block">{t('finalStatusLabel')}</span>
                  <span className="font-semibold text-textPrimary mt-0.5 block">
                    {req.batch?.qualityGrade || t('pending')}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-border/60 flex items-center justify-end text-xs font-semibold">
                <button
                  onClick={() => navigate(`/artisan/batches/${req.id}`)}
                  className="text-primary hover:text-primaryDark font-bold inline-flex items-center gap-1 group"
                >
                  <span>{t('viewWoolPassportBtn')}</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
