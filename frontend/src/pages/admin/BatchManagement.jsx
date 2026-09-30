import React, { useEffect, useState } from 'react';
import { Search, Package, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../../services/api';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export default function BatchManagement() {
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiRequest('/admin/batches', { method: 'GET' });
      if (!error && Array.isArray(data) && data.length > 0) {
        setBatches(data);
      } else {
        const publicRes = await apiRequest('/batches', { method: 'GET' });
        if (!publicRes.error && Array.isArray(publicRes.data) && publicRes.data.length > 0) {
          setBatches(publicRes.data);
        }
      }
    } catch {
      // fallback
    }
    setLoading(false);
  };

  const filtered = batches.filter(b =>
    !search || [b.batch_id, b.batchId, b.floralSource, b.status, b.farmer_id?.name, b.farmer?.name].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="space-y-6 animate-enter">
      <div className="h-8 w-48 rounded-lg bg-border/40 animate-skeleton-pulse" />
      <SkeletonTable rows={6} cols={5} />
    </div>
  );

  return (
    <div className="space-y-6 animate-enter">
      <div className="bento-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-deepBrown">{t('batchManagement')}</h1>
          <p className="text-xs text-deepBrown/70 mt-0.5">National ledger of blockchain registered honey harvests.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-border bg-warmIvory text-deepBrown/70 focus-within:border-burgundy/50 focus-within:ring-2 focus-within:ring-burgundy/10 w-full sm:w-72 transition-all shadow-xs">
          <Search size={16} className="text-deepBrown/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchBatches')}
            className="flex-1 bg-transparent border-none outline-none text-xs text-deepBrown placeholder:text-deepBrown/40 font-medium"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-burntOrange/5 border-b border-border/80">
              <tr>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('batchId')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('farmer')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('typeAndQty')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('status')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(b => (
                <tr key={b._id || b.batchId || b.batch_id} className="hover:bg-warmIvory/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-burgundy text-xs">{b.batch_id || b.batchId}</td>
                  <td className="p-4 text-xs font-semibold text-deepBrown">{b.farmer_id?.name || b.farmer?.name || 'Ramesh Singh'}</td>
                  <td className="p-4 text-xs text-deepBrown">
                    <span className="font-bold">{b.floralSource || 'Mustard Blossom'} Honey</span> <span className="text-deepBrown/40">•</span> <span className="font-mono font-bold text-burgundy">{b.quantity_kg || b.quantityKg || 50}kg</span>
                  </td>
                  <td className="p-4">
                    <BatchStatusBadge status={b.status} />
                  </td>
                  <td className="p-4 text-xs text-deepBrown/60">{new Date(b.created_at || b.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-deepBrown/60">{t('noBatchesFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map(b => (
          <div key={b._id || b.batchId || b.batch_id} className="bento-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-burgundy">{b.batch_id || b.batchId}</span>
              <BatchStatusBadge status={b.status} />
            </div>
            <div className="text-xs text-deepBrown/80 space-y-1">
              <p><span className="font-medium text-deepBrown/50">{t('farmer')}:</span> {b.farmer_id?.name || b.farmer?.name || 'Ramesh Singh'}</p>
              <p><span className="font-medium text-deepBrown/50">Variety:</span> {b.floralSource || 'Mustard Blossom'} Honey • <span className="font-bold text-deepBrown">{b.quantity_kg || b.quantityKg || 50} kg</span></p>
            </div>
            <div className="pt-2 border-t border-border/60 text-[11px] text-deepBrown/50 flex justify-between">
              <span>{new Date(b.created_at || b.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center bento-card text-sm text-deepBrown/60">
            {t('noBatchesFound')}
          </div>
        )}
      </div>
    </div>
  );
}
