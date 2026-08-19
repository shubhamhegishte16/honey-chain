import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  ClipboardPlus,
  Search,
  Filter,
  MapPin,
  Calendar,
  QrCode,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import Button from '../../components/ui/Button';
import { getBatchesByFarmer } from '../../services/batches.service';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Batches' },
  { id: 'listed', label: 'Listed' },
  { id: 'produced', label: 'Produced' },
  { id: 'quality_checked', label: 'Graded' },
  { id: 'stored', label: 'Stored' },
  { id: 'processed', label: 'Processed' },
];

export default function FarmerTracking() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);
    getBatchesByFarmer(profile.id).then(({ data, error: fetchError }) => {
      if (fetchError) setError('Could not load your wool batches.');
      else setBatches(data || []);
      setLoading(false);
    });
  }, [profile?.id]);

  const filteredBatches = batches.filter(b => {
    const matchSearch =
      b.batch_id?.toLowerCase().includes(search.toLowerCase()) ||
      b.wool_type?.toLowerCase().includes(search.toLowerCase()) ||
      b.district?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeFilter === 'all' || b.status === activeFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="page-shell">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow text-primary mb-1">
            <Sparkles size={13} /> Batch Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
            Wool Batch Tracking
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Monitor end-to-end provenance, grading status, and QR lot passports
          </p>
        </div>

        <button
          onClick={() => navigate('/batches/add')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primaryDark hover:shadow-md transition-all active:scale-[0.98]"
        >
          <ClipboardPlus size={16} />
          <span>Record New Batch</span>
        </button>
      </div>

      {/* ─── Search & Status Filters ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by lot ID, breed, or district..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STATUS_FILTERS.map(f => (
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

      {/* ─── Batches List / Grid ─── */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="p-6 text-center rounded-2xl bg-errorLight/50 border border-error/20 text-error text-sm">
          {error}
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="p-10 sm:p-16 text-center rounded-3xl bg-surface border border-border flex flex-col items-center animate-fade-in">
          <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primaryLight text-primary mb-4 shadow-sm">
            <Package size={32} />
          </span>
          <h3 className="font-bold text-lg text-textPrimary">No wool batches found</h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-6">
            {search || activeFilter !== 'all'
              ? 'No batches match your search filter criteria.'
              : 'Add your first wool batch to generate a verifiable digital passport and track it from farm to fabric.'}
          </p>
          <button
            onClick={() => navigate('/batches/add')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow hover:bg-primaryDark transition-all"
          >
            <ClipboardPlus size={16} />
            <span>Record First Batch</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {filteredBatches.map(batch => (
            <div
              key={batch.id || batch._id}
              className="p-5 rounded-3xl bg-surface border border-border/80 shadow-sm hover:shadow-card-hover hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primaryLight text-primary font-bold shrink-0">
                      <Package size={20} />
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-textPrimary leading-tight">
                        {batch.batch_id}
                      </h3>
                      <p className="text-xs text-textSecondary font-semibold mt-0.5">
                        {batch.wool_type} • <span className="text-primary font-bold">{batch.quantity_kg} kg</span>
                      </p>
                    </div>
                  </div>
                  <BatchStatusBadge status={batch.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-2xl bg-background border border-border/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-textMuted block">Origin</span>
                    <span className="font-semibold text-textPrimary flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={11} className="text-primary shrink-0" />
                      {batch.district || 'Bikaner'}, {batch.state || 'Rajasthan'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-textMuted block">Sheared Date</span>
                    <span className="font-semibold text-textPrimary flex items-center gap-1 mt-0.5 truncate">
                      <Calendar size={11} className="text-textMuted shrink-0" />
                      {batch.shearing_date ? new Date(batch.shearing_date).toLocaleDateString() : 'Recent Clip'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Shortcuts */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/batches/${batch.id || batch._id}/qr`)}
                    className="px-3 py-1.5 rounded-lg bg-background border border-border text-textSecondary hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <QrCode size={13} /> QR
                  </button>
                  <button
                    onClick={() => navigate(`/batches/${batch.id || batch._id}/traceability`)}
                    className="px-3 py-1.5 rounded-lg bg-background border border-border text-textSecondary hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Layers size={13} /> Timeline
                  </button>
                </div>

                <button
                  onClick={() => navigate(`/batches/${batch.id || batch._id}/details`)}
                  className="text-primary hover:text-primaryDark font-bold inline-flex items-center gap-1 group"
                >
                  <span>Details</span>
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
