import { apiRequest } from './api';

export async function getBatchQualityAssessment(batchId) {
  return apiRequest(`/quality/batch/${batchId}`, { method: 'GET' });
}

export async function submitQualityAssessment(payload) {
  return apiRequest('/quality/assess', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
