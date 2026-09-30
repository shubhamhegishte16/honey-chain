import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, Trash2, Sparkles, MapPin } from 'lucide-react';
import { getSavedListings, removeSavedListing } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SavedBatches() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getSavedListings();
      if (!res.error) setListings(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleRemove = async (id) => {
    setListings(prev => prev.filter(l => l._id !== id && l.id !== id));
    await removeSavedListing(id);
  };

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Shortlisted Batches</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Saved Honey Lots
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Bookmarked lots ready for quality audit or bulk procurement contracts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : listings.length === 0 ? (
        <div className="p-12 text-center bento-card flex flex-col items-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-4 shadow-md shadow-honeyGold/10">
            <Bookmark size={30} />
          </div>
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('noSavedListings')}</h3>
          <p className="text-xs text-deepBrown/70 max-w-sm mt-1 mb-6">
            {t('browseAndBookmark')}
          </p>
          <button onClick={() => navigate('/buyer/marketplace')} className="btn-burgundy">
            <Search size={15} /> Browse Honey Mandi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing._id || listing.id} className="bento-card bento-card-hover p-6 flex flex-col justify-between space-y-4 group">
              <div onClick={() => navigate(`/buyer/marketplace/${listing._id || listing.id}`)} className="cursor-pointer space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-honeyGold/20 text-burgundy font-bold text-[10px] uppercase">
                  Verified Lot
                </span>
                <h3 className="font-serif font-bold text-base text-deepBrown group-hover:text-burgundy transition-colors">
                  {listing.floralSource || 'Raw Blossom'} Honey
                </h3>
                <p className="text-xs text-deepBrown/60">Seller: <span className="font-semibold text-deepBrown">{listing.seller?.name || listing.seller_name || 'Apiary'}</span></p>
                <div className="pt-2 flex justify-between items-center border-t border-border/60">
                  <span className="font-mono font-bold text-base text-burgundy">₹{listing.pricePerKg || listing.price_per_kg}/kg</span>
                  <span className="text-xs font-mono text-deepBrown/70">{listing.quantityKg || listing.quantity_kg} kg</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(listing._id || listing.id); }}
                className="pt-3 border-t border-border/60 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 transition-colors"
              >
                <Trash2 size={14} /> Remove from Saved
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
