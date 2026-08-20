import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getListingById, placeOrder } from '../../services/marketplace.service';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

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
        setError(res.error.message || 'Failed to load listing.');
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
      setError('Please fill in all required delivery fields.');
      return;
    }
    if (quantity < 1 || quantity > (listing?.quantity_kg || 0)) {
      setError('Invalid quantity.');
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
      setError(res.error.message || 'Order placement failed. Please try again.');
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
      <main className="page-shell">
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="page-shell">
        <div className="p-8 text-center rounded-3xl bg-rose-50 text-rose-800 border border-rose-200 mt-10">
          <AlertCircle size={32} className="mx-auto mb-3" />
          <h3 className="font-bold text-lg">Listing Unavailable</h3>
          <p className="mt-1 text-sm">{error || 'Could not load listing for checkout.'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-rose-100 rounded-lg text-sm font-semibold hover:bg-rose-200">Go Back</button>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="page-shell">
        <div className="p-12 text-center rounded-3xl bg-emerald-50 border border-emerald-200 mt-10 animate-enter">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-600" />
          <h2 className="text-2xl font-extrabold text-emerald-800">Order Placed!</h2>
          <p className="mt-2 text-sm text-emerald-700">Your order has been successfully placed. Redirecting to order details...</p>
        </div>
      </main>
    );
  }

  const total = listing.price_per_kg * quantity;

  return (
    <main className="page-shell max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
        <ArrowLeft size={16} /> Back to Listing
      </button>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Delivery Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
              <h3 className="font-bold text-textPrimary mb-4">Order Summary</h3>
              <div className="flex items-center gap-4">
                <img
                  src={listing.image_url || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=200&auto=format&fit=crop&q=70'}
                  alt={listing.wool_type}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-textPrimary">{listing.wool_type} Wool</p>
                  <p className="text-xs text-textSecondary">{listing.seller_name} • {listing.location?.district || listing.district}</p>
                  <p className="text-sm font-bold text-emerald-700 mt-1">₹{listing.price_per_kg}/kg</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/60">
                <label className="block text-sm font-semibold text-textPrimary mb-2">Quantity (kg)</label>
                <div className="flex items-center rounded-xl border border-border overflow-hidden w-40">
                  <button type="button" onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="px-3 py-2 bg-background hover:bg-border/50 font-bold">-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 1;
                      if (v > 0 && v <= listing.quantity_kg) setQuantity(v);
                    }}
                    className="w-full text-center font-bold focus:outline-none"
                    min="1" max={listing.quantity_kg}
                  />
                  <button type="button" onClick={() => quantity < listing.quantity_kg && setQuantity(quantity + 1)} className="px-3 py-2 bg-background hover:bg-border/50 font-bold">+</button>
                </div>
                <p className="text-[11px] text-textMuted mt-1">Max available: {listing.quantity_kg} kg</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
              <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-primary" /> Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-textSecondary mb-1">Street Address</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="House/building, street name" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1">State *</label>
                  <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1">District *</label>
                  <input type="text" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1">PIN Code</label>
                  <input type="text" value={address.pinCode} onChange={(e) => setAddress({ ...address, pinCode: e.target.value })} placeholder="6-digit PIN" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1">Contact Phone *</label>
                  <input type="tel" value={address.contactPhone} onChange={(e) => setAddress({ ...address, contactPhone: e.target.value })} required placeholder="10-digit mobile" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-textSecondary mb-1">Delivery Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" placeholder="Any special instructions..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
            </div>
          </div>

          {/* Right: Price Summary */}
          <div>
            <div className="p-6 rounded-2xl bg-surface border border-primary/20 shadow-card-lg sticky top-24">
              <h3 className="font-bold text-textPrimary mb-4">Price Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-textSecondary">Price per kg</span><span className="font-semibold text-textPrimary">₹{listing.price_per_kg}</span></div>
                <div className="flex justify-between"><span className="text-textSecondary">Quantity</span><span className="font-semibold text-textPrimary">{quantity} kg</span></div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-textPrimary">Total</span>
                  <span className="text-2xl font-black text-textPrimary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primaryDark transition-all shadow-md active:scale-95 disabled:opacity-60"
              >
                {submitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Confirm Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
