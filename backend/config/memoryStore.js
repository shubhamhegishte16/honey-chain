// Server-side fast in-memory store for instantaneous zero-dependency execution
let db = {
  users: [],
  batches: [],
  qualityAssessments: [],
  traceabilityEvents: [],
  listings: [],
  orders: [],
  warehouses: [],
  processingRequests: [],
  marketPrices: [],
  producers: [],
  trainingResources: [],
  notifications: [],
};

export function getMemoryDB() {
  return db;
}

export function setMemoryDB(newDb) {
  db = newDb;
}
