// Interactive Mock & Demo Store for Honey Chain (KVIC Honey Mission)

export const DEMO_PROFILES = {
  farmer: {
    id: 'user-beekeeper-1',
    name: 'Ramesh Singh',
    email: 'ramesh.beekeeper@kvic.gov.in',
    mobile: '9829011223',
    role: 'farmer', // maps to beekeeper in UI
    state: 'Rajasthan',
    district: 'Bharatpur',
    village: 'Uchain',
    address: 'Apiary Sector 4, Bharatpur Mustard Belt',
    organization: 'Brij Beekeepers Co-operative (KVIC Cluster)',
    isVerified: true,
    flockSize: 65, // bee box count
    primaryBreeds: ['Apis mellifera', 'Apis cerana indica'],
    avatarUrl: '',
  },
  quality: {
    id: 'user-quality-1',
    name: 'Dr. Anjali Sharma',
    email: 'dr.anjali.lab@kvic.gov.in',
    mobile: '9811099881',
    role: 'admin', // Lab Inspector / Admin permissions
    state: 'Delhi',
    district: 'New Delhi',
    village: 'Central Lab',
    address: 'KVIC Central Honey Testing & NMR Spectroscopy Facility',
    organization: 'National Bee Board & FSSAI Accredited Testing Lab',
    isVerified: true,
  },
  processor: {
    id: 'user-processor-1',
    name: 'Vikramjit Sahni',
    email: 'vikram.processor@goldennectar.in',
    mobile: '9800011225',
    role: 'processor',
    state: 'Punjab',
    district: 'Amritsar',
    address: 'Unit 4, Golden Nectar Micro-Filtration & Packaging Facility',
    organization: 'Golden Nectar Agrotech Processing Unit',
    isVerified: true,
  },
  buyer: {
    id: 'user-buyer-1',
    name: 'Anita Deshmukh',
    email: 'anita.buyer@dabur-procure.com',
    mobile: '9822011224',
    role: 'buyer',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Dabur India Ayurvedic Raw Honey Procurement Wing',
    organization: 'Dabur Ayurvedic Sourcing Division',
    isVerified: true,
  },
  admin: {
    id: 'user-admin-1',
    name: 'Shri Manoj Kumar (KVIC Chairman)',
    email: 'chairman.honey@kvic.gov.in',
    mobile: '9810012345',
    role: 'admin',
    state: 'Delhi',
    district: 'New Delhi',
    address: 'Khadi and Village Industries Commission, Ministry of MSME',
    organization: 'Ministry of MSME / KVIC Honey Mission',
    isVerified: true,
  }
};

export const INITIAL_HONEY_BATCHES = [
  {
    id: 'HC-RJ-2026-000108',
    batchId: 'HC-RJ-2026-000108',
    batch_id: 'HC-RJ-2026-000108',
    woolType: 'Mustard Blossom',
    wool_type: 'Mustard Blossom',
    floralSource: 'Mustard Blossom',
    beeSpecies: 'Apis mellifera (European Honeybee)',
    quantityKg: 60,
    quantity_kg: 60,
    unit: 'kg',
    shearingDate: '2026-02-14T08:30:00Z',
    shearing_date: '2026-02-14T08:30:00Z',
    extractionDate: '2026-02-14T08:30:00Z',
    color: 'Light Amber',
    initialCondition: 'Raw Organic Unprocessed Honey',
    origin: {
      state: 'Rajasthan',
      district: 'Bharatpur',
      village: 'Uchain Nectar Belt',
      farmLocation: 'Apiary Box #1 to #25, Mustard Fields',
    },
    state: 'Rajasthan',
    district: 'Bharatpur',
    farm_location: 'Apiary Box #1 to #25, Mustard Fields',
    qualityGrade: 'Grade A+ (NMR Certified 100% Pure)',
    quality_grade: 'Grade A+ (NMR Certified 100% Pure)',
    status: 'bottled',
    currentLocation: 'KVIC Regional Depot, Bharatpur',
    users: DEMO_PROFILES.farmer,
    farmer: DEMO_PROFILES.farmer,
    blockHash: '0x7e8f23a91b4028e49d68241cfda609e20b3967812cd9e8f17042a991823efca4',
    previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    qualityAssessment: {
      grade: 'Grade A+ (NMR Certified 100% Pure)',
      moistureCondition: '17.8% (Optimal Purity <20%)',
      moisturePercent: 17.8,
      hmfLevel: '11.4 mg/kg (Fresh & Unheated)',
      fiberAppearance: '100% Pure Raw Honey (Zero C3/C4 Sugar Syrups)',
      cleanliness: 'High Purity (Micro-filtered at 40°C)',
      stapleLength: 'F/G Ratio: 1.18',
      micronEstimate: 'Pollen Count: 42,000 grains/g',
      inspector: 'Dr. Anjali Sharma (KVIC Quality Control Director)',
      assessedAt: '2026-02-16T11:00:00Z',
      isAiAssisted: true,
      blockchainSeal: 'VERIFIED_ON_CHAIN_KVIC_LAB',
    }
  },
  {
    id: 'HC-JK-2026-000109',
    batchId: 'HC-JK-2026-000109',
    batch_id: 'HC-JK-2026-000109',
    woolType: 'Kashmir White Sidr',
    wool_type: 'Kashmir White Sidr',
    floralSource: 'Kashmir White Sidr',
    beeSpecies: 'Apis cerana indica (Indian Honeybee)',
    quantityKg: 45,
    quantity_kg: 45,
    unit: 'kg',
    shearingDate: '2026-03-01T09:00:00Z',
    shearing_date: '2026-03-01T09:00:00Z',
    extractionDate: '2026-03-01T09:00:00Z',
    color: 'Extra Light Amber',
    initialCondition: 'High Altitude Wild Floral Nectar',
    origin: {
      state: 'Jammu & Kashmir',
      district: 'Pulwama',
      village: 'Tral Valley',
      farmLocation: 'Tral Mountain Sidr Flora Range',
    },
    state: 'Jammu & Kashmir',
    district: 'Pulwama',
    farm_location: 'Tral Mountain Sidr Flora Range',
    qualityGrade: 'Grade A (NMR Verified Single Origin)',
    quality_grade: 'Grade A (NMR Verified Single Origin)',
    status: 'quality_checked',
    currentLocation: 'KVIC Pulwama Testing Hub',
    users: { name: 'Abdul Rashid Mir', role: 'farmer', district: 'Pulwama', state: 'Jammu & Kashmir' },
    farmer: { name: 'Abdul Rashid Mir', role: 'farmer', district: 'Pulwama', state: 'Jammu & Kashmir' },
    blockHash: '0x9924a1b89efc11a3d90214ee6bca9283f01b9283c7482910fae82937104bde92',
    previousBlockHash: '0x7e8f23a91b4028e49d68241cfda609e20b3967812cd9e8f17042a991823efca4',
    qualityAssessment: {
      grade: 'Grade A (NMR Verified Single Origin)',
      moistureCondition: '16.9% (Super Premium)',
      moisturePercent: 16.9,
      hmfLevel: '8.2 mg/kg',
      fiberAppearance: '100% Pure Raw Single-Origin Sidr',
      cleanliness: 'High Purity',
      stapleLength: 'F/G Ratio: 1.24',
      micronEstimate: 'Pollen Density: 96% Monofloral Sidr',
      inspector: 'KVIC High Altitude Bee Research Lab',
      assessedAt: '2026-03-03T14:30:00Z',
      isAiAssisted: true,
    }
  },
  {
    id: 'HC-BR-2026-000110',
    batchId: 'HC-BR-2026-000110',
    batch_id: 'HC-BR-2026-000110',
    woolType: 'Lychee Blossom',
    wool_type: 'Lychee Blossom',
    floralSource: 'Lychee Blossom',
    beeSpecies: 'Apis mellifera (European Honeybee)',
    quantityKg: 80,
    quantity_kg: 80,
    unit: 'kg',
    shearingDate: '2026-03-10T07:15:00Z',
    shearing_date: '2026-03-10T07:15:00Z',
    extractionDate: '2026-03-10T07:15:00Z',
    color: 'Water White / Light Straw',
    initialCondition: 'Fresh Shahi Lychee Orchard Bloom',
    origin: {
      state: 'Bihar',
      district: 'Muzaffarpur',
      village: 'Mushahari',
      farmLocation: 'Shahi Lychee Export Zone Orchards',
    },
    state: 'Bihar',
    district: 'Muzaffarpur',
    farm_location: 'Shahi Lychee Export Zone Orchards',
    qualityGrade: 'Pending Inspection',
    quality_grade: 'Pending Inspection',
    status: 'produced',
    currentLocation: 'Muzaffarpur Farmer Collection Point',
    users: { name: 'Sunita Devi', role: 'farmer', district: 'Muzaffarpur', state: 'Bihar' },
    farmer: { name: 'Sunita Devi', role: 'farmer', district: 'Muzaffarpur', state: 'Bihar' },
    blockHash: '0x127bcf8290a1b24890cde478901238914789210abced98471209384712903847',
    previousBlockHash: '0x9924a1b89efc11a3d90214ee6bca9283f01b9283c7482910fae82937104bde92',
  }
];

export const INITIAL_TRACKING_EVENTS = {
  'HC-RJ-2026-000108': [
    {
      id: 'ev-1',
      event_type: 'produced',
      eventType: 'produced',
      actorName: 'Ramesh Singh (KVIC Beekeeper)',
      location: 'Uchain, Bharatpur, Rajasthan',
      description: 'Extracted 60 kg of pure Mustard Blossom honey from 25 IoT-monitored bee boxes. Ambient hive temperature: 34.8°C.',
      event_timestamp: '2026-02-14T08:30:00Z',
      timestamp: '2026-02-14T08:30:00Z',
      blockHash: '0x7e8f23a91b4028e49d68241cfda609e20b3967812cd9e8f17042a991823efca4',
      blockNumber: 0,
      merkleVerified: true,
    },
    {
      id: 'ev-2',
      event_type: 'quality_checked',
      eventType: 'quality_checked',
      actorName: 'Dr. Anjali Sharma (KVIC Quality Inspector)',
      location: 'KVIC Central Testing Lab, New Delhi',
      description: 'Chemical & NMR spectroscopy analysis complete. Moisture: 17.8%, HMF: 11.4 mg/kg. Certified 100% Pure, zero added C3/C4 syrups.',
      event_timestamp: '2026-02-16T11:00:00Z',
      timestamp: '2026-02-16T11:00:00Z',
      blockHash: '0x2c4e91820b482910fcde47190283471092837401928374019283740192837401',
      blockNumber: 1,
      merkleVerified: true,
    },
    {
      id: 'ev-3',
      event_type: 'processed',
      eventType: 'processed',
      actorName: 'Golden Nectar Bottling Unit',
      location: 'Amritsar Processing Park, Punjab',
      description: 'Gentle micro-filtration (40°C) performed. Bottled into exactly 120 tamper-proof glass jars of 500g each. QR codes sealed.',
      event_timestamp: '2026-02-18T15:20:00Z',
      timestamp: '2026-02-18T15:20:00Z',
      blockHash: '0x991048290bcde102938471029384710293847102938471029384710293847102',
      blockNumber: 2,
      merkleVerified: true,
    },
    {
      id: 'ev-4',
      event_type: 'dispatched',
      eventType: 'dispatched',
      actorName: 'KVIC Logistics & Supply Wing',
      location: 'Bharatpur to New Delhi Khadi Bhavan',
      description: 'Consignment dispatched via temperature-regulated logistics to KVIC Khadi Bhavan outlets.',
      event_timestamp: '2026-02-20T10:00:00Z',
      timestamp: '2026-02-20T10:00:00Z',
      blockHash: '0x3344556677889900aabbccddeeff0011223344556677889900aabbccddeeff00',
      blockNumber: 3,
      merkleVerified: true,
    }
  ]
};

export const INITIAL_MANDI_PRICES = [
  { state: 'Rajasthan', wool_type: 'Mustard Blossom Raw', price_per_kg: 285, change_percent: 4.2 },
  { state: 'Jammu & Kashmir', wool_type: 'Kashmir White Sidr', price_per_kg: 850, change_percent: 6.5 },
  { state: 'Bihar', wool_type: 'Muzaffarpur Shahi Lychee', price_per_kg: 340, change_percent: 2.8 },
  { state: 'Punjab', wool_type: 'Eucalyptus & Beri Blend', price_per_kg: 260, change_percent: 1.5 },
  { state: 'Maharashtra', wool_type: 'Mahabaleshwar Multifloral', price_per_kg: 420, change_percent: 3.1 },
  { state: 'Madhya Pradesh', wool_type: 'Wild Forest Neem Bloom', price_per_kg: 390, change_percent: -0.8 },
  { state: 'Gujarat', wool_type: 'Kutch Wild Acacia Bloom', price_per_kg: 310, change_percent: 2.0 },
];

export const IOT_SMART_HIVE_TELEMETRY = {
  hiveId: 'HIVE-KVIC-RJ-042',
  apiaryLocation: 'Bharatpur Mustard Belt, Sector 4',
  queenStatus: 'Active & Egg Laying (Healthy Brood Pattern)',
  colonyStrength: 'High (Approx. 48,000 Worker Bees)',
  internalTempC: 34.8,
  internalHumidityPct: 58,
  hiveWeightKg: 44.2,
  dailyWeightGainKg: 1.4,
  acousticFrequencyHz: 232,
  swarmRisk: 'Low (<5%)',
  harvestReadiness: '88% Ready (Super Frames 80% Capped Wax)',
  lastSyncTime: 'Just now (Live IoT Telemetry via LoRaWAN/GSM)'
};

// Storage Helpers
export function getStoredBatches() {
  try {
    const raw = localStorage.getItem('honeychain_batches');
    if (!raw) {
      localStorage.setItem('honeychain_batches', JSON.stringify(INITIAL_HONEY_BATCHES));
      return INITIAL_HONEY_BATCHES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HONEY_BATCHES;
  }
}

export function saveStoredBatches(batches) {
  try {
    localStorage.setItem('honeychain_batches', JSON.stringify(batches));
  } catch (e) {
    console.error('Failed to save batches to localStorage', e);
  }
}

export function getStoredTrackingEvents(batchId) {
  try {
    const raw = localStorage.getItem('honeychain_tracking');
    const store = raw ? JSON.parse(raw) : INITIAL_TRACKING_EVENTS;
    return store[batchId] || INITIAL_TRACKING_EVENTS[batchId] || [];
  } catch {
    return INITIAL_TRACKING_EVENTS[batchId] || [];
  }
}

export function addStoredTrackingEvent(batchId, event) {
  try {
    const raw = localStorage.getItem('honeychain_tracking');
    const store = raw ? JSON.parse(raw) : { ...INITIAL_TRACKING_EVENTS };
    const list = store[batchId] || [];
    list.push(event);
    store[batchId] = list;
    localStorage.setItem('honeychain_tracking', JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save tracking event', e);
  }
}
