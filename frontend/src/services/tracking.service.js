import { apiRequest } from './api';

export async function getTrackingEvents(batchId) {
  const result = await apiRequest(`/traceability/${batchId}`, { method: 'GET' });
  if (result.error) return result;
  return {
    ...result,
    data: (result.data?.events || []).map(event => ({
      ...event,
      id: event.id || event._id,
      event_type: event.eventType || event.event_type,
      event_timestamp: event.timestamp || event.event_timestamp,
    })),
  };
}
