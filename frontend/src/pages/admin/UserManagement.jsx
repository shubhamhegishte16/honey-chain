import React, { useEffect, useState } from 'react';
import { Search, Users, Shield, UserCheck } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await apiRequest('/admin/users', { method: 'GET' });
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const updateRole = async (userId, role) => {
    const { error } = await apiRequest(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    if (!error) fetchUsers();
  };

  const filtered = users.filter(u =>
    !search || [u.name, u.email, u.role, u.state].some(f => f?.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-2xl font-serif font-bold text-deepBrown">{t('userManagement')}</h1>
          <p className="text-xs text-deepBrown/70 mt-0.5">Manage beekeepers, laboratories, bottling processors, and FMCG buyers.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-border bg-warmIvory text-deepBrown/70 focus-within:border-burgundy/50 focus-within:ring-2 focus-within:ring-burgundy/10 w-full sm:w-72 transition-all shadow-xs">
          <Search size={16} className="text-deepBrown/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchUsers')}
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
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('name')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('email')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('role')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('location')}</th>
                <th className="p-4 font-bold text-deepBrown text-xs uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-warmIvory/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-burgundy/10 text-burgundy text-xs font-bold shrink-0">
                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                      <span className="font-bold text-deepBrown">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-deepBrown/75 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-honeyGold/20 text-deepBrown">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-deepBrown/70">{u.state || '–'}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="text-xs border border-border rounded-xl px-3 py-1.5 bg-warmIvory text-deepBrown focus:outline-none focus:ring-2 focus:ring-burgundy/20 font-medium cursor-pointer shadow-xs"
                    >
                      <option value="farmer">{t('roleFarmer')}</option>
                      <option value="buyer">{t('roleBuyer')}</option>
                      <option value="processor">{t('roleProcessor')}</option>
                      <option value="warehouse">{t('roleWarehouse')}</option>
                      <option value="artisan">{t('roleArtisan')}</option>
                      <option value="admin">{t('roleAdmin')}</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-deepBrown/60">{t('noUsersFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map(u => (
          <div key={u._id} className="bento-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-burgundy/10 text-burgundy text-xs font-bold shrink-0">
                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
                <div>
                  <p className="font-bold text-sm text-deepBrown">{u.name}</p>
                  <p className="text-xs text-deepBrown/60">{u.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-honeyGold/20 text-deepBrown">
                {u.role}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <span className="text-deepBrown/70">{u.state || 'India'}</span>
              <div className="flex items-center gap-2">
                <span className="text-deepBrown/50 font-medium">{t('role')}:</span>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                  className="text-xs border border-border rounded-xl px-2.5 py-1 bg-warmIvory text-deepBrown font-medium focus:outline-none"
                >
                  <option value="farmer">{t('roleFarmer')}</option>
                  <option value="buyer">{t('roleBuyer')}</option>
                  <option value="processor">{t('roleProcessor')}</option>
                  <option value="warehouse">{t('roleWarehouse')}</option>
                  <option value="artisan">{t('roleArtisan')}</option>
                  <option value="admin">{t('roleAdmin')}</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center bento-card text-sm text-deepBrown/60">
            {t('noUsersFound')}
          </div>
        )}
      </div>
    </div>
  );
}
