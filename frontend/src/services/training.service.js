import { apiRequest } from './api';

// Map UI Category keys to DB Category values (Apiculture)
export const CATEGORY_MAP = {
  'apiary-care': ['Apiary Management', 'Hive Health & Queen Rearing'],
  'extraction': ['Comb Extraction & Centrifugation'],
  'honey-quality': ['Honey Quality & NMR Standards', 'Organic Certification'],
  'storage': ['Moisture Control & Dehumidification'],
  'processing': ['Micro-Filtration & Bottling', 'Product Development'],
  'selling': ['Mandi Trading & Fair Pricing', 'Direct Buyer Selling', 'Digital Selling'],
};

export const CATEGORY_LABELS = {
  'apiary-care': 'Apiary Care',
  'extraction': 'Comb Extraction',
  'honey-quality': 'Honey Quality & NMR',
  'storage': 'Moisture & Storage',
  'processing': 'Filtration & Bottling',
  'selling': 'Mandi & Direct Selling',
};

export async function getTrainingResources(params = {}) {
  const { category, level, search } = params;
  
  let endpoint = '/training';
  const queryParts = [];
  
  if (level) {
    queryParts.push(`level=${encodeURIComponent(level)}`);
  }
  if (search) {
    queryParts.push(`search=${encodeURIComponent(search)}`);
  }
  
  if (category && CATEGORY_MAP[category] && CATEGORY_MAP[category].length === 1) {
    queryParts.push(`category=${encodeURIComponent(CATEGORY_MAP[category][0])}`);
  }
  
  if (queryParts.length > 0) {
    endpoint += '?' + queryParts.join('&');
  }
  
  return apiRequest(endpoint, { method: 'GET' });
}

export async function getTrainingResourceById(id) {
  return apiRequest(`/training/${id}`, { method: 'GET' });
}

export async function markResourceCompleted(id) {
  return apiRequest(`/training/${id}/complete`, { method: 'POST' });
}
