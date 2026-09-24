export const INDIAN_STATES = [
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'JK', name: 'Jammu & Kashmir' },
  { code: 'BR', name: 'Bihar' },
  { code: 'PB', name: 'Punjab' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'TG', name: 'Telangana' }
];

export const DISTRICTS_BY_STATE = {
  RJ: ['Bharatpur', 'Alwar', 'Bikaner', 'Kota', 'Jaipur', 'Jodhpur', 'Ganganagar'],
  JK: ['Pulwama', 'Kupwara', 'Anantnag', 'Baramulla', 'Srinagar'],
  BR: ['Muzaffarpur', 'Samastipur', 'Vaishali', 'Begusarai', 'East Champaran'],
  PB: ['Amritsar', 'Hoshiarpur', 'Ludhiana', 'Gurdaspur', 'Patiala'],
  GJ: ['Kutch', 'Banaskantha', 'Junagadh', 'Patan', 'Surendranagar'],
  MH: ['Solapur', 'Mahabaleshwar', 'Pune', 'Satara', 'Ahmednagar'],
  HP: ['Kullu', 'Shimla', 'Kangra', 'Kinnaur'],
  UK: ['Dehradun', 'Nainital', 'Haridwar', 'Chamoli'],
  UP: ['Saharanpur', 'Moradabad', 'Bareilly', 'Muzaffarnagar'],
  MP: ['Morena', 'Bhind', 'Gwalior', 'Hoshangabad'],
  KA: ['Coorg', 'Shimoga', 'Uttara Kannada', 'Bellary'],
  TG: ['Mahbubnagar', 'Nalgonda', 'Warangal']
};

export const HONEY_TYPES = [
  'Mustard Blossom',
  'Acacia / Kikar',
  'Multifloral Wild Forest',
  'Kashmir White Sidr',
  'Eucalyptus Blossom',
  'Lychee Blossom',
  'Jamun Blossom',
  'Sunflower Honey',
  'Ajwain Blossom',
  'Coriander Blossom'
];

// Alias for backwards compatibility with any existing components
export const WOOL_TYPES = HONEY_TYPES;

export const BEE_SPECIES = [
  'Apis cerana indica (Indian Honeybee)',
  'Apis mellifera (European Honeybee)',
  'Apis dorsata (Rock Bee - Forest Wild)',
  'Tetragonula iridipennis (Stingless Dammer Bee)'
];

export const EXTRACTION_METHODS = [
  'Centrifugal Machine Extraction (Food Grade SS304)',
  'Gravity Strained Raw Unfiltered',
  'Traditional Squeeze Extraction (Tribal Forest)',
  'Comb Honey Direct Frame Cut'
];

export function getStateCode(stateName) {
  const match = INDIAN_STATES.find(s => s.name === stateName);
  return match ? match.code : 'XX';
}

export function getDistrictsForState(stateName) {
  const match = INDIAN_STATES.find(s => s.name === stateName);
  return match ? DISTRICTS_BY_STATE[match.code] || [] : [];
}

export const ROLES = [
  { value: 'farmer', label: 'Beekeeper (Madhumakshi Palak)' },
  { value: 'buyer', label: 'FMCG / Ayurvedic Buyer' },
  { value: 'processor', label: 'Honey Bottling Unit' },
  { value: 'artisan', label: 'Beekeeping Cooperative / SHG' },
  { value: 'admin', label: 'KVIC / MSME Admin' }
];

export const ROLE_LABELS = {
  farmer: 'Beekeeper (Madhumakshi Palak)',
  buyer: 'FMCG / Bulk Buyer',
  processor: 'Processing & Bottling Unit',
  artisan: 'Beekeeping Cooperative / SHG',
  admin: 'KVIC Mission Administrator'
};
