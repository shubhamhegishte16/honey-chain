import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export default function MarketplaceManagement() {
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await apiRequest('/admin/marketplace', { method: 'GET' });
    if (!error && data) {
      setListings(data);
    }
    setLoading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await apiRequest(`/admin/marketplace/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    if (!error) fetchListings();
  };

  const filtered = listings.filter(l =>
    !search || [l.title, l.wool_type, l.seller_id?.name].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="space-y-6 animate-enter">
      <div className="h-8 w-48 rounded-lg bg-border/40 animate-skeleton-pulse" />
      <SkeletonTable rows={5} cols={5} />
    </div>
  );

  return (
    <div className="space-y-5 animate-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-textPrimary">{t('marketplaceManagement')}</h1>
        <div className="flex items-center gap-2 min-h-[40px] px-3 rounded-xl border border-border bg-surface text-textSecondary transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full sm:w-64">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchListings')}
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
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('listing')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('seller')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('pricePerKg')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('status')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(l => (
                <tr key={l._id} className="hover:bg-background/60 transition-colors">
                  <td className="p-4 font-medium text-textPrimary">{l.title || `${l.wool_type} Wool`}</td>
                  <td className="p-4 text-textSecondary">{l.seller_id?.name || t('unknown')}</td>
                  <td className="p-4 font-semibold text-textPrimary">₹{l.price_per_kg}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                      l.status === 'active'
                        ? 'bg-primaryLight text-primary'
                        : 'bg-errorLight text-error'
                    }`}>
                      {l.status === 'active' ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(l._id, l.status)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        l.status === 'active'
                          ? 'border-error/30 text-error bg-errorLight/40 hover:bg-errorLight'
                          : 'border-primary/30 text-primary bg-primaryLight/40 hover:bg-primaryLight'
                      }`}
                    >
                      {l.status === 'active' ? t('deactivate') : t('activate')}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-textSecondary">{t('noListingsFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map(l => (
          <div key={l._id} className="p-4 rounded-2xl bg-surface border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-textPrimary">{l.title || `${l.wool_type} Wool`}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                l.status === 'active'
                  ? 'bg-primaryLight text-primary'
                  : 'bg-errorLight text-error'
              }`}>
                {l.status === 'active' ? t('active') : t('inactive')}
              </span>
            </div>
            <div className="text-xs text-textSecondary space-y-1">
              <p><span className="font-medium text-textMuted">{t('seller')}:</span> {l.seller_id?.name || t('unknown')}</p>
              <p><span className="font-medium text-textMuted">{t('pricePerKg')}:</span> <span className="font-bold text-textPrimary">₹{l.price_per_kg}</span></p>
            </div>
            <div className="pt-2 border-t border-border/60 flex justify-end">
              <button
                onClick={() => toggleStatus(l._id, l.status)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  l.status === 'active'
                    ? 'border-error/30 text-error bg-errorLight/40 hover:bg-errorLight'
                    : 'border-primary/30 text-primary bg-primaryLight/40 hover:bg-primaryLight'
                }`}
              >
                {l.status === 'active' ? t('deactivate') : t('activate')}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center bg-surface rounded-2xl border border-border text-sm text-textSecondary">
            {t('noListingsFound')}
          </div>
        )}
      </div>
    </div>
  );
}
