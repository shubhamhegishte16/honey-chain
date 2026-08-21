import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../../services/marketplace.service';
import { ShoppingBag, MapPin, Sparkles, AlertCircle, ArrowLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getListingById(id);
      if (res.error) {
        setError(res.error.message || t('couldNotLoadListing'));
      } else {
        setListing(res.data);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <main className="page-shell">
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="page-shell">
        <div className="p-8 text-center rounded-3xl bg-rose-50 text-rose-800 border border-rose-200 mt-10">
          <AlertCircle size={32} className="mx-auto mb-3" />
          <h3 className="font-bold text-lg">{t('listingUnavailable')}</h3>
          <p className="mt-1 text-sm">{error || t('listingNotFound')}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-rose-100 rounded-lg text-sm font-semibold hover:bg-rose-200">
            {t('goBack')}
          </button>
        </div>
      </main>
    );
  }

  const handleCheckout = () => {
    navigate(`/buyer/checkout/${listing.id}`, { state: { quantity } });
  };

  const handleQuantityChange = (delta) => {
    const newQ = quantity + delta;
    if (newQ > 0 && newQ <= listing.quantity_kg) {
      setQuantity(newQ);
    }
  };

  return (
    <main className="page-shell max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
        <ArrowLeft size={16} /> {t('backToMarketplace')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl overflow-hidden shadow-sm border border-border">
            <img 
              src={listing.image_url || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1200&auto=format&fit=crop&q=80'} 
              alt={listing.wool_type} 
              className="w-full h-64 object-cover"
            />
            <div className="p-6 sm:p-8 bg-surface">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary">{listing.wool_type} Wool</h1>
                  <p className="text-textSecondary flex items-center gap-1.5 mt-2">
                    <MapPin size={15} className="text-primary" /> {listing.location?.district || listing.district}, {listing.location?.state || listing.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-700">₹{listing.price_per_kg}</p>
                  <p className="text-sm font-medium text-textMuted uppercase tracking-wider">{t('perKg')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm">
              <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-primary" /> {t('qualitySummary')}
              </h3>
              <ul className="space-y-3 text-sm text-textSecondary">
                <li className="flex justify-between border-b border-border/50 pb-2">
                  <span>{t('gradeLabel')}</span> <strong className="text-textPrimary">{listing.grade || t('standard')}</strong>
                </li>
                <li className="flex justify-between border-b border-border/50 pb-2">
                  <span>{t('micronEstimate')}</span> <strong className="text-textPrimary">22µ - 24µ</strong>
                </li>
                <li className="flex justify-between border-b border-border/50 pb-2">
                  <span>{t('stapleLength')}</span> <strong className="text-textPrimary">70mm</strong>
                </li>
                <li className="flex justify-between border-b border-border/50 pb-2">
                  <span>{t('condition')}</span> <strong className="text-textPrimary">{t('scoured')}</strong>
                </li>
              </ul>
              <p className="mt-4 text-[10px] uppercase font-bold text-textMuted text-center bg-background py-1.5 rounded-lg border border-border/50">{t('aiPreScreening')}</p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm">
              <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-primary" /> {t('producerInfo')}
              </h3>
              <div className="space-y-1 text-sm text-textSecondary">
                <p className="font-bold text-textPrimary text-base">{listing.seller_name}</p>
                <p>{t('verifiedPastoralist')}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{t('memberSince2026')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Action Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-primary/20 shadow-card-lg sticky top-24">
            
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm font-semibold text-textPrimary mb-1">{t('availableQuantity')}</p>
              <p className="text-2xl font-bold text-primary">{listing.quantity_kg} kg</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-textPrimary mb-2">{t('orderQuantityKg')}</label>
              <div className="flex items-center rounded-xl border border-border overflow-hidden">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  disabled={quantity <= 1}
                  className="px-4 py-2.5 bg-background hover:bg-border/50 disabled:opacity-50 font-bold"
                >-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if(val > 0 && val <= listing.quantity_kg) setQuantity(val);
                  }}
                  className="w-full text-center font-bold text-lg focus:outline-none"
                  min="1" max={listing.quantity_kg}
                />
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  disabled={quantity >= listing.quantity_kg}
                  className="px-4 py-2.5 bg-background hover:bg-border/50 disabled:opacity-50 font-bold"
                >+</button>
              </div>
            </div>

            <div className="mb-6 flex justify-between items-end">
              <span className="text-sm font-semibold text-textSecondary">{t('total')}</span>
              <span className="text-3xl font-black text-textPrimary">₹{(listing.price_per_kg * quantity).toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primaryDark transition-all shadow-md active:scale-95"
            >
              <ShoppingBag size={18} />
              {t('proceedToCheckout')}
            </button>

            <button 
              onClick={() => listing.batch && navigate(`/buyer/wool-passport/${typeof listing.batch === 'object' ? listing.batch._id : listing.batch}`)}
              className="mt-3 w-full flex items-center justify-center gap-2 px-6 py-4 bg-primaryLight/50 text-primary rounded-xl font-bold hover:bg-primaryLight transition-all border border-primary/10"
            >
              <Sparkles size={16} />
              {t('viewWoolPassport')}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
