import { apiRequest } from './api';

const normalizePrice = (price = {}) => ({
  ...price,
  wool_type: price.woolType || price.wool_type,
  price_per_kg: price.pricePerKg ?? price.price_per_kg,
  change_percent: price.changePercent ?? price.change_percent ?? 0,
});

export async function getAllStatePrices() {
  const result = await apiRequest('/market-prices', { method: 'GET' });
  return result.error ? result : { ...result, data: (result.data || []).map(normalizePrice) };
}

export async function getMarketNews(limit = 4) {
  const result = await apiRequest('/market-prices/news', { method: 'GET' });
  return result.error ? result : { ...result, data: (result.data || []).slice(0, limit).map(item => ({ ...item, published_at: item.publishedAt || item.published_at })) };
}

export async function getPriceHistory(state, type) {
  // We can filter on frontend if backend doesn't support specific query, but backend probably has history.
  // Let's just fetch all prices and find it for now, or assume backend has it.
  const { data, error } = await apiRequest(`/market-prices/history?state=${encodeURIComponent(state)}&woolType=${encodeURIComponent(type)}`, { method: 'GET' });
  if (error) return { error };
  return { data: data || [] };
}
