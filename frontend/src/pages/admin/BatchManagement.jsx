import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
    const { data, error } = await apiRequest('/admin/batches', { method: 'GET' });
    if (!error && data) {
      setBatches(data);
    }
    setLoading(false);
  };

  const filtered = batches.filter(b =>
    !search || [b.batch_id, b.wool_type, b.status, b.farmer_id?.name].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="space-y-6 animate-enter">
      <div className="h-8 w-48 rounded-lg bg-border/40 animate-skeleton-pulse" />
      <SkeletonTable rows={6} cols={5} />
    </div>
  );

  return (
    <div className="space-y-5 animate-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-textPrimary">{t('batchManagement')}</h1>
        <div className="flex items-center gap-2 min-h-[40px] px-3 rounded-xl border border-border bg-surface text-textSecondary transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full sm:w-64">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchBatches')}
            className="flex-1 bg-transparent border-none outline-none text-sm text-textPrimary placeholder:text-textMuted"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-surface rounded-2xl border border-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('batchId')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('farmer')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('typeAndQty')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('status')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(b => (
                <tr key={b._id} className="hover:bg-background/60 transition-colors">
                  <td className="p-4 font-semibold text-textPrimary">{b.batch_id}</td>
                  <td className="p-4 text-textSecondary">{b.farmer_id?.name || t('unknown')}</td>
                  <td className="p-4 text-textPrimary">
                    {b.floralSource || b.wool_type || 'Raw Blossom'} Honey <span className="text-textMuted">•</span> {b.quantity_kg}kg
                  </td>
                  <td className="p-4">
                    <BatchStatusBadge status={b.status} />
                  </td>
                  <td className="p-4 text-textSecondary">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-textSecondary">{t('noBatchesFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map(b => (
          <div key={b._id} className="p-4 rounded-2xl bg-surface border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-textPrimary">{b.batch_id}</span>
              <BatchStatusBadge status={b.status} />
            </div>
            <div className="text-xs text-textSecondary space-y-1">
              <p><span className="font-medium text-textMuted">{t('farmer')}:</span> {b.farmer_id?.name || t('unknown')}</p>
              <p><span className="font-medium text-textMuted">Variety:</span> {b.floralSource || b.wool_type || 'Raw Blossom'} Honey • <span className="font-bold text-textPrimary">{b.quantity_kg} kg</span></p>
            </div>
            <div className="pt-2 border-t border-border/60 text-[11px] text-textMuted flex justify-between">
              <span>{new Date(b.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center bg-surface rounded-2xl border border-border text-sm text-textSecondary">
            {t('noBatchesFound')}
          </div>
        )}
      </div>
    </div>
  );
}
