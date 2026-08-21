import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import { Users, Package, ShoppingCart, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await apiRequest('/admin/dashboard', { method: 'GET' });
    if (!error && data) {
      setStats(data);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded-lg bg-border/40 animate-skeleton-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard /> <SkeletonCard />
      </div>
    </div>
  );

  if (!stats) return (
    <div className="text-center py-10">
      <p className="text-error font-medium">{t('failedLoadDashboard')}</p>
      <button onClick={fetchStats} className="mt-2 text-sm text-primary font-semibold hover:underline">{t('retry')}</button>
    </div>
  );

  const statCards = [
    { title: t('totalUsers'), value: stats.users?.total || 0, icon: Users, bg: 'bg-infoLight', iconColor: 'text-info' },
    { title: t('totalBatches'), value: stats.batches?.total || 0, icon: Package, bg: 'bg-accentLight', iconColor: 'text-accent' },
    { title: t('marketplaceListings'), value: stats.marketplace?.total || 0, icon: ShoppingCart, bg: 'bg-primaryLight', iconColor: 'text-primary' },
    { title: t('processingRequests'), value: stats.processing?.total || 0, icon: Activity, bg: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-enter">
      <h1 className="text-2xl font-bold text-textPrimary">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <Card key={i} interactive={false} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${c.bg} ${c.iconColor}`}>
              <c.icon size={22} />
            </div>
            <div>
              <p className="text-sm text-textSecondary font-medium">{c.title}</p>
              <p className="text-2xl font-bold text-textPrimary">{c.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card interactive={false}>
          <h2 className="text-lg font-bold text-textPrimary mb-4">{t('recentUsers')}</h2>
          <div className="space-y-3">
            {stats.users?.recent?.map(u => (
              <div key={u._id} className="flex justify-between items-center border-b border-border/60 pb-2.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primaryLight text-primary text-xs font-bold">
                    {u.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                  <div>
                    <p className="font-medium text-sm text-textPrimary">{u.name}</p>
                    <p className="text-xs text-textMuted">{u.email}</p>
                  </div>
                </div>
                <span className={`role-badge role-${u.role}`}>{u.role}</span>
              </div>
            )) || <p className="text-sm text-textSecondary">{t('noRecentUsers')}</p>}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card interactive={false}>
          <h2 className="text-lg font-bold text-textPrimary mb-4">{t('recentOrders')}</h2>
          <div className="space-y-3">
            {stats.orders?.recent?.map(o => (
              <div key={o._id} className="flex justify-between items-center border-b border-border/60 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm text-textPrimary">{t('order')} #{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-textMuted">{o.wool_type} – {o.quantity_kg} kg</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                  o.status === 'completed' ? 'bg-primaryLight text-primary'
                  : o.status === 'pending' ? 'bg-warningLight text-warning'
                  : 'bg-background text-textSecondary'
                }`}>
                  {o.status}
                </span>
              </div>
            )) || <p className="text-sm text-textSecondary">{t('noRecentOrders')}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
