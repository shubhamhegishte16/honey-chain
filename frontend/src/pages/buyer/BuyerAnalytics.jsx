import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, IndianRupee, PieChart } from 'lucide-react';
import { getUserOrders } from '../../services/order.service';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerAnalytics() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getUserOrders();
      if (!res.error) setOrders(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="page-shell">
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  // Calculate metrics
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  
  const totalSpent = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.totalAmount || 0) : sum, 0);
  const totalVolume = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.quantityKg || 0) : sum, 0);
  
  // Group by wool type
  const woolTypeStats = orders.reduce((acc, o) => {
    if (o.status !== 'cancelled') {
      acc[o.woolType] = (acc[o.woolType] || 0) + (o.quantityKg || 0);
    }
    return acc;
  }, {});
  
  // Sort wool types by volume
  const topWoolTypes = Object.entries(woolTypeStats).sort((a, b) => b[1] - a[1]);

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div>
          <p className="eyebrow text-primary"><BarChart3 size={13} /> {t('statistics')}</p>
          <h1 className="text-2xl font-extrabold text-textPrimary">{t('purchaseHistoryAnalytics')}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-textSecondary mb-2">
            <IndianRupee size={16} className="text-primary" /> <span className="text-xs font-bold uppercase tracking-wider">{t('totalSpend')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-textPrimary">
            {totalSpent.toFixed(1)}Rs
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-textSecondary mb-2">
            <Package size={16} className="text-primary" /> <span className="text-xs font-bold uppercase tracking-wider">{t('totalVolumeLabel')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-textPrimary">
            {totalVolume} <span className="text-lg text-textMuted">kg</span>
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-textSecondary mb-2">
            <TrendingUp size={16} className="text-primary" /> <span className="text-xs font-bold uppercase tracking-wider">{t('activeOrdersLabel')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-textPrimary">
            {activeOrders.length}
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-textSecondary mb-2">
            <PieChart size={16} className="text-primary" /> <span className="text-xs font-bold uppercase tracking-wider">{t('completedLabel')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-textPrimary">
            {completedOrders.length}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wool Types Breakdown */}
        <Card className="p-6 shadow-sm border border-border">
          <h3 className="font-bold text-textPrimary mb-5">{t('volumeByWoolType')}</h3>
          {topWoolTypes.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-8">{t('noPurchaseData')}</p>
          ) : (
            <div className="space-y-4">
              {topWoolTypes.map(([type, volume], index) => {
                const percentage = Math.round((volume / totalVolume) * 100);
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-textPrimary">{type}</span>
                      <span className="text-textSecondary">{volume} kg ({percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%`, opacity: 1 - (index * 0.2) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Purchases List */}
        <Card className="p-6 shadow-sm border border-border flex flex-col">
          <h3 className="font-bold text-textPrimary mb-5">{t('recentActivity')}</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-8">{t('noRecentOrdersFound')}</p>
          ) : (
            <div className="space-y-4 flex-1">
              {orders.slice(0, 5).map(order => (
                <div key={order.id || order._id} className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-textPrimary">{order.woolType} <span className="font-normal text-textSecondary">({order.quantityKg} kg)</span></p>
                    <p className="text-xs text-textMuted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-textPrimary">₹{order.totalAmount?.toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-bold text-primary mt-0.5">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
