import { apiRequest } from './api';

const normalizeListing = (listing = {}) => ({
  ...listing,
  id: listing.id || listing._id,
  wool_type: listing.woolType || listing.wool_type,
  seller_name: listing.sellerName || listing.seller_name,
  price_per_kg: listing.pricePerKg ?? listing.price_per_kg,
  quantity_kg: listing.availableQuantityKg ?? listing.quantity_kg,
  image_url: listing.imageUrl || listing.image_url,
});

export async function getListings({ state, woolType, search } = {}) {
  const query = new URLSearchParams();
  if (state) query.append('state', state);
  if (woolType) query.append('woolType', woolType);
  if (search) query.append('search', search);
  const result = await apiRequest(`/marketplace?${query.toString()}`, { method: 'GET' });
  return result.error ? result : { ...result, data: (result.data || []).map(normalizeListing) };
}

export async function placeOrder({ listingId }) {
  // The authenticated user is the buyer. Start with a single-kg order so the
  // marketplace action is valid even before a dedicated checkout screen exists.
  return await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({ listingId, quantityKg: 1 }),
  });
}
