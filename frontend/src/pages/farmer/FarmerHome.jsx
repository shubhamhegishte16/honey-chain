import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/ui/Card';
import PriceCard from '../../components/market/PriceCard';
import BatchCard from '../../components/batch/BatchCard';
import { getBatchesByFarmer, getTotalInventory } from '../../services/batches.service';
import { getAllStatePrices } from '../../services/market.service';

export default function FarmerHome() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [price, setPrice] = useState(null);
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const QUICK_ACTIONS = [
    { label: t('addNewHoney', 'Log Honey Extraction'), icon: '➕', route: '/batches/add' },
    { label: t('sellHoney', 'Sell in Mandi'), icon: '🛒', route: '/farmer/marketplace' },
    { label: t('tracking', 'Lot Tracking'), icon: '📦', route: '/farmer/tracking' },
    { label: t('processing', 'Processing & Bottling'), icon: '🍯', route: '/farmer/tracking' },
  ];

  async function loadData() {
    if (!profile?.id) return;
    const [invResult, priceResult, batchesResult] = await Promise.all([
      getTotalInventory(profile.id),
      getAllStatePrices(),
      getBatchesByFarmer(profile.id),
    ]);
    if (!invResult.error) setInventory(invResult.data);
    if (!priceResult.error && priceResult.data?.length > 0) {
      const stateMatch = priceResult.data.find(p => p.state === profile.state) || priceResult.data[0];
      setPrice(stateMatch);
    }
    if (!batchesResult.error) setRecentBatches((batchesResult.data || []).slice(0, 4));
  }

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [profile?.id]);

  return (
    <div className="page-shell">
      <h1 className="text-2xl font-bold text-textPrimary">
        {t('namaste')}, {profile?.name?.split(' ')[0] || t('farmerFallback', 'Beekeeper')}
      </h1>
      <p className="text-textSecondary text-sm mt-1 mb-4">
        {profile?.district}, {profile?.state}
      </p>

      <Card>
        <p className="text-textSecondary text-[13px]">{t('honeyInventory', 'Active Raw Honey Inventory')}</p>
        <p className="text-3xl font-bold text-textPrimary mt-1">
          {inventory !== null ? `${inventory} kg` : '—'}
        </p>
      </Card>

      {price && (
        <div className="mt-4">
          <PriceCard
            price={price.price_per_kg}
            changePercent={price.change_percent}
            woolType={price.floralSource || price.wool_type}
            state={price.state}
          />
        </div>
      )}

      <h2 className="text-lg font-semibold text-textPrimary mt-8 mb-3">{t('quickActions', 'Quick Actions')}</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {QUICK_ACTIONS.map(a => (
          <button
            key={a.label}
            onClick={() => navigate(a.route)}
            className="bg-surface rounded-lg border border-border p-4 flex flex-col items-center gap-1.5 hover:border-primary transition-colors"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="font-semibold text-[13px] text-center">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 mb-3">
        <h2 className="text-lg font-semibold text-textPrimary">{t('recentBatches', 'Recent Honey Batches')}</h2>
        <button
          onClick={() => navigate('/farmer/tracking')}
          className="text-primary font-semibold text-[13px]"
        >
          {t('seeAll', 'See All')}
        </button>
      </div>

      {!loading && recentBatches.length === 0 && (
        <Card>
          <p className="text-textPrimary">{t('noBatchesYetShort', 'No honey harvest lots recorded yet.')}</p>
          <p className="text-textSecondary text-[13px] mt-1">{t('tapAddHoneyHint', 'Tap Log Honey Extraction to register your first lot.')}</p>
        </Card>
      )}

      {recentBatches.map(b => (
        <BatchCard key={b.id} batch={b} />
      ))}
    </div>
  );
}
