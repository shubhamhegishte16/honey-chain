import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, ShoppingBag, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getListingById, placeOrder } from '../../services/marketplace.service';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [address, setAddress] = useState({
    street: '',
    district: profile?.district || '',
    state: profile?.state || '',
    pinCode: '',
    contactPhone: '',
  });
  const [notes, setNotes] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.district || !address.state || !address.contactPhone) {
      setError(t('fillRequiredFields'));
      return;
    }
    if (quantity < 1 || quantity > (listing?.quantity_kg || 0)) {
      setError(t('invalidQuantity'));
      return;
    }

    setSubmitting(true);
    setError('');
    const res = await placeOrder({
      listingId: id,
      quantityKg: quantity,
      deliveryAddress: address,
      notes,
    });

    if (res.error) {
      setError(res.error.message || t('orderFailedRetry'));
      setSubmitting(false);
    } else {
      setSuccess(true);
      setSubmitting(false);
      const orderId = res.data?.id || res.data?._id;
      setTimeout(() => navigate(`/buyer/orders/${orderId}`), 1500);
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 text-center bento-card text-rose-800">
          <AlertCircle size={36} className="mx-auto mb-3 text-rose-700" />
          <h3 className="font-serif font-bold text-lg">{t('listingUnavailable')}</h3>
          <p className="mt-1 text-xs text-deepBrown/70">{error || t('couldNotLoadListing')}</p>
          <button onClick={() => navigate(-1)} className="mt-5 btn-burgundy text-xs">{t('goBack')}</button>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bento-card p-8 md:p-10 space-y-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-800 mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-deepBrown">Smart Contract Escrow Locked!</h2>
          <p className="text-xs text-deepBrown/70 max-w-md mx-auto">
            Your purchase order has been logged on Honey Chain ledger. Redirecting to your consignment tracker...
          </p>
        </div>
      </main>
    );
  }

  const totalPrice = (listing.price_per_kg || 0) * quantity;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-xs font-bold text-deepBrown/70 hover:text-burgundy transition-colors">
        <ArrowLeft size={16} /> Back to Listing
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bento-card p-6 md:p-8 space-y-6">
            <div className="space-y-1 border-b border-border/80 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
                <Sparkles size={13} className="text-honeyGold" />
                <span>KVIC Mandi Settlement</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-deepBrown">Checkout & Dispatch Order</h1>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">
                  Procurement Volume (kg) <span className="text-deepBrown/50 font-normal">Available: {listing.quantity_kg} kg</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={listing.quantity_kg}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(listing.quantity_kg, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs font-mono font-bold text-deepBrown focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15"
                />
              </div>

              {/* Delivery Details */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-deepBrown uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={15} className="text-burgundy" /> Delivery Destination
                </h3>
                
                <div>
                  <input
                    type="text"
                    placeholder="Warehouse / Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="District / City *"
                    required
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                    className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={address.pinCode}
                    onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                    className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Phone *"
                    required
                    value={address.contactPhone}
                    onChange={(e) => setAddress({ ...address, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <textarea
                    rows="2"
                    placeholder="Consignment delivery instructions (optional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-burgundy text-warmIvory font-bold text-xs rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60"
              >
                {submitting ? 'Locking Escrow Contract…' : `Confirm & Place Order (₹${totalPrice.toLocaleString('en-IN')})`}
              </button>
            </form>
          </div>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="bento-card p-6 space-y-4">
            <h3 className="font-serif font-bold text-deepBrown">Order Summary</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-deepBrown/60">Product</span>
                <span className="font-bold text-deepBrown">{listing.floralSource || listing.wool_type || 'Raw Blossom'} Honey</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-deepBrown/60">Unit Price</span>
                <span className="font-mono font-bold text-deepBrown">₹{listing.price_per_kg} / kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-deepBrown/60">Selected Volume</span>
                <span className="font-mono font-bold text-burgundy">{quantity} kg</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="font-bold text-deepBrown">Total Payable</span>
                <span className="font-mono font-bold text-burgundy">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-honeyGold/10 border border-honeyGold/30 text-[11px] text-deepBrown/80 flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <span>Funds locked in APMC escrow and released upon NMR lab verification.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
