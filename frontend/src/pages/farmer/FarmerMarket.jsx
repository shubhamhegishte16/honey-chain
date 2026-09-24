import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Sparkles,
  Search,
  Filter,
  Newspaper,
  Calendar,
  Layers,
  ArrowUpRight,
  BadgeIndianRupee,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { getAllStatePrices, getMarketNews, getPriceHistory } from '../../services/market.service';
import { useLanguage } from '../../context/LanguageContext';

function Sparkline({ history, rising = true }) {
  if (!history || history.length < 2) return null;
  const prices = history.map(h => Number(h.price || 0));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * 100;
      const y = 32 - ((p - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = rising ? '#3F6B3F' : '#B3422F';
  const fillColor = rising ? 'rgba(63, 107, 63, 0.12)' : 'rgba(179, 66, 47, 0.12)';

  return (
    <div className="w-28 sm:w-36 h-10 flex items-center justify-end">
      <svg viewBox="0 0 100 36" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polygon
          points={`0,36 ${points} 100,36`}
          fill={fillColor}
        />
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function FarmerMarket() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('All');

  async function loadData() {
    setLoading(true);
    try {
      const [priceResult, newsResult] = await Promise.all([
        getAllStatePrices(),
        getMarketNews(4),
      ]);
      const rows = priceResult.data || [];
      const withHistory = await Promise.all(
        rows.map(async r => {
          const h = await getPriceHistory(r.state, r.wool_type);
          return { ...r, history: h.data };
        })
      );
      setPrices(withHistory);
      setNews(newsResult.data || []);
      if (withHistory.length > 0) {
        setSelected(withHistory[0]);
      }
    } catch (e) {
      console.error('Error fetching market prices:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const uniqueStates = ['All', ...new Set(prices.map(p => p.state))];

  const filteredPrices = prices.filter(p => {
    const matchSearch =
      p.wool_type?.toLowerCase().includes(search.toLowerCase()) ||
      p.state?.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === 'All' || p.state === filterState;
    return matchSearch && matchState;
  });

  return (
    <main className="page-shell">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow text-amber-600 mb-1 flex items-center gap-1 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={13} /> Honey Mandi APMC Benchmark Rates
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-textPrimary">
            National Honey Mandi Rates
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Real-time APMC wholesale prices for raw honey varieties across Indian beekeeping states.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-textSecondary hover:text-primary hover:border-primary/40 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Rates</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* ─── Featured Selected Rate Card ─── */}
          {selected && (
            <div className="rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-card-hover relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primaryLight text-primary">
                      {selected.floralSource || selected.wool_type || 'Mustard Blossom Honey'}
                    </span>
                    <span className="text-xs font-semibold text-textMuted flex items-center gap-1">
                      <MapPin size={12} /> {t('region')}: {selected.state}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-textPrimary font-mono">
                      ₹{selected.price_per_kg}
                    </span>
                    <span className="text-sm font-semibold text-textSecondary">/ kg</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        Number(selected.change_percent || 0) >= 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {Number(selected.change_percent || 0) >= 0 ? (
                        <TrendingUp size={13} />
                      ) : (
                        <TrendingDown size={13} />
                      )}
                      <span>
                        {Number(selected.change_percent || 0) >= 0 ? '+' : ''}
                        {selected.change_percent}% {t('fourteenDayTrend')}
                      </span>
                    </span>
                    <span className="text-xs text-textMuted">{t('change')}: {selected.change_percent}%</span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-between self-stretch">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted mb-2">
                    {t('market')}
                  </span>
                  <Sparkline
                    history={selected.history}
                    rising={Number(selected.change_percent || 0) >= 0}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── Search & State Filter Controls ─── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('searchBreedState')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* State Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {uniqueStates.map(st => (
                <button
                  key={st}
                  onClick={() => setFilterState(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    filterState === st
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface border border-border text-textSecondary hover:border-primary/40'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* ─── State-wise Prices Grid ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPrices.map(p => {
              const isSelected =
                selected?.state === p.state && selected?.wool_type === p.wool_type;
              const isRising = Number(p.change_percent || 0) >= 0;

              return (
                <div
                  key={`${p.state}-${p.wool_type}`}
                  onClick={() => setSelected(p)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primaryLight/30 ring-2 ring-primary/30 shadow-sm'
                      : 'border-border/80 bg-surface hover:border-primary/40 hover:shadow-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm text-textPrimary">{p.state}</p>
                      <p className="text-xs text-textSecondary mt-0.5">{p.floralSource || p.wool_type || 'Raw Honey'}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isRising ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isRising ? '+' : ''}
                      {p.change_percent}%
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-textPrimary">
                        ₹{p.price_per_kg}
                      </span>
                      <span className="text-xs text-textSecondary"> /kg</span>
                    </div>
                    <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
                      {t('viewDetailsArrow')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── Mandi Market News & Bulletins ─── */}
          {news.length > 0 && (
            <div className="pt-6 border-t border-border/70">
              <div className="section-heading mb-4">
                <div>
                  <p className="eyebrow text-primary">
                    <Newspaper size={13} /> {t('market')}
                  </p>
                  <h2 className="text-xl font-bold text-textPrimary">{t('mandiBulletins')}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-surface border border-border/80 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-textPrimary leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-textSecondary mt-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-textMuted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="font-semibold text-primary">{item.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
