import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../../services/marketplace.service';
import { addSavedListing, removeSavedListing, getSavedListings } from '../../services/auth.service';
import { ShoppingBag, MapPin, Sparkles, AlertCircle, ArrowLeft, ShieldCheck, ChevronRight, Award, QrCode, Bookmark, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [listing, setListing] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
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
      try {
        const savedRes = await getSavedListings();
        if (savedRes.data && Array.isArray(savedRes.data)) {
          setIsSaved(savedRes.data.some(l => String(l._id || l.id) === String(id)));
        }
      } catch (e) {}
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  const handleToggleSave = async () => {
    if (!listing) return;
    const lotId = String(listing._id || listing.id);
    if (isSaved) {
      setIsSaved(false);
      await removeSavedListing(lotId);
    } else {
      setIsSaved(true);
      await addSavedListing(listing);
    }
  };

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="p-8 text-center bento-card text-rose-800">
          <AlertCircle size={36} className="mx-auto mb-3 text-rose-700" />
          <h3 className="font-serif font-bold text-lg">{t('listingUnavailable')}</h3>
          <p className="mt-1 text-xs text-deepBrown/70">{error || t('listingNotFound')}</p>
          <button onClick={() => navigate(-1)} className="mt-5 btn-burgundy text-xs">
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-xs font-bold text-deepBrown/70 hover:text-burgundy transition-colors">
        <ArrowLeft size={16} /> {t('backToMarketplace')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bento-card overflow-hidden">
            <div className="relative h-72 sm:h-80 overflow-hidden">
              <img 
                src={listing.image_url || listing.imageUrl || '/honey-hero.jpg'}
                alt={listing.floralSource || listing.wool_type || 'Pure Honey'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deepBrown/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <span className="px-3 py-1 rounded-full bg-honeyGold text-deepBrown font-bold text-xs uppercase tracking-wider shadow-sm">
                    KVIC Certified • NMR Tested
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmIvory mt-2">
                    {listing.floralSource || listing.wool_type || 'Raw Blossom'} Honey
                  </h1>
                  <p className="text-warmIvory/80 text-xs flex items-center gap-1.5 mt-1">
                    <MapPin size={13} className="text-honeyGold" /> {listing.location?.district || listing.district || 'Kangra'}, {listing.location?.state || listing.state || 'Himachal Pradesh'}
                  </p>
                </div>
                <div className="text-right bg-warmIvory/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                  <p className="text-2xl font-serif font-bold text-burgundy">₹{listing.price_per_kg}</p>
                  <p className="text-[10px] font-bold text-deepBrown/60 uppercase tracking-wider">{t('perKg')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bento-card p-6 space-y-3">
              <h3 className="font-serif font-bold text-deepBrown flex items-center gap-2">
                <ShieldCheck size={18} className="text-burgundy" /> Quality & Assay Grade
              </h3>
              <div className="space-y-2 text-xs text-deepBrown/80">
                <p><span className="text-deepBrown/50">Moisture Content:</span> <span className="font-mono font-bold text-emerald-700">17.2% (FSSAI Pass)</span></p>
                <p><span className="text-deepBrown/50">HMF Level:</span> <span className="font-mono font-bold text-emerald-700">12.4 mg/kg</span></p>
                <p><span className="text-deepBrown/50">NMR Spectrum:</span> <span className="font-bold text-emerald-700">100% Unadulterated C4/C3</span></p>
                <p><span className="text-deepBrown/50">Harvest Season:</span> <span className="font-semibold text-deepBrown">Spring Blossom 2026</span></p>
              </div>
            </div>

            <div className="bento-card p-6 space-y-3">
              <h3 className="font-serif font-bold text-deepBrown flex items-center gap-2">
                <Award size={18} className="text-burgundy" /> Apiary Provenance
              </h3>
              <div className="space-y-2 text-xs text-deepBrown/80">
                <p><span className="text-deepBrown/50">Beekeeper:</span> <span className="font-bold text-deepBrown">{listing.seller?.name || listing.seller_name || 'Ramesh Thakur'}</span></p>
                <p><span className="text-deepBrown/50">Hive Colony:</span> <span className="font-semibold text-deepBrown">Apis Cerana Indica (48 Boxes)</span></p>
                <p><span className="text-deepBrown/50">Available Lot:</span> <span className="font-mono font-bold text-burgundy">{listing.quantity_kg} kg</span></p>
                <p><span className="text-deepBrown/50">Batch Genesis:</span> <span className="font-mono text-deepBrown/70">#HC2026-00124</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Purchase Card */}
        <div className="space-y-6">
          <div className="bento-card p-6 md:p-8 space-y-6 sticky top-24">
            <h3 className="font-serif font-bold text-lg text-deepBrown">Procure Honey Lot</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">
                Select Quantity (kg)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-5)}
                  className="h-10 w-10 rounded-xl bg-warmIvory border border-border text-deepBrown font-bold text-sm hover:bg-border/60 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={listing.quantity_kg}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(listing.quantity_kg, parseInt(e.target.value) || 1)))}
                  className="flex-1 text-center py-2 bg-warmIvory border border-border rounded-xl text-xs font-mono font-bold text-deepBrown"
                />
                <button
                  onClick={() => handleQuantityChange(5)}
                  className="h-10 w-10 rounded-xl bg-warmIvory border border-border text-deepBrown font-bold text-sm hover:bg-border/60 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-honeyGold/10 border border-honeyGold/25 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-deepBrown/70">Rate</span>
                <span className="font-mono font-bold text-deepBrown">₹{listing.price_per_kg} / kg</span>
              </div>
              <div className="flex justify-between border-t border-honeyGold/20 pt-2 text-sm">
                <span className="font-bold text-deepBrown">Escrow Amount</span>
                <span className="font-mono font-bold text-burgundy">₹{(listing.price_per_kg * quantity).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-burgundy text-warmIvory font-bold text-xs rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Proceed to Escrow Checkout →
            </button>

            <button
              onClick={handleToggleSave}
              className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                isSaved
                  ? 'bg-honeyGold/20 border-honeyGold text-burgundy'
                  : 'bg-warmIvory border-border text-deepBrown/80 hover:bg-border/40'
              }`}
            >
              <Bookmark size={15} className={isSaved ? 'fill-burgundy text-burgundy' : ''} />
              <span>{isSaved ? 'Saved in My Lots' : 'Save Lot to Shortlist'}</span>
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-deepBrown/60">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Direct Bank Escrow Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
