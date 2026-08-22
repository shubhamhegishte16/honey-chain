import { apiRequest } from './api';

const normalizeRequest = (r = {}) => ({
  ...r,
  id: r.id || r._id,
  batch_id: r.batchId || r.batch_id,
  batch: r.batch,
  farmer_name: r.farmerName || r.farmer_name,
  service_type: r.serviceType || r.service_type,
  quantity_kg: r.quantityKg ?? r.quantity_kg,
  preferred_date: r.preferredDate || r.preferred_date,
  completion_date: r.completionDate || r.completion_date,
});

// Wool batches / processing jobs assigned to the current artisan/processor.
export async function getAssignedProcessingRequests() {
  const result = await apiRequest('/processing/requests', { method: 'GET' });
  return result.error ? result : { ...result, data: (result.data || []).map(normalizeRequest) };
}

export async function updateProcessingRequestStatus(id, status, outputNotes) {
  const result = await apiRequest(`/processing/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, outputNotes }),
  });
  return result.error ? result : { ...result, data: normalizeRequest(result.data) };
}

// Fetch available registered processors / mills (optionally filtered by state)
export async function getProcessors(state) {
  const url = state ? `/processing/processors?state=${encodeURIComponent(state)}` : '/processing/processors';
  return apiRequest(url, { method: 'GET' });
}

// Submit a new processing request for a wool batch
export async function requestProcessing(payload) {
  const result = await apiRequest('/processing/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.error ? result : { ...result, data: normalizeRequest(result.data) };
}

