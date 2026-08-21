import { apiRequest } from './api';

const normalizeBatch = (batch = {}) => ({
  ...batch,
  id: batch.id || batch._id,
  batchId: batch.batchId || batch.batch_id,
  woolType: batch.woolType || batch.wool_type,
  quantityKg: batch.quantityKg ?? batch.quantity_kg,
  state: batch.origin?.state || batch.state,
  district: batch.origin?.district || batch.district,
  farmLocation: batch.origin?.farmLocation || batch.farm_location,
  shearingDate: batch.shearingDate || batch.shearing_date,
  farmer: batch.farmer || batch.farmer_id || batch.users,
});

export async function getPendingQualityBatches() {
  const result = await apiRequest('/batches', { method: 'GET' });
  if (result.error) return result;
  return { ...result, data: (result.data || []).filter(batch => batch.status === 'produced').map(normalizeBatch) };
}

export async function getQualityAssessment(batchId) {
  return apiRequest(`/quality/batch/${batchId}`, { method: 'GET' });
}

export async function submitQualityAssessment(payload) {
  return apiRequest('/quality/assess', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getAiEstimate(payload) {
  return apiRequest('/quality/ai-estimate', { method: 'POST', body: JSON.stringify(payload) });
}