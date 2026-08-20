import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, Trash2 } from 'lucide-react';

// ponytail: localStorage-only saved wool, backend API when it exists
function getSavedListings() {
  try { return JSON.parse(localStorage.getItem('woolconnect_saved') || '[]'); } catch { return []; }
}
function removeSavedListing(id) {
  const saved = getSavedListings().filter(l => l.id !== id);
  localStorage.setItem('woolconnect_saved', JSON.stringify(saved));
  return saved;
}

export default function SavedWool() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(getSavedListings);

  const handleRemove = (id) => {
    setListings(removeSavedListing(id));
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div>
          <p className="eyebrow text-primary"><Bookmark size={13} /> Bookmarks</p>
          <h1 className="text-2xl font-extrabold text-textPrimary">Saved Wool</h1>
        </div>
      </div>

      {listings.length === 0 ? (
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
            <div key={listing.id} className="p-4 rounded-2xl bg-surface border border-border shadow-sm hover:border-primary/40 hover:shadow-md cursor-pointer transition-all group">
              <div onClick={() => navigate(`/buyer/marketplace/${listing.id}`)}>
                <p className="font-bold text-sm text-textPrimary group-hover:text-primary">{listing.wool_type} Wool</p>
                <p className="text-xs text-textSecondary mt-0.5">{listing.seller_name}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-sm text-emerald-700">₹{listing.price_per_kg}/kg</span>
                  <span className="text-[11px] text-textMuted">{listing.quantity_kg} kg</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(listing.id); }}
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

// Export utility so MarketplaceExperience can save listings
export function saveListing(listing) {
  const saved = getSavedListings();
  if (!saved.find(l => l.id === listing.id)) {
    saved.push({ id: listing.id, wool_type: listing.wool_type, seller_name: listing.seller_name, price_per_kg: listing.price_per_kg, quantity_kg: listing.quantity_kg });
    localStorage.setItem('woolconnect_saved', JSON.stringify(saved));
  }
}
