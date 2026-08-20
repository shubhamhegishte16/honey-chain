import { apiRequest } from './api';

export async function getUserOrders() {
  return await apiRequest('/orders', { method: 'GET' });
}

export async function getOrderById(id) {
  return await apiRequest(`/orders/${id}`, { method: 'GET' });
}
