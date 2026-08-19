import { apiRequest } from './api';

export function getSession() {
  const token = localStorage.getItem('woolconnect_session_token');
  return token ? { token } : null;
}

function setSession(token) {
  localStorage.setItem('woolconnect_session_token', token);
}

export function clearSession() {
  localStorage.removeItem('woolconnect_session_token');
}

export async function signUp(userData) {
  const { data, token, error } = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (token) {
    setSession(token);
  }
  return { data, error };
}

export async function signIn({ email, password }) {
  const { data, token, error } = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (token) {
    setSession(token);
  }
  return { data, error };
}

export async function signOut() {
  clearSession();
  return { error: null };
}

export async function getUserProfile() {
  return await apiRequest('/auth/me', { method: 'GET' });
}

export async function resetPassword(email) {
  // Mock endpoint, implement later if required
  return { data: true };
}

export async function updateUserRole(userId, role) {
  // Not used right now
  return { data: null };
}
