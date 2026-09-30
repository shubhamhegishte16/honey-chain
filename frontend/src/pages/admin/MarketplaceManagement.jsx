import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Store } from 'lucide-react';
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
    try {
      const { data, error } = await apiRequest('/admin/marketplace', { method: 'GET' });
      if (!error && Array.isArray(data) && data.length > 0) {
        setListings(data);
      } else {
        const publicRes = await apiRequest('/marketplace', { method: 'GET' });
        if (!publicRes.error && Array.isArray(publicRes.data) && publicRes.data.length > 0) {
          setListings(publicRes.data);
        }
      }
    } catch {
      // fallback
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
    !search || [l.title, l.floralSource, l.seller_id?.name, l.seller?.name].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="space-y-6 animate-enter">
      <div className="h-8 w-48 rounded-lg bg-border/40 animate-skeleton-pulse" />
      <SkeletonTable rows={5} cols={5} />
    </div>
  );

  return (
    <div className="space-y-6 animate-enter">
      <div className="bento-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-deepBrown">{t('marketplaceManagement')}</h1>
          <p className="text-xs text-deepBrown/70 mt-0.5">Control live honey lots listed on the national Honey Chain Mandi exchange.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-border bg-warmIvory text-deepBrown/70 focus-within:border-burgundy/50 focus-within:ring-2 focus-within:ring-burgundy/10 w-full sm:w-72 transition-all shadow-xs">
          <Search size={16} className="text-deepBrown/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchListings')}
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
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('listing')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('seller')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('pricePerKg')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('status')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(l => (
                <tr key={l._id} className="hover:bg-warmIvory/60 transition-colors">
                  <td className="p-4 font-bold text-deepBrown text-xs">{l.title || `${l.floralSource || 'Pure Organic'} Honey`}</td>
                  <td className="p-4 text-xs text-deepBrown/75">{l.seller_id?.name || l.seller?.name || t('unknown')}</td>
                  <td className="p-4 font-mono font-bold text-burgundy text-xs">₹{l.price_per_kg || l.pricePerKg || 420} / kg</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                      l.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {l.status === 'active' ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(l._id, l.status)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shadow-xs ${
                        l.status === 'active'
                          ? 'border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100'
                          : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {l.status === 'active' ? t('deactivate') : t('activate')}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-deepBrown/60">{t('noListingsFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map(l => (
          <div key={l._id} className="bento-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-deepBrown">{l.title || `${l.floralSource || 'Pure Organic'} Honey`}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                l.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {l.status === 'active' ? t('active') : t('inactive')}
              </span>
            </div>
            <div className="text-xs text-deepBrown/80 space-y-1">
              <p><span className="font-medium text-deepBrown/50">{t('seller')}:</span> {l.seller_id?.name || t('unknown')}</p>
              <p><span className="font-medium text-deepBrown/50">{t('pricePerKg')}:</span> <span className="font-mono font-bold text-burgundy">₹{l.price_per_kg} / kg</span></p>
            </div>
            <div className="pt-2 border-t border-border/60 flex justify-end">
              <button
                onClick={() => toggleStatus(l._id, l.status)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  l.status === 'active'
                    ? 'border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100'
                    : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                {l.status === 'active' ? t('deactivate') : t('activate')}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center bento-card text-sm text-deepBrown/60">
            {t('noListingsFound')}
          </div>
        )}
      </div>
    </div>
  );
}
