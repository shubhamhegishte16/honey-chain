const http = require('http');

async function testAdmin() {
  console.log('Testing Admin Endpoints with Real JWT & Mock Token...');

  // 1. Real login as admin
  const loginData = JSON.stringify({ email: 'admin@honeychain.in', password: 'password123' });
  
  const token = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.token);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.write(loginData);
    req.end();
  });

  console.log('Admin JWT Token obtained:', token ? 'YES' : 'NO');

  // Test /api/admin/dashboard with JWT
  await new Promise(resolve => {
    http.get('http://localhost:5000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('[JWT] /api/admin/dashboard Status:', res.statusCode, JSON.parse(body).success ? 'SUCCESS' : 'FAILED');
        resolve();
      });
    });
  });

  // Test /api/admin/dashboard with Mock Token (from role switcher)
  await new Promise(resolve => {
    http.get('http://localhost:5000/api/admin/dashboard', {
      headers: { Authorization: `Bearer mock-token-admin-${Date.now()}` }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('[Mock Token] /api/admin/dashboard Status:', res.statusCode, JSON.parse(body).success ? 'SUCCESS' : 'FAILED');
        resolve();
      });
    });
  });

  // Test /api/admin/overview with Mock Token
  await new Promise(resolve => {
    http.get('http://localhost:5000/api/admin/overview', {
      headers: { Authorization: `Bearer mock-token-admin-${Date.now()}` }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('[Mock Token] /api/admin/overview Status:', res.statusCode, JSON.parse(body).success ? 'SUCCESS' : 'FAILED');
        resolve();
      });
    });
  });

  // Test /api/admin/users with Mock Token
  await new Promise(resolve => {
    http.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer mock-token-admin-${Date.now()}` }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('[Mock Token] /api/admin/users Status:', res.statusCode, 'Count:', JSON.parse(body).count);
        resolve();
      });
    });
  });
}

testAdmin().catch(console.error);
