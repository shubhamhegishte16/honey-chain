import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { getSavedListings, removeSavedListing } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function SavedWool() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // In test mode, we might not have a real profile ID for backend auth, 
      // but if the backend accepts it or we mock it, we load.
      setLoading(true);
      const res = await getSavedListings();
      if (!res.error) setListings(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleRemove = async (id) => {
    // Optimistic update
    setListings(prev => prev.filter(l => l._id !== id && l.id !== id));
    await removeSavedListing(id);
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div>
          <p className="eyebrow text-primary"><Bookmark size={13} /> Bookmarks</p>
          <h1 className="text-2xl font-extrabold text-textPrimary">Saved Wool</h1>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : listings.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3">
            <Bookmark size={28} />
          </span>
          <h3 className="font-bold text-base text-textPrimary">No saved listings</h3>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-5">
            Browse the marketplace and bookmark wool listings you're interested in.
          </p>
          <button onClick={() => navigate('/buyer/marketplace')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primaryDark transition-all">
            <Search size={15} /> Find Wool
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(listing => (
            <div key={listing._id || listing.id} className="p-4 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all group">
              <div onClick={() => navigate(`/buyer/marketplace/${listing._id || listing.id}`)}>
                <p className="font-bold text-sm text-textPrimary group-hover:text-primary">{listing.woolType} Wool</p>
                <p className="text-xs text-textSecondary mt-0.5">{listing.seller?.name || listing.seller_name}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-sm text-emerald-700">₹{listing.pricePerKg}/kg</span>
                  <span className="text-[11px] text-textMuted">{listing.quantityKg} kg</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(listing._id || listing.id); }}
                className="mt-3 pt-3 border-t border-border/50 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
