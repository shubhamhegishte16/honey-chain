export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('honeychain_session_token');
  const demoUserRaw = localStorage.getItem('honeychain_demo_user');
  let demoUser = null;
  try {
    demoUser = demoUserRaw ? JSON.parse(demoUserRaw) : null;
  } catch (e) {}

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(demoUser?.role && { 'x-user-role': demoUser.role }),
    ...(demoUser?.email && { 'x-user-email': demoUser.email }),
    ...(demoUser?.id && { 'x-user-id': demoUser.id }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`/api${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }
    
    // The backend returns { success, data, token }
    // We return { data: unwrappedData, token }
    return { 
      data: data.data !== undefined ? data.data : data,
      token: data.token 
    };
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { error };
  }
}
