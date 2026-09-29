import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, MapPin, User, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAssignedProcessingRequests } from '../../services/processing.service';

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
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Assigned Apiary Consignments</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('assignedWool')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Contracted raw honey combs allocated to your center for centrifugal extraction, settling, and purity grading.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-deepBrown/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchWoolIdBatchId')}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-warmIvory text-xs font-medium text-deepBrown placeholder:text-deepBrown/40 focus:outline-none focus:ring-2 focus:ring-burgundy/15 focus:border-burgundy shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all shadow-xs ${
                activeFilter === f.id
                  ? 'bg-burgundy text-warmIvory shadow-md shadow-burgundy/15'
                  : 'bg-warmIvory/80 border border-border text-deepBrown/70 hover:bg-warmIvory hover:text-burgundy'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bento-card flex flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-4 shadow-md shadow-honeyGold/10">
            <Package size={30} />
          </div>
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('noAssignedWoolFound')}</h3>
          <p className="text-xs text-deepBrown/70 max-w-sm mt-1">{t('noAssignedWoolHelp')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(req => (
            <div
              key={req.id}
              className="bento-card bento-card-hover p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-sm text-burgundy">Batch #{req.batch_id}</span>
                    <h3 className="font-serif font-bold text-base text-deepBrown mt-0.5">
                      {req.floralSource || req.wool_type || 'Raw Blossom'} Honey • <span className="font-mono text-burgundy">{req.quantity_kg} kg</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-honeyGold/20 text-burgundy">
                    {statusLabel(req.status)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-warmIvory/60 border border-border/60 text-xs text-deepBrown/75 space-y-1">
                  <p className="flex items-center gap-1.5"><User size={13} className="text-burgundy" /> Beekeeper: <span className="font-semibold text-deepBrown">{req.farmer_name || 'Apiary Beekeeper'}</span></p>
                  <p className="flex items-center gap-1.5"><MapPin size={13} className="text-burntOrange" /> {req.farmer_location || 'Himachal Pradesh'}</p>
                  <p className="font-medium text-deepBrown/60 pt-1">Service: <span className="font-bold text-deepBrown">{req.service_type}</span></p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <span className="text-[11px] text-deepBrown/50 font-mono">Job #{req.requestId || req.id}</span>
                <button
                  onClick={() => navigate(`/artisan/batches/${req.id}`)}
                  className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1"
                >
                  <span>Open Worksheet</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
