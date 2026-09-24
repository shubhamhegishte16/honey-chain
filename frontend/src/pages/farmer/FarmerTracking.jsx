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
  Cog,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import Button from '../../components/ui/Button';
import RequestProcessingModal from '../../components/processing/RequestProcessingModal';
import { getBatchesByFarmer } from '../../services/batches.service';

export default function FarmerTracking() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBatchForProcessing, setSelectedBatchForProcessing] = useState(null);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const statusFilters = [
    { id: 'all', label: 'All Lots' },
    { id: 'listed', label: 'On Mandi' },
    { id: 'produced', label: 'Harvested' },
    { id: 'quality_checked', label: 'Lab Graded' },
    { id: 'stored', label: 'Stored' },
    { id: 'processed', label: 'Bottled' },
  ];

  useEffect(() => {
    setLoading(true);
    getBatchesByFarmer(profile?.id || 'demo-farmer-1').then(({ data, error: fetchError }) => {
      if (fetchError) setError('Unable to load honey batches.');
      else setBatches(data || []);
      setLoading(false);
    });
  }, [profile?.id]);

  const filteredBatches = batches.filter(b => {
    const floral = b.floralSource || b.wool_type || '';
    const matchSearch =
      b.batch_id?.toLowerCase().includes(search.toLowerCase()) ||
      floral.toLowerCase().includes(search.toLowerCase()) ||
      b.district?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeFilter === 'all' || b.status === activeFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="page-shell py-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow text-amber-600 mb-1 flex items-center gap-1 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={13} /> KVIC Honey Mission Apiary Lots
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-textPrimary">
            My Honey Harvest Batches
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Total Harvested: {batches.reduce((sum, batch) => sum + Number(batch.quantity_kg || batch.quantityKg || 0), 0).toLocaleString()} kg
          </p>
        </div>

        <button
          onClick={() => navigate('/batches/add')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primaryDark hover:shadow-md transition-all active:scale-[0.98]"
        >
          <ClipboardPlus size={16} />
          <span>Log Honey Harvest</span>
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
            placeholder="Search by lot ID, flora (Mustard, Acacia), or district..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {statusFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilter === filter.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface border border-border/80 text-textSecondary hover:bg-background'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Batch List ─── */}
      {loading ? (
        <div className="py-16 flex justify-center items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-textSecondary">Loading apiary records...</span>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border/70 rounded-3xl p-8">
          <span className="text-4xl">🐝</span>
          <h3 className="text-base font-bold text-textPrimary mt-3">No Honey Batches Found</h3>
          <p className="text-xs text-textSecondary mt-1">Start by recording your first raw honey harvest extraction.</p>
          <button
            onClick={() => navigate('/batches/add')}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Log New Harvest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map(batch => {
            const batchId = batch.batch_id || batch.batchId || batch.id;
            const floral = batch.floralSource || batch.wool_type || 'Mustard Blossom Raw Honey';
            const weight = batch.quantity_kg || batch.quantityKg || 50;

            return (
              <div
                key={batchId}
                className="rounded-3xl bg-surface border border-border/80 p-5 hover:border-amber-400 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-extrabold font-mono text-primary bg-primaryLight px-2.5 py-0.5 rounded-full">
                      {batchId}
                    </span>
                    <BatchStatusBadge status={batch.status} />
                  </div>

                  <h3 className="font-extrabold text-base text-textPrimary">{floral}</h3>
                  <p className="text-xs text-textSecondary mt-0.5 flex items-center gap-1">
                    <MapPin size={12} className="text-primary" /> {batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/50 text-xs">
                    <div>
                      <span className="text-textMuted block text-[10px] uppercase font-bold">Quantity</span>
                      <strong className="text-sm font-black text-amber-900 font-mono">{weight} kg</strong>
                    </div>
                    <div>
                      <span className="text-textMuted block text-[10px] uppercase font-bold">Quality Grade</span>
                      <strong className="text-xs font-bold text-emerald-700">{batch.qualityGrade || 'Grade A+'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <Link
                    to={`/batches/${batch._id || batch.id}/details`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    View Details →
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/batches/${batch._id || batch.id}/qr`}
                      title="QR Code"
                      className="p-2 rounded-xl bg-background border border-border hover:border-primary/50 text-textSecondary hover:text-primary transition-colors"
                    >
                      <QrCode size={15} />
                    </Link>
                    <Link
                      to={`/buyer/honey-passport/${batchId}`}
                      title="Public Passport"
                      className="p-2 rounded-xl bg-amber-100 border border-amber-300 hover:bg-amber-200 text-amber-900 transition-colors"
                    >
                      <ShieldCheck size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
