import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiRequest } from '../../services/api';
import BatchStatusBadge from '../../components/batch/BatchStatusBadge';
import { SkeletonTable } from '../../components/ui/Skeleton';

export default function BatchManagement() {
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
        <h1 className="text-2xl font-bold text-textPrimary">Batch Management</h1>
        <div className="flex items-center gap-2 min-h-[40px] px-3 rounded-xl border border-border bg-surface text-textSecondary transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full sm:w-64">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search batches…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-textPrimary placeholder:text-textMuted"
          />
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Batch ID</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Farmer</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Type & Qty</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-textSecondary text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(b => (
                <tr key={b._id} className="hover:bg-background/60 transition-colors">
                  <td className="p-4 font-semibold text-textPrimary">{b.batch_id}</td>
                  <td className="p-4 text-textSecondary">{b.farmer_id?.name || 'Unknown'}</td>
                  <td className="p-4 text-textPrimary">
                    {b.wool_type} <span className="text-textMuted">•</span> {b.quantity_kg}kg
                  </td>
                  <td className="p-4">
                    <BatchStatusBadge status={b.status} />
                  </td>
                  <td className="p-4 text-textSecondary">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-textSecondary">No batches found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
