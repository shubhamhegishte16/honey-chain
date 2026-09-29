import { useEffect, useState } from 'react';
import { Search, MapPin, Scale, Store, Sparkles, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getListings, placeOrder } from '../../services/marketplace.service';
import { INDIAN_STATES, WOOL_TYPES } from '../../constants/states';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function MarketplaceBrowser({ allowBuying = false }) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [woolType, setWoolType] = useState('');
  const [buyingId, setBuyingId] = useState(null);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await getListings({
      state: state || undefined,
      woolType: woolType || undefined,
      search: search || undefined
    });
    setListings(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [state, woolType]);

  useEffect(() => {
    const tTimer = setTimeout(load, 300);
    return () => clearTimeout(tTimer);
  }, [search]);

  async function handleBuy(listingId) {
    setBuyingId(listingId);
    setMessage('');
    const { error } = await placeOrder({ listingId, buyerId: profile?.id });
    setBuyingId(null);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage(t('orderPlacedSuccess', 'Order placed successfully!'));
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      
      <div className="mb-6">
        <span className="eyebrow"><Store size={13} /> Honey Mandi Catalog</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#281D1C] mt-1">
          Pure Honey Listings
        </h1>
        <p className="text-xs text-[#5E524D] mt-1">Procure authenticated honey lots directly from certified beekeepers.</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B918B]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by honey variety, state, or apiary..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E8E3CF] bg-white text-xs sm:text-sm text-[#281D1C] placeholder:text-[#9B918B] focus:outline-none focus:ring-2 focus:ring-[#F4B345]/30 focus:border-[#F4B345] shadow-soft"
          />
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1">
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#E8E3CF] bg-white text-xs font-bold text-[#281D1C] focus:outline-none focus:border-[#F4B345] shadow-soft cursor-pointer truncate"
          >
            <option value="">All States</option>
            {INDIAN_STATES.map(s => (
              <option key={s.code} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          
          <select
            value={woolType}
            onChange={e => setWoolType(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#E8E3CF] bg-white text-xs font-bold text-[#281D1C] focus:outline-none focus:border-[#F4B345] shadow-soft cursor-pointer truncate"
          >
            <option value="">All Honey Varieties</option>
            {WOOL_TYPES.map(w => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message ? (
        <div className="p-3.5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      ) : null}

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
          <span className="text-xs font-bold text-[#5E524D]">Loading honey catalog...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <p className="text-xs text-[#5E524D]">No honey lots match your active filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {listings.map(l => (
            <div key={l.id} className="p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#FEF6E4] mb-3">
                  <img
                    src={l.image_url || l.imageUrl || '/honey-hero.jpg'}
                    alt={l.floralSource || l.wool_type || 'Pure Honey'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#281D1C]/80 text-[#F4B345] text-[10px] font-bold">
                    {l.quantity_kg} kg Lot
                  </span>
                </div>

                <h3 className="font-bold font-serif text-base text-[#281D1C]">{l.floralSource || l.wool_type || 'Raw'} Honey</h3>
                <p className="text-xs text-[#5E524D] mt-0.5 flex items-center gap-1">
                  <MapPin size={12} className="text-[#C06E30]" /> {l.district}, {l.state}
                </p>
                <p className="text-[11px] text-[#9B918B] mt-1">
                  Seller: <strong className="text-[#281D1C]">{l.seller_name || 'KVIC Beekeeper'}</strong>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E3CF]">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-bold font-serif text-lg text-[#281D1C]">₹{l.price_per_kg}<small className="text-xs font-normal text-[#5E524D]"> /kg</small></span>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">NMR Certified</span>
                </div>
                
                {allowBuying && (
                  <button
                    onClick={() => handleBuy(l.id)}
                    disabled={buyingId === l.id}
                    className="w-full py-2.5 rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  >
                    {buyingId === l.id ? 'Placing Order...' : 'Place Procurement Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
