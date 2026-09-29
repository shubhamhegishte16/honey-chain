import { apiRequest } from './api';

// Map UI Category keys to DB Category values (Apiculture & Dual-compatibility)
export const CATEGORY_MAP = {
  'apiary-care': ['Apiary Management', 'Hive Health & Queen Rearing', 'Sheep Management'],
  'extraction': ['Comb Extraction & Centrifugation', 'Wool Shearing'],
  'honey-quality': ['Honey Quality & NMR Standards', 'Organic Certification', 'Wool Handling', 'Wool Grading'],
  'storage': ['Moisture Control & Dehumidification', 'Wool Storage'],
  'processing': ['Micro-Filtration & Bottling', 'Wool Processing', 'Dyeing', 'Product Development'],
  'selling': ['Mandi Trading & Fair Pricing', 'Direct Buyer Selling', 'Marketing', 'Digital Selling'],
  // Legacy aliases for backward compatibility
  'sheep-care': ['Apiary Management', 'Sheep Management'],
  'shearing': ['Comb Extraction & Centrifugation', 'Wool Shearing'],
  'wool-quality': ['Honey Quality & NMR Standards', 'Wool Handling', 'Wool Grading'],
};

export const CATEGORY_LABELS = {
  'apiary-care': 'Apiary Care',
  'extraction': 'Comb Extraction',
  'honey-quality': 'Honey Quality & NMR',
  'storage': 'Moisture & Storage',
  'processing': 'Filtration & Bottling',
  'selling': 'Mandi & Direct Selling',
  // Legacy labels
  'sheep-care': 'Apiary Care',
  'shearing': 'Comb Extraction',
  'wool-quality': 'Honey Quality',
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
    endpoint += `?${queryParts.join('&')}`;
  }
  
  const result = await apiRequest(endpoint, { method: 'GET' });
  if (result.error) return result;
  
  let data = result.data || [];
  
  if (category && CATEGORY_MAP[category] && CATEGORY_MAP[category].length > 1) {
    const dbCategories = CATEGORY_MAP[category];
    data = data.filter(item => dbCategories.includes(item.category));
  }
  
  return { ...result, data };
}

export async function getTrainingResourceById(id) {
  return await apiRequest(`/training/${id}`, { method: 'GET' });
}
