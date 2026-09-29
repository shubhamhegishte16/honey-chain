import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, IndianRupee, PieChart, Sparkles, ShieldCheck } from 'lucide-react';
import { getBuyerAnalytics } from '../../services/order.service';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerAnalytics() {
  const { t } = useLanguage();
  const [data, setData] = useState({
    completedOrders: [],
    activeOrders: [],
    totalSpent: 0,
    totalVolume: 0,
    topWoolTypes: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getBuyerAnalytics();
      if (!res.error && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="max-w-[92rem] mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
      </main>
    );
  }

  const { completedOrders = [], activeOrders = [], totalSpent = 0, totalVolume = 0, topWoolTypes = [], recentOrders = [] } = data;

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Procurement Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('purchaseHistoryAnalytics')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Audit your institutional honey intake, average price per kg, floral variety distribution, and supplier reliability.
          </p>
        </div>
      </div>

      {/* Bento Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-deepBrown/70 mb-2">
            <IndianRupee size={16} className="text-burgundy" /> 
            <span className="text-xs font-bold uppercase tracking-wider">{t('totalSpend')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-deepBrown">
            ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-deepBrown/70 mb-2">
            <Package size={16} className="text-burgundy" /> 
            <span className="text-xs font-bold uppercase tracking-wider">{t('totalVolumeLabel')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-deepBrown">
            {totalVolume} <span className="text-sm font-sans font-normal text-deepBrown/60">kg</span>
          </p>
        </div>

        <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-deepBrown/70 mb-2">
            <TrendingUp size={16} className="text-burgundy" /> 
            <span className="text-xs font-bold uppercase tracking-wider">{t('activeOrdersLabel')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-deepBrown">
            {Array.isArray(activeOrders) ? activeOrders.length : activeOrders}
          </p>
        </div>

        <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-deepBrown/70 mb-2">
            <PieChart size={16} className="text-burgundy" /> 
            <span className="text-xs font-bold uppercase tracking-wider">{t('completedLabel')}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-deepBrown">
            {Array.isArray(completedOrders) ? completedOrders.length : completedOrders}
          </p>
        </div>
      </div>

      {/* Grid: Floral Varieties + Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Honey Varieties Breakdown */}
        <div className="bento-card p-6 md:p-8 space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('volumeByWoolType')}</h3>
          {topWoolTypes.length === 0 ? (
            <p className="text-xs text-deepBrown/60 text-center py-8">{t('noPurchaseData')}</p>
          ) : (
            <div className="space-y-4 pt-2">
              {topWoolTypes.map(([type, volume], index) => {
                const percentage = totalVolume > 0 ? Math.round((volume / totalVolume) * 100) : 0;
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-deepBrown">
                      <span>{type || 'Raw Blossom'} Honey</span>
                      <span className="font-mono">{volume} kg ({percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-border/60 overflow-hidden">
                      <div 
                        className="h-full bg-burgundy rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security & Assurance */}
        <div className="bento-card p-6 md:p-8 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-deepBrown mb-2">Blockchain Quality Guarantee</h3>
            <p className="text-xs text-deepBrown/70 leading-relaxed">
              100% of lots procured through the Honey Chain exchange come with cryptographic Merkle root proofs of NMR purity, moisture assay below 18%, and geofenced hive origin.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-honeyGold/10 border border-honeyGold/30 flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-deepBrown">FSSAI & KVIC Regulatory Standard</p>
              <p className="text-[11px] text-deepBrown/70">Meets BIS-4941 & Export Inspection Council norms.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}