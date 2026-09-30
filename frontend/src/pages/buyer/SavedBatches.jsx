import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, Trash2, Sparkles, MapPin, Scale, ChevronRight, ShoppingBag, ShieldCheck } from 'lucide-react';
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
            <span>KVIC Mandi • Shortlisted Lots</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Saved Honey Lots ({listings.length})
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Bookmarked monofloral and raw forest honey lots ready for quality inspection or contract procurement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/buyer/marketplace')}
            className="btn-burgundy text-xs flex items-center gap-1.5"
          >
            <Search size={14} /> Explore More Lots
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
          <span className="text-xs font-bold text-deepBrown/60">Loading your saved honey lots...</span>
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
          {listings.map(listing => {
            const lotId = listing._id || listing.id;
            const floral = listing.floralSource || listing.title || 'Mustard Blossom';
            const price = listing.pricePerKg ?? listing.price_per_kg ?? 450;
            const qty = listing.availableQuantityKg ?? listing.quantityKg ?? listing.quantity_kg ?? 100;
            const seller = listing.seller?.name || listing.sellerName || listing.seller_name || 'KVIC Bee Producer Co-op';
            const state = listing.state || listing.origin?.state || 'Rajasthan';
            const district = listing.district || listing.origin?.district || 'Bharatpur';
            const image = listing.imageUrl || listing.image_url || '/honey-hero.jpg';

            return (
              <div
                key={lotId}
                className="group rounded-3xl bg-white border border-[#E8E3CF] overflow-hidden shadow-card hover:shadow-card-hover hover:border-[#D6CEB5] transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#FEF6E4] overflow-hidden cursor-pointer" onClick={() => navigate(`/buyer/marketplace/${lotId}`)}>
                    <img
                      src={image}
                      alt={floral}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#281D1C]/80 text-[#F4B345] text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <Scale size={11} /> {qty} kg Available
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(lotId);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-rose-50 text-rose-700 shadow-sm transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-5 cursor-pointer" onClick={() => navigate(`/buyer/marketplace/${lotId}`)}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#861C1C] bg-[#FBEBEB] px-2.5 py-0.5 rounded-full border border-[#861C1C]/20">
                          NMR Certified Pure
                        </span>
                        <h3 className="font-bold font-serif text-lg text-[#281D1C] mt-2 group-hover:text-[#861C1C] transition-colors">
                          {floral} Honey
                        </h3>
                        <p className="text-xs text-[#5E524D] mt-0.5 flex items-center gap-1">
                          <MapPin size={12} className="text-[#C06E30]" /> {district}, {state}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#281D1C] font-serif">
                          ₹{price}
                        </span>
                        <span className="text-xs text-[#5E524D] block">/ kg</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E3CF] text-xs text-[#5E524D] flex items-center justify-between">
                      <span>Seller: <strong className="text-[#281D1C]">{seller}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/buyer/checkout/${lotId}`)}
                    className="flex-1 py-2.5 rounded-full bg-[#861C1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#861C1C]/90 transition-all shadow-xs"
                  >
                    <ShoppingBag size={13} />
                    <span>Order Now</span>
                  </button>
                  <button
                    onClick={() => navigate(`/buyer/marketplace/${lotId}`)}
                    className="py-2.5 px-4 rounded-full bg-[#FAF7EE] border border-[#E8E3CF] text-xs font-bold text-[#281D1C] hover:bg-[#E8E3CF] transition-all"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
