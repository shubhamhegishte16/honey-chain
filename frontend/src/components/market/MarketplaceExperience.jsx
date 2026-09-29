import { useEffect, useState } from 'react';
import { Filter, MapPin, Search, ShoppingBag, Sparkles, Tag, ChevronRight, Bookmark, ShieldCheck, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getListings } from '../../services/marketplace.service';
import { addSavedListing } from '../../services/auth.service';
import { INDIAN_STATES, WOOL_TYPES } from '../../constants/states';
import { useLanguage } from '../../context/LanguageContext';

export default function MarketplaceExperience({ allowBuying = false }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [woolType, setWoolType] = useState('');

  const load = async () => {
    setLoading(true);
    const result = await getListings({
      state: state || undefined,
      woolType: woolType || undefined,
      search: search || undefined
    });
    setListings(result.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [state, woolType]);
  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="page-shell marketplace-page">
      
      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-[#281D1C] text-white p-6 sm:p-10 shadow-soft-lg mb-6">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4B345]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4B345] border border-white/15 text-xs font-bold backdrop-blur-md mb-3">
              <ShieldCheck size={14} /> Direct from Verified KVIC Beekeepers
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight leading-tight text-white">
              Procure Pure Raw Honey with Blockchain Provenance
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Discover certified single-origin lots directly from beekeepers and KVIC clusters with verified NMR lab certificates.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Search & Controls ─── */}
      <section className="flex flex-col sm:flex-row items-stretch gap-3 mb-8 animate-fade-in">
        <div className="flex items-center gap-2.5 flex-1 min-h-[46px] px-4 rounded-full border border-[#E8E3CF] bg-white text-[#5E524D] focus-within:border-[#F4B345] shadow-soft">
          <Search size={16} className="text-[#9B918B] shrink-0" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search honey variety, state, or apiary..."
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#281D1C] placeholder:text-[#9B918B]"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
          <select
            value={state}
            onChange={event => setState(event.target.value)}
            className="min-h-[46px] px-4 py-2 rounded-full border border-[#E8E3CF] bg-white text-xs font-bold text-[#281D1C] focus:outline-none focus:border-[#F4B345] shadow-soft cursor-pointer truncate"
          >
            <option value="">All States</option>
            {INDIAN_STATES.map(item => <option key={item.code} value={item.name}>{item.name}</option>)}
          </select>

          <select
            value={woolType}
            onChange={event => setWoolType(event.target.value)}
            className="min-h-[46px] px-4 py-2 rounded-full border border-[#E8E3CF] bg-white text-xs font-bold text-[#281D1C] focus:outline-none focus:border-[#F4B345] shadow-soft cursor-pointer truncate"
          >
            <option value="">All Honey Varieties</option>
            {WOOL_TYPES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      {/* ─── Listings Grid ─── */}
      <section>
        <div className="section-heading mb-4">
          <div>
            <span className="eyebrow"><ShoppingBag size={13} /> Active Mandi Catalog</span>
            <h2 className="text-xl font-bold font-serif text-[#281D1C]">
              {loading ? 'Finding certified honey lots…' : `${listings.length} Pure Honey Lots Available`}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
            <span className="text-xs font-bold text-[#5E524D]">Loading verified honey lots...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
            <Search size={32} className="mx-auto text-[#C06E30] mb-2" />
            <h3 className="font-bold font-serif text-lg text-[#281D1C]">No Honey Lots Found</h3>
            <p className="text-xs text-[#5E524D] mt-1">Try adjusting your search terms or state filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="group rounded-3xl bg-white border border-[#E8E3CF] overflow-hidden shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
                onClick={() => allowBuying && navigate(`/buyer/marketplace/${listing.id}`)}
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#FEF6E4] overflow-hidden">
                    <img
                      src={listing.image_url || listing.imageUrl || '/honey-hero.jpg'}
                      alt={listing.floralSource || listing.wool_type || 'Pure Honey'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#281D1C]/80 text-[#F4B345] text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <Scale size={11} /> {listing.quantity_kg} kg Available
                    </span>

                    {allowBuying && (
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          await addSavedListing(listing.id);
                        }} 
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-[#281D1C] shadow-sm transition-colors"
                        title="Save Honey Lot"
                      >
                        <Bookmark size={15} />
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#861C1C] bg-[#FBEBEB] px-2.5 py-0.5 rounded-full border border-[#861C1C]/20">
                          NMR Certified Pure
                        </span>
                        <h3 className="font-bold font-serif text-lg text-[#281D1C] mt-2 group-hover:text-[#861C1C] transition-colors">
                          {listing.floralSource || listing.wool_type || 'Raw Blossom Honey'}
                        </h3>
                        <p className="text-xs text-[#5E524D] mt-0.5 flex items-center gap-1">
                          <MapPin size={12} className="text-[#C06E30]" /> {listing.district}, {listing.state}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#281D1C] font-serif">
                          ₹{listing.price_per_kg}
                        </span>
                        <span className="text-xs text-[#5E524D] block">/ kg</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E3CF] text-xs text-[#5E524D] flex items-center justify-between">
                      <span>Seller: <strong className="text-[#281D1C]">{listing.seller_name || 'KVIC Beekeeper'}</strong></span>
                    </div>
                  </div>
                </div>

                {allowBuying && (
                  <div className="px-5 pb-5 pt-1">
                    <span className="w-full py-2.5 rounded-full bg-[#FAF7EE] border border-[#E8E3CF] text-xs font-bold text-[#861C1C] flex items-center justify-center gap-1 group-hover:bg-[#861C1C] group-hover:text-white transition-all">
                      <span>Inspect Lot &amp; Order</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
