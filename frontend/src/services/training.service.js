import { apiRequest } from './api';

// Map UI Category keys to DB Category values
export const CATEGORY_MAP = {
  'sheep-care': ['Sheep Management'],
  'shearing': ['Wool Shearing'],
  'wool-quality': ['Wool Handling', 'Wool Grading'],
  'storage': ['Wool Storage'],
  'processing': ['Wool Processing', 'Dyeing', 'Product Development'],
  'selling': ['Marketing', 'Digital Selling']
};

export const CATEGORY_LABELS = {
  'sheep-care': 'Sheep Care',
  'shearing': 'Shearing',
  'wool-quality': 'Wool Quality',
  'storage': 'Storage',
  'processing': 'Processing',
  'selling': 'Selling'
};

export async function getTrainingResources(params = {}) {
  const { category, level, search } = params;
  
  // If a UI category is provided, we can either filter client-side or build query.
  // Since some UI categories map to multiple DB categories, client-side filtering is extremely reliable,
  // or we can query the backend with query parameters.
  let endpoint = '/training';
  const queryParts = [];
  
  if (level) {
    queryParts.push(`level=${encodeURIComponent(level)}`);
  }
  if (search) {
    queryParts.push(`search=${encodeURIComponent(search)}`);
  }
  
  // If we query a specific DB category directly (like Shearing)
  if (category && CATEGORY_MAP[category] && CATEGORY_MAP[category].length === 1) {
    queryParts.push(`category=${encodeURIComponent(CATEGORY_MAP[category][0])}`);
  }
  
  if (queryParts.length > 0) {
    endpoint += `?${queryParts.join('&')}`;
  }
  
  const result = await apiRequest(endpoint, { method: 'GET' });
  if (result.error) return result;
  
  let data = result.data || [];
  
  // If the UI category maps to multiple DB categories, we filter client-side
  if (category && CATEGORY_MAP[category] && CATEGORY_MAP[category].length > 1) {
    const dbCategories = CATEGORY_MAP[category];
    data = data.filter(item => dbCategories.includes(item.category));
  }
  
  return { ...result, data };
}

export async function getTrainingResourceById(id) {
  return await apiRequest(`/training/${id}`, { method: 'GET' });
}
