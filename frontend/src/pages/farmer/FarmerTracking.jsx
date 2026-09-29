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
import { getBatchesByFarmer } from '../../services/batches.service';

export default function FarmerTracking() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <main className="page-shell">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow"><Sparkles size={13} /> KVIC Honey Mission Apiary Lots</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#281D1C] mt-1">
            My Honey Harvest Batches
          </h1>
          <p className="text-xs sm:text-sm text-[#5E524D] mt-1">
            Total Harvested: <strong className="text-[#281D1C]">{batches.reduce((sum, batch) => sum + Number(batch.quantity_kg || batch.quantityKg || 0), 0).toLocaleString()} kg</strong> across all active apiaries
          </p>
        </div>

        <button
          onClick={() => navigate('/batches/add')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#861C1C] text-white font-bold text-xs sm:text-sm shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95"
        >
          <ClipboardPlus size={16} />
          <span>Log Honey Harvest</span>
        </button>
      </div>

      {/* ─── Search & Status Filters ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B918B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by lot ID, floral bloom, or district..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E8E3CF] bg-white text-xs sm:text-sm text-[#281D1C] placeholder:text-[#9B918B] focus:outline-none focus:ring-2 focus:ring-[#F4B345]/30 focus:border-[#F4B345] shadow-soft"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {statusFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#861C1C] text-white shadow-burgundy font-bold'
                  : 'bg-white border border-[#E8E3CF] text-[#5E524D] hover:border-[#D6CEB5]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Batch List ─── */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
          <span className="text-xs font-bold text-[#5E524D]">Loading apiary records...</span>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E8E3CF] rounded-3xl p-8 shadow-card">
          <span className="text-4xl">🐝</span>
          <h3 className="text-base font-bold font-serif text-[#281D1C] mt-3">No Honey Batches Found</h3>
          <p className="text-xs text-[#5E524D] mt-1">Start by recording your first raw honey harvest extraction.</p>
          <button
            onClick={() => navigate('/batches/add')}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-burgundy hover:bg-[#6A1515]"
          >
            Log New Harvest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map(batch => {
            const batchId = batch.batch_id || batch.batchId || batch.id;
            const floral = batch.floralSource || batch.wool_type || 'Mustard Blossom Raw Honey';
            const weight = batch.quantity_kg || batch.quantityKg || 60;

            return (
              <div
                key={batchId}
                className="rounded-3xl bg-white border border-[#E8E3CF] p-5 hover:border-[#F4B345] hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E8E3CF]/60">
                    <span className="text-xs font-bold font-mono text-[#861C1C] bg-[#FBEBEB] px-2.5 py-0.5 rounded-full border border-[#861C1C]/20">
                      {batchId}
                    </span>
                    <BatchStatusBadge status={batch.status} />
                  </div>

                  <h3 className="font-bold font-serif text-base text-[#281D1C]">{floral}</h3>
                  <p className="text-xs text-[#5E524D] mt-0.5 flex items-center gap-1">
                    <MapPin size={12} className="text-[#C06E30]" /> {batch.district || 'Bharatpur'}, {batch.state || 'Rajasthan'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#FAF7EE] rounded-2xl border border-[#E8E3CF] text-xs">
                    <div>
                      <span className="text-[#9B918B] block text-[10px] uppercase font-bold">Quantity</span>
                      <strong className="text-sm font-bold text-[#861C1C] font-mono">{weight} kg</strong>
                    </div>
                    <div>
                      <span className="text-[#9B918B] block text-[10px] uppercase font-bold">Quality Grade</span>
                      <strong className="text-xs font-bold text-emerald-800">{batch.qualityGrade || 'Grade A+'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E3CF] flex items-center justify-between gap-2">
                  <Link
                    to={`/batches/${batch._id || batch.id}/details`}
                    className="text-xs font-bold text-[#861C1C] hover:underline flex items-center gap-1"
                  >
                    View Details →
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/batches/${batch._id || batch.id}/qr`}
                      title="QR Code"
                      className="p-2 rounded-full bg-[#FAF7EE] border border-[#E8E3CF] hover:border-[#F4B345] text-[#5E524D] hover:text-[#281D1C] transition-colors"
                    >
                      <QrCode size={14} />
                    </Link>
                    <Link
                      to={`/buyer/honey-passport/${batchId}`}
                      title="Public Passport"
                      className="p-2 rounded-full bg-[#FEF6E4] border border-[#F4B345]/40 text-[#C06E30] hover:bg-[#FDE8B5] transition-colors"
                    >
                      <ShieldCheck size={14} />
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
