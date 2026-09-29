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

  const strokeColor = rising ? '#2E7D32' : '#861C1C';
  const fillColor = rising ? 'rgba(46, 125, 50, 0.12)' : 'rgba(134, 28, 28, 0.12)';

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
          <span className="eyebrow"><Sparkles size={13} /> APMC Benchmark Rates</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#281D1C] mt-1">
            National Honey Mandi Rates
          </h1>
          <p className="text-xs sm:text-sm text-[#5E524D] mt-1">
            Real-time APMC wholesale and KVIC benchmark prices for monofloral raw honey lots across India.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#281D1C] hover:bg-[#FAF7EE] shadow-soft transition-all"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Rates</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
          <span className="text-xs font-bold text-[#5E524D]">Loading live APMC Mandi rates...</span>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          
          {/* ─── Featured Selected Rate Card ─── */}
          {selected && (
            <div className="rounded-3xl bg-white border border-[#E8E3CF] p-6 sm:p-8 shadow-card relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FBEBEB] text-[#861C1C] border border-[#861C1C]/20">
                      {selected.floralSource || selected.wool_type || 'Mustard Blossom Honey'}
                    </span>
                    <span className="text-xs font-semibold text-[#5E524D] flex items-center gap-1">
                      <MapPin size={12} className="text-[#C06E30]" /> Region: {selected.state}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#281D1C] font-serif">
                      ₹{selected.price_per_kg}
                    </span>
                    <span className="text-sm font-semibold text-[#5E524D]">/ kg</span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        Number(selected.change_percent || 0) >= 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {Number(selected.change_percent || 0) >= 0 ? (
                        <TrendingUp size={13} />
                      ) : (
                        <TrendingDown size={13} />
                      )}
                      <span>
                        {Number(selected.change_percent || 0) >= 0 ? '+' : ''}
                        {selected.change_percent}% 14-Day Mandi Trend
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-between self-stretch">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B] mb-2">
                    Price Trendline
                  </span>
                  <Sparkline
                    history={selected.history}
                    rising={Number(selected.change_percent || 0) >= 0}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── Search & State Filters ─── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B918B]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by state or honey variety..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E8E3CF] bg-white text-xs sm:text-sm text-[#281D1C] placeholder:text-[#9B918B] focus:outline-none focus:ring-2 focus:ring-[#F4B345]/30 focus:border-[#F4B345] shadow-soft"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {uniqueStates.map(st => (
                <button
                  key={st}
                  onClick={() => setFilterState(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    filterState === st
                      ? 'bg-[#861C1C] text-white shadow-burgundy font-bold'
                      : 'bg-white border border-[#E8E3CF] text-[#5E524D] hover:border-[#D6CEB5]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* ─── State-wise Prices Grid ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map(p => {
              const isSelected =
                selected?.state === p.state && selected?.wool_type === p.wool_type;
              const isRising = Number(p.change_percent || 0) >= 0;

              return (
                <div
                  key={`${p.state}-${p.wool_type}`}
                  onClick={() => setSelected(p)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#861C1C] bg-[#FBEBEB]/40 ring-2 ring-[#861C1C]/20 shadow-card'
                      : 'border-[#E8E3CF] bg-white hover:border-[#F4B345] hover:shadow-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold font-serif text-base text-[#281D1C]">{p.state}</p>
                      <p className="text-xs text-[#5E524D] mt-0.5">{p.floralSource || p.wool_type || 'Raw Honey'}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isRising ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isRising ? '+' : ''}
                      {p.change_percent}%
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8E3CF] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold font-serif text-[#281D1C]">
                        ₹{p.price_per_kg}
                      </span>
                      <span className="text-xs text-[#5E524D]"> /kg</span>
                    </div>
                    <span className="text-xs font-bold text-[#861C1C] inline-flex items-center gap-0.5">
                      Inspect Trend →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── Mandi Bulletins ─── */}
          {news.length > 0 && (
            <div className="pt-6 border-t border-[#E8E3CF]">
              <div className="section-heading mb-4">
                <div>
                  <span className="eyebrow"><Newspaper size={13} /> Market Intelligence</span>
                  <h2 className="text-xl font-bold font-serif text-[#281D1C]">Honey Mandi Bulletins</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold font-serif text-sm sm:text-base text-[#281D1C] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#5E524D] mt-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E3CF] flex items-center justify-between text-xs text-[#9B918B]">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="font-bold text-[#861C1C]">{item.source}</span>
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
