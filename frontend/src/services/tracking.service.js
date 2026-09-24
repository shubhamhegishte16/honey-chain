import { apiRequest } from './api';
import { getStoredTrackingEvents } from './mockData';

export async function getTrackingEvents(batchId) {
  try {
    const result = await apiRequest(`/traceability/${batchId}`, { method: 'GET' });
    if (result.data?.events && result.data.events.length > 0) {
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
  } catch {
    // Backend offline fallback
  }

  const events = getStoredTrackingEvents(batchId);
  return {
    data: events.map(event => ({
      ...event,
      id: event.id || event._id,
      event_type: event.eventType || event.event_type,
      event_timestamp: event.timestamp || event.event_timestamp,
    })),
  };
}
