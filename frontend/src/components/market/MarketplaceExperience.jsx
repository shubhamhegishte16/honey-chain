import { useEffect, useState } from 'react';
import { Filter, MapPin, Search, ShoppingBag, Sparkles, Tag, ChevronRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
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
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1c3e27] via-[#2a5035] to-[#3f6b3f] text-white p-4 sm:p-8 shadow-md animate-fade-in-down">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 border border-white/15 text-[11px] font-semibold mb-2">
              <img src="/logo.png" alt="Emblem" className="h-3.5 w-3.5 object-contain rounded-full" />
              <span>{t('directFromVerified', 'Direct from verified producers')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Find pure raw honey with verifiable blockchain origin.
            </h1>
            <p className="hidden sm:block mt-1 text-xs sm:text-sm text-white/80 max-w-lg">
              Discover certified single-origin lots directly from beekeepers and KVIC clusters across India.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 flex flex-col sm:flex-row items-stretch gap-2.5 animate-fade-in-up delay-1">
        <div className="flex items-center gap-2 flex-1 min-h-[44px] px-3.5 rounded-xl border border-border bg-surface text-textSecondary focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 shadow-xs">
          <Search size={16} className="text-textMuted shrink-0" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search honey variety, state, or apiary..."
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-textPrimary placeholder:text-textMuted"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <select
            value={state}
            onChange={event => setState(event.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-textPrimary focus:outline-none focus:border-primary shadow-xs cursor-pointer truncate"
          >
            <option value="">{t('allStates', 'All states')}</option>
            {INDIAN_STATES.map(item => <option key={item.code} value={item.name}>{item.name}</option>)}
          </select>
          <select
            value={woolType}
            onChange={event => setWoolType(event.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-textPrimary focus:outline-none focus:border-primary shadow-xs cursor-pointer truncate"
          >
            <option value="">All honey varieties</option>
            {WOOL_TYPES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="mt-7 animate-fade-in-up delay-2">
        <div className="section-heading">
          <div>
            <p className="eyebrow text-primary"><ShoppingBag size={14} /> Available Today</p>
            <h2>{loading ? 'Finding certified honey lots…' : `${listings.length} pure honey lots available`}</h2>
          </div>
        </div>

        {loading ? (
          <div className="listing-grid">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-skeleton-pulse">
                <div className="h-44 bg-border/40 -mx-4 -mt-4 mb-4 rounded-t-xl" />
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-border/40 rounded w-2/3" />
                    <div className="h-4 bg-border/20 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-border/40 rounded w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <Card className="empty-state animate-fade-in-up">
            <Search size={28} />
            <h3>{t('noListingsFound', 'No listings found.')}</h3>
            <p className="hidden sm:block">{t('noListingsMatchFilters', 'Try a different search or remove a filter to discover more lots.')}</p>
          </Card>
        ) : (
          <div className="listing-grid">
            {listings.map((listing, index) => (
              <Card
                key={listing.id}
                className={`listing-card group ${allowBuying ? 'cursor-pointer hover:border-primary/40' : ''} animate-fade-in-up delay-${Math.min(index + 1, 6)}`}
                onClick={() => allowBuying && navigate(`/buyer/marketplace/${listing.id}`)}
              >
                <div className="listing-image">
                  <img
                    src={(listing.imageUrl || listing.image_url)?.includes('unsplash') ? '/wool-placeholder.jpg' : (listing.imageUrl || listing.image_url || '/wool-placeholder.jpg')}
                    alt={listing.wool_type}
                  />
                  <span>{listing.quantity_kg} kg {t('available', 'available')}</span>
                  {allowBuying && (
                    <button 
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        const btn = e.currentTarget;
                        const icon = btn.querySelector('svg');
                        icon.classList.add('text-primary', 'fill-primary');
                        await addSavedListing(listing.id);
                      }} 
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/50 hover:bg-white text-textPrimary shadow-sm transition-colors"
                      title="Save Listing"
                    >
                      <Bookmark size={16} />
                    </button>
                  )}
                </div>
                <div className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-base text-textPrimary">{listing.floralSource || listing.wool_type || 'Raw Blossom'} Honey</h3>
                      <p className="listing-location"><MapPin size={13} />{listing.district}, {listing.state}</p>
                    </div>
                    <strong>₹{listing.price_per_kg}<small>/{t('kg', 'kg')}</small></strong>
                  </div>
                  <div className="mt-3 text-xs text-textSecondary flex justify-between items-center">
                    <span>{t('seller', 'Seller')}: {listing.seller_name || t('fromVerifiedProducer', 'a verified producer')}</span>
                  </div>
                  {allowBuying && (
                    <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                       <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t('viewDetails', 'View Details')} <ChevronRight size={14}/>
                       </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
