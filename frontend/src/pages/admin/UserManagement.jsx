import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { SkeletonTable } from '../../components/ui/Skeleton';

export default function UserManagement() {
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
        <h1 className="text-2xl font-bold text-textPrimary">User Management</h1>
        <div className="flex items-center gap-2 min-h-[40px] px-3 rounded-xl border border-border bg-surface text-textSecondary transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full sm:w-64">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-textPrimary placeholder:text-textMuted"
          />
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Name</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Email</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Role</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Location</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Actions</th>
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
                      <option value="farmer">Farmer</option>
                      <option value="buyer">Buyer</option>
                      <option value="processor">Processor</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="artisan">Artisan</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-textSecondary">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
