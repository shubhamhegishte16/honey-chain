import { apiRequest } from './api';

export async function getUserOrders() {
  return await apiRequest('/orders', { method: 'GET' });
}

export async function getOrderById(id) {
  return await apiRequest(`/orders/${id}`, { method: 'GET' });
}

export async function updateOrderStatus(orderId, statusData) {
  return await apiRequest(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  });
}

export async function getBuyerAnalytics() {
  return await apiRequest('/orders/analytics/buyer');
}
