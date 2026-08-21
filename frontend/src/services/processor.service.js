// src/services/processor.service.js
// Mock data for Processor Panel frontend development

const mockData = {
  stats: {
    pendingRequests: 5,
    incomingBatches: 3,
    activeProcessing: 4,
    completedBatches: 28,
    totalProcessingVolume: 1250,
    totalProcessedVolume: 8700,
  },
  requests: [
    { id: 'REQ-001', date: '2023-10-24', source: 'Farm Co.', quantity: 150, grade: 'A', status: 'pending' },
    { id: 'REQ-002', date: '2023-10-23', source: 'Valley Sheep', quantity: 80, grade: 'B', status: 'accepted' },
  ],
  incomingBatches: [
    { id: 'WOL-MH-102', date: '2023-10-25', source: 'Warehouse A', quantity: 120, grade: 'A', status: 'transit' },
  ],
  activeProcessing: [
    {
      id: 'WOL-MH-001',
      quantity: 82,
      originalQuantity: 82,
      stage: 'Sorting',
      history: [
        { stage: 'Washing', in: 82, out: 77, loss: 5, status: 'completed' },
        { stage: 'Drying', in: 77, out: 75, loss: 2, status: 'completed' },
        { stage: 'Sorting', in: 75, out: null, loss: null, status: 'active' },
      ],
      stages: ['Washing', 'Drying', 'Sorting', 'Carding', 'Spinning', 'Dyeing', 'Completed']
    }
  ],
  history: [
    { id: 'WOL-MH-099', date: '2023-10-15', originalQty: 100, finalQty: 85, status: 'completed' }
  ],
  batches: [
    { id: 'WOL-MH-001', parent: null, children: ['WOL-MH-001-P01'], qty: 82, grade: 'A', owner: 'Processor', location: 'Facility 1' }
  ],
  processed: [
    { id: 'WOL-MH-001-P01', originalId: 'WOL-MH-001', qty: 70, type: 'Spun Yarn', date: '2023-10-20', status: 'ready' }
  ]
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProcessorStats = async () => {
  await delay(500);
  return { error: false, data: mockData.stats };
};

export const getProcessingRequests = async () => {
  await delay(500);
  return { error: false, data: mockData.requests };
};

export const getIncomingBatches = async () => {
  await delay(500);
  return { error: false, data: mockData.incomingBatches };
};

export const getActiveProcessing = async () => {
  await delay(500);
  return { error: false, data: mockData.activeProcessing };
};

export const getProcessingHistory = async () => {
  await delay(500);
  return { error: false, data: mockData.history };
};

export const getBatches = async () => {
  await delay(500);
  return { error: false, data: mockData.batches };
};

export const getProcessedProducts = async () => {
  await delay(500);
  return { error: false, data: mockData.processed };
};
