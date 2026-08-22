export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('woolconnect_session_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`https://woolconnect.onrender.com/api${endpoint}`, config);
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
