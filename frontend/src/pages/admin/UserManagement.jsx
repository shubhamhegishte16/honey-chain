import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
    <div className="space-y-5 animate-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-textPrimary">{t('userManagement')}</h1>
        <div className="flex items-center gap-2 min-h-[40px] px-3 rounded-xl border border-border bg-surface text-textSecondary transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full sm:w-64">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchUsers')}
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
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('name')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('email')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('role')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('location')}</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-background/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-primaryLight text-primary text-xs font-bold shrink-0">
                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                      <span className="font-medium text-textPrimary">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-textSecondary">{u.email}</td>
                  <td className="p-4">
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td className="p-4 text-textSecondary">{u.state || '–'}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="text-xs border border-border rounded-lg px-2 py-1.5 bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
                <tr><td colSpan="5" className="p-8 text-center text-textSecondary">{t('noUsersFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map(u => (
          <div key={u._id} className="p-4 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primaryLight text-primary text-xs font-bold shrink-0">
                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
                <div>
                  <p className="font-bold text-sm text-textPrimary">{u.name}</p>
                  <p className="text-xs text-textSecondary">{u.email}</p>
                </div>
              </div>
              <span className={`role-badge role-${u.role}`}>{u.role}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <span className="text-textSecondary">{u.state || 'India'}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-textMuted font-medium">{t('role')}:</span>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                  className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary font-medium"
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
          <div className="p-8 text-center bg-surface rounded-2xl border border-border text-sm text-textSecondary">
            {t('noUsersFound')}
          </div>
        )}
      </div>
    </div>
  );
}
