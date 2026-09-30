import { apiRequest } from './api';
import { DEMO_PROFILES } from './mockData';

export function getSession() {
  const token = localStorage.getItem('honeychain_session_token') || localStorage.getItem('honeychain_session_token');
  return token ? { token } : null;
}

export function setSession(token) {
  localStorage.setItem('honeychain_session_token', token);
}

export function clearSession() {
  localStorage.removeItem('honeychain_session_token');
  localStorage.removeItem('honeychain_session_token');
  localStorage.removeItem('honeychain_demo_user');
}

export function setDemoUser(roleKey = 'farmer') {
  const profile = DEMO_PROFILES[roleKey] || DEMO_PROFILES.farmer;
  localStorage.setItem('honeychain_demo_user', JSON.stringify(profile));
  setSession(`mock-token-${roleKey}-${Date.now()}`);
  return profile;
}

export function getStoredDemoUser() {
  try {
    const raw = localStorage.getItem('honeychain_demo_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function signUp(userData) {
  try {
    const { data, token, error } = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (token) {
      setSession(token);
      return { data, error };
    }
  } catch {
    // Backend offline fallback
  }

  // Standalone offline registration fallback
  const mockUser = {
    id: `user-${Date.now()}`,
    name: userData.name || 'New Beekeeper',
    email: userData.email,
    role: userData.role || 'farmer',
    state: userData.state || 'Rajasthan',
    district: userData.district || 'Bharatpur',
    village: userData.village || '',
    organization: userData.organization || 'KVIC Bee Cooperative',
    isVerified: true,
  };
  localStorage.setItem('honeychain_demo_user', JSON.stringify(mockUser));
  setSession(`mock-token-${Date.now()}`);
  return { data: { user: mockUser }, token: 'mock-token' };
}

export async function signIn({ email, password }) {
  try {
    const { data, token, error } = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (token) {
      setSession(token);
      return { data, error };
    }
  } catch {
    // Backend offline fallback
  }

  // Standalone offline login matching email or role
  let matchedRole = 'farmer';
  if (email.includes('admin') || email.includes('kvic')) matchedRole = 'admin';
  else if (email.includes('quality') || email.includes('lab')) matchedRole = 'quality';
  else if (email.includes('processor') || email.includes('bottl')) matchedRole = 'processor';
  else if (email.includes('buyer') || email.includes('fmcg')) matchedRole = 'buyer';

  const user = setDemoUser(matchedRole);
  return { data: { user }, token: 'mock-token-demo' };
}

export async function signOut() {
  clearSession();
  return { error: null };
}

export async function getUserProfile() {
  try {
    const res = await apiRequest('/auth/me', { method: 'GET' });
    if (res.data) return res;
  } catch {
    // Backend offline fallback
  }
  const demo = getStoredDemoUser() || DEMO_PROFILES.farmer;
  return { data: { user: demo } };
}

export async function resetPassword(email) {
  return { data: true };
}

export async function updateUserRole(userId, role) {
  return { data: null };
}

export async function getSavedListings() {
  return { data: [] };
}

export async function addSavedListing(listingId) {
  return { data: true };
}

export async function removeSavedListing(listingId) {
  return { data: true };
}
