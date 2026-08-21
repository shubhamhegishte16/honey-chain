// src/services/processor.service.js
import { apiRequest } from './api';

// ─── Normalizers ─────────────────────────────────────────────────────────────
const normalizeRequest = (r = {}) => ({
  ...r,
  id: r.id || r._id,
  // For components that expect flat fields:
  batchIdDisplay: r.batch?.batchId || r.batchId || '—',
  woolType: r.batch?.woolType || '—',
  grade: r.batch?.qualityGrade || '—',
  quantity: r.quantityKg || 0,
  farmerName: r.farmer?.name || r.farmerName || '—',
  processorName: r.processor?.name || r.processorName || '—',
  date: r.preferredDate ? new Date(r.preferredDate).toLocaleDateString('en-IN') : '—',
  completedOn: r.completionDate ? new Date(r.completionDate).toLocaleDateString('en-IN') : null,
});

const normalizeBatch = (b = {}) => ({
  ...b,
  id: b.id || b._id,
  batchId: b.batchId || '—',
  woolType: b.woolType || '—',
  grade: b.qualityGrade || '—',
  quantity: b.quantityKg || 0,
  originalQuantity: b.quantityKg || 0,
  farmerName: b.farmer?.name || '—',
  location: b.currentLocation || '—',
  date: b.updatedAt ? new Date(b.updatedAt).toLocaleDateString('en-IN') : '—',
  // Map wool batch status to display-friendly status
  status: (() => {
    if (b.status === 'processing_requested') return 'transit';
    if (b.status === 'in_processing') return 'in_progress';
    if (b.status === 'processed') return 'completed';
    return b.status || 'unknown';
  })(),
});

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getProcessorStats = async () => {
  return apiRequest('/processing/stats', { method: 'GET' });
};

// ─── Processing Requests ──────────────────────────────────────────────────────
export const getProcessingRequests = async () => {
  const res = await apiRequest('/processing/requests', { method: 'GET' });
  if (res.error) return res;
  return { ...res, data: (res.data || []).map(normalizeRequest) };
};

export const updateProcessingRequestStatus = async (requestId, status, outputNotes = '') => {
  return apiRequest(`/processing/requests/${requestId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, outputNotes }),
  });
};

// ─── Incoming Batches ─────────────────────────────────────────────────────────
export const getIncomingBatches = async () => {
  const res = await apiRequest('/processing/incoming', { method: 'GET' });
  if (res.error) return res;
  return { ...res, data: (res.data || []).map(normalizeBatch) };
};

export const markBatchReceived = async (batchMongoId) => {
  return apiRequest(`/processing/batches/${batchMongoId}/receive`, { method: 'PATCH' });
};

// ─── Active Processing ────────────────────────────────────────────────────────
export const getActiveProcessing = async () => {
  const res = await apiRequest('/processing/active', { method: 'GET' });
  if (res.error) return res;
  // Map ProcessingRequest docs into shape expected by ActiveProcessing.jsx
  return {
    ...res,
    data: (res.data || []).map(r => ({
      ...normalizeRequest(r),
      stage: r.serviceType || 'Processing',
      stages: [r.serviceType || 'Processing', 'Quality Check', 'Packaging', 'Completed'],
      history: [
        { stage: r.serviceType || 'Processing', status: 'active', in: r.quantityKg, out: null },
      ],
    })),
  };
};

// ─── Processing History ───────────────────────────────────────────────────────
export const getProcessingHistory = async () => {
  const res = await apiRequest('/processing/history', { method: 'GET' });
  if (res.error) return res;
  return {
    ...res,
    data: (res.data || []).map(r => ({
      ...normalizeRequest(r),
      originalQty: r.quantityKg || 0,
      finalQty: r.quantityKg || 0,
    })),
  };
};

// ─── Processed Products ───────────────────────────────────────────────────────
export const getProcessedProducts = async () => {
  const res = await apiRequest('/processing/products', { method: 'GET' });
  if (res.error) return res;
  return {
    ...res,
    data: (res.data || []).map(b => ({
      ...normalizeBatch(b),
      type: b.woolType || '—',
      qty: b.quantityKg || 0,
      originalId: b.batchId || '—',
    })),
  };
};

// ─── Batch Management ─────────────────────────────────────────────────────────
export const getBatches = async () => {
  const res = await apiRequest('/processing/batches', { method: 'GET' });
  if (res.error) return res;
  return {
    ...res,
    data: (res.data || []).map(b => ({
      ...normalizeBatch(b),
      qty: b.quantityKg || 0,
      owner: b.farmer?.name || '—',
      children: [],
    })),
  };
};

