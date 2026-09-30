import { apiRequest } from './api';

const normalizeListing = (listing = {}) => ({
  ...listing,
  id: listing.id || listing._id,
  floralSource: listing.floralSource || listing.woolType || listing.wool_type || 'Mustard Blossom Raw Honey',
  wool_type: listing.floralSource || listing.woolType || listing.wool_type || 'Mustard Blossom Raw Honey',
  woolType: listing.floralSource || listing.woolType || listing.wool_type || 'Mustard Blossom Raw Honey',
  seller_name: listing.sellerName || listing.seller_name || listing.seller?.name,
  price_per_kg: listing.pricePerKg ?? listing.price_per_kg,
  quantity_kg: listing.availableQuantityKg ?? listing.quantity_kg,
  image_url: listing.imageUrl || listing.image_url || '/honey-hero.jpg',
  grade: listing.grade || listing.qualityGrade || 'Grade A+ (NMR Certified 100% Pure)',
  state: listing.state || listing.origin?.state || '',
  district: listing.district || listing.origin?.district || '',
  location: { state: listing.state || '', district: listing.district || '' },
});

export async function getListings({ state, floralSource, woolType, search } = {}) {
  const query = new URLSearchParams();

  if (state) query.append('state', state);
  const chosenFloral = floralSource || woolType;
  if (chosenFloral) query.append('floralSource', chosenFloral);
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