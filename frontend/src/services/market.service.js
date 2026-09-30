import { apiRequest } from './api';
import { INITIAL_MANDI_PRICES } from './mockData';

const normalizePrice = (price = {}) => ({
  ...price,
  floralSource: price.floralSource || price.woolType || price.wool_type || 'Mustard Blossom Raw',
  wool_type: price.floralSource || price.woolType || price.wool_type || 'Mustard Blossom Raw',
  woolType: price.floralSource || price.woolType || price.wool_type || 'Mustard Blossom Raw',
  price_per_kg: price.pricePerKg ?? price.price_per_kg ?? 280,
  change_percent: price.changePercent ?? price.change_percent ?? 0,
});

export async function getAllStatePrices() {
  try {
    const result = await apiRequest('/market-prices', { method: 'GET' });
    if (result.data && result.data.length > 0) {
      return { ...result, data: (result.data || []).map(normalizePrice) };
    }
  } catch {
    // Backend offline fallback
  }

  return { data: INITIAL_MANDI_PRICES.map(normalizePrice) };
}

export async function getMarketNews(limit = 4) {
  return {
    data: [
      {
        id: 'news-1',
        title: 'KVIC Honey Mission Expands to 50,000 More Rural Beekeepers',
        summary: 'Ministry of MSME announces special subsidised bee boxes and digital traceability rollout across Rajasthan and Bihar.',
        published_at: '2026-03-12T10:00:00Z',
      },
      {
        id: 'news-2',
        title: 'NMR Purity Mandate Increases Export Value by 34%',
        summary: 'Indian single-origin mustard and sidr honey gains high demand in European and Middle-Eastern markets with blockchain certificates.',
        published_at: '2026-03-08T14:30:00Z',
      },
      {
        id: 'news-3',
        title: 'Spring Nectar Flow: Super Honey Combs Filling Fast in Bharatpur',
        summary: 'Ideal weather conditions lead to record daily hive weight gains of up to 1.6 kg per colony.',
        published_at: '2026-02-28T09:15:00Z',
      }
    ].slice(0, limit)
  };
}

export async function getPriceHistory(state, type) {
  return {
    data: [
      { date: '10 Feb', price: 260 },
      { date: '17 Feb', price: 268 },
      { date: '24 Feb', price: 275 },
      { date: '03 Mar', price: 280 },
      { date: '10 Mar', price: 285 },
    ]
  };
}
