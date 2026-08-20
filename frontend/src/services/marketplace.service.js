import { apiRequest } from './api';

const normalizeListing = (listing = {}) => ({
  ...listing,
  id: listing.id || listing._id,
  wool_type: listing.woolType || listing.wool_type,
  seller_name: listing.sellerName || listing.seller_name || listing.seller?.name,
  price_per_kg: listing.pricePerKg ?? listing.price_per_kg,
  quantity_kg: listing.availableQuantityKg ?? listing.quantity_kg,
  image_url: listing.imageUrl || listing.image_url,
  grade: listing.grade || listing.qualityGrade || '',
  state: listing.state || listing.origin?.state || '',
  district: listing.district || listing.origin?.district || '',
  location: { state: listing.state || '', district: listing.district || '' },
});

export async function getListings({ state, woolType, search } = {}) {
  const query = new URLSearchParams();

  if (state) query.append('state', state);
  if (woolType) query.append('woolType', woolType);
  if (search) query.append('search', search);

  const result = await apiRequest(
    `/marketplace/listings?${query.toString()}`,
    { method: 'GET' }
  );

  return result.error
    ? result
    : {
        ...result,
        data: (result.data || []).map(normalizeListing),
      };
}

export async function getListingById(id) {
  const result = await apiRequest(`/marketplace/listings/${id}`, {
    method: 'GET',
  });

  return result.error
    ? result
    : { ...result, data: normalizeListing(result.data) };
}

export async function placeOrder({
  listingId,
  quantityKg,
  deliveryAddress,
  notes,
}) {
  return await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      listingId,
      quantityKg,
      deliveryAddress,
      notes,
    }),
  });
}