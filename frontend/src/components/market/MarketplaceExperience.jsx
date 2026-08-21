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
      <section className="market-hero animate-enter">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> {t('directFromVerified', 'Direct from verified producers')}</p>
          <h1>{t('findWoolProvenStory', 'Find wool with a proven story.')}</h1>
          <p>{t('discoverTraceableLots', 'Discover traceable lots from growers and cooperatives across India.')}</p>
        </div>
        <Tag className="market-hero-icon" size={100} />
      </section>

      <section className="market-controls animate-enter delay-1">
        <div className="search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={t('searchWoolStateProducer', 'Search wool, state or producer')}
          />
        </div>
        <div className="filter-row">
          <span><Filter size={15} /> {t('filter', 'Filter')}</span>
          <select value={state} onChange={event => setState(event.target.value)}>
            <option value="">{t('allStates', 'All states')}</option>
            {INDIAN_STATES.map(item => <option key={item.code} value={item.name}>{item.name}</option>)}
          </select>
          <select value={woolType} onChange={event => setWoolType(event.target.value)}>
            <option value="">{t('allWoolTypes', 'All wool types')}</option>
            {WOOL_TYPES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="mt-7">
        <div className="section-heading">
          <div>
            <p className="eyebrow text-primary"><ShoppingBag size={14} /> {t('availableToday', 'Available today')}</p>
            <h2>{loading ? t('findingBestLots', 'Finding the best lots…') : `${listings.length} ${t('lotsAvailable', 'wool lots available')}`}</h2>
          </div>
        </div>

        {loading ? (
          <div className="loader-stage">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : listings.length === 0 ? (
          <Card className="empty-state">
            <Search size={28} />
            <h3>{t('noListingsFound', 'No listings found.')}</h3>
            <p>{t('noListingsMatchFilters', 'Try a different search or remove a filter to discover more lots.')}</p>
          </Card>
        ) : (
          <div className="listing-grid">
            {listings.map(listing => (
              <Card
                key={listing.id}
                className={`listing-card group ${allowBuying ? 'cursor-pointer hover:border-primary/40' : ''}`}
                onClick={() => allowBuying && navigate(`/buyer/marketplace/${listing.id}`)}
              >
                <div className="listing-image">
                  <img
                    src={listing.image_url || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=70'}
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
                      <h3>{listing.wool_type} {t('wool', 'wool')}</h3>
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
