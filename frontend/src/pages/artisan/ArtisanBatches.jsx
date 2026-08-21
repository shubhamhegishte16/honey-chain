import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, MapPin, User, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAssignedProcessingRequests } from '../../services/processing.service';

const STATUS_TONE = {
  requested: 'bg-warningLight text-warning',
  accepted: 'bg-infoLight text-info',
  in_progress: 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function ArtisanBatches() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const statusFilters = [
    { id: 'all', label: t('filterAllStatus') },
    { id: 'requested', label: t('filterRequested') },
    { id: 'accepted', label: t('filterAccepted') },
    { id: 'in_progress', label: t('filterInProgress') },
    { id: 'completed', label: t('filterCompleted') },
  ];

  useEffect(() => {
    setLoading(true);
    getAssignedProcessingRequests().then(({ data, error: fetchError }) => {
      if (fetchError) setError(t('somethingWrongTryAgain'));
      else setRequests(data || []);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = requests.filter(r => {
    const matchSearch =
      r.batch_id?.toLowerCase().includes(search.toLowerCase()) ||
      r.requestId?.toLowerCase().includes(search.toLowerCase()) ||
      r.farmer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeFilter === 'all' || r.status === activeFilter;
    return matchSearch && matchStatus;
  });

  const statusLabel = (status) => {
    const map = {
      requested: t('statusRequested'),
      accepted: t('statusAccepted'),
      in_progress: t('statusInProgressArtisan'),
      completed: t('completed'),
      rejected: t('statusRejected'),
    };
    return map[status] || status;
  };

  return (
    <main className="page-shell">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow text-primary mb-1">
            <Sparkles size={13} /> {t('assignedWool')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
            {t('assignedWool')}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchWoolIdBatchId')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {statusFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                activeFilter === f.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border text-textSecondary hover:border-primary/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="p-6 text-center rounded-2xl bg-errorLight/50 border border-error/20 text-error text-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 sm:p-16 text-center rounded-3xl bg-surface border border-border flex flex-col items-center animate-fade-in">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primaryLight text-primary mb-4 shadow-sm">
            <Package size={32} />
          </span>
          <h3 className="font-bold text-lg text-textPrimary">{t('noBatchesAssigned')}</h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1">{t('noBatchesAssignedHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {filtered.map(req => (
            <div
              key={req.id}
              onClick={() => navigate(`/artisan/batches/${req.id}`)}
              className="p-5 rounded-3xl bg-surface border border-border/80 shadow-sm hover:shadow-card-hover hover:border-primary/40 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primaryLight text-primary font-bold shrink-0">
                      <Package size={20} />
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-textPrimary leading-tight">{req.batch_id}</h3>
                      <p className="text-xs text-textSecondary font-semibold mt-0.5">
                        {req.service_type} • <span className="text-primary font-bold">{req.quantity_kg} kg</span>
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_TONE[req.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel(req.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-2xl bg-background border border-border/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-textMuted block">{t('farmer')}</span>
                    <span className="font-semibold text-textPrimary flex items-center gap-1 mt-0.5 truncate">
                      <User size={11} className="text-primary shrink-0" />
                      {req.farmer_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-textMuted block">{t('grade')}</span>
                    <span className="font-semibold text-textPrimary flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={11} className="text-textMuted shrink-0" />
                      {req.batch?.qualityGrade || t('pending')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-border/60 flex items-center justify-end text-xs font-semibold">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/artisan/batches/${req.id}`); }}
                  className="text-primary hover:text-primaryDark font-bold inline-flex items-center gap-1 group"
                >
                  <span>{t('viewDetails')}</span>
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
