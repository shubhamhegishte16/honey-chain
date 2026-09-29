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
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Finished Extraction Records</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('completedWorkTitle')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Audit history of refined, bottled, and lab-certified honey consignments ready for consumer release.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bento-card flex flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-4 shadow-md shadow-honeyGold/10">
            <CheckCircle size={30} />
          </div>
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('noCompletedWork')}</h3>
          <p className="text-xs text-deepBrown/70 max-w-sm mt-1">{t('noCompletedWorkHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => (
            <div
              key={req.id}
              className="bento-card bento-card-hover p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold shrink-0">
                      <Package size={20} />
                    </span>
                    <div>
                      <h3 className="font-mono font-bold text-sm text-burgundy">Batch #{req.batch_id}</h3>
                      <p className="text-xs font-bold text-deepBrown mt-0.5">
                        {req.service_type} • <span className="font-mono text-burgundy">{req.quantity_kg} kg</span>
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    {t('completed')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-warmIvory/60 border border-border/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-deepBrown/50 block">{t('completionDateLabel')}</span>
                    <span className="font-semibold text-deepBrown flex items-center gap-1 mt-0.5">
                      <Calendar size={12} className="text-burntOrange shrink-0" />
                      {req.completion_date ? new Date(req.completion_date).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-deepBrown/50 block">{t('finalStatusLabel')}</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">
                      {req.batch?.qualityGrade || 'KVIC Grade A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-end text-xs">
                <button
                  onClick={() => navigate(`/artisan/batches/${req.id}`)}
                  className="text-burgundy hover:underline font-bold inline-flex items-center gap-1.5 group"
                >
                  <span>{t('viewWoolPassportBtn')}</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
