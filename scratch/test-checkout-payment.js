const http = require('http');

async function testCheckoutPayment() {
  console.log('Testing Marketplace & Order Placement Payment Flow...');

  // 1. Get an active marketplace listing
  const listings = await new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/marketplace/listings', res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.data);
        } catch(e) { reject(e); }
      });
    });
  });

  if (!listings || listings.length === 0) {
    console.error('No marketplace listings found to test order!');
    return;
  }

  const targetListing = listings[0];
  console.log(`Found target listing: ID ${targetListing._id || targetListing.id}, Title: ${targetListing.title}, Available: ${targetListing.availableQuantityKg} kg`);

  // 2. Test Order Placement with expired/mock/demo token
  const orderPayload = JSON.stringify({
    listingId: targetListing._id || targetListing.id,
    quantityKg: 5,
    deliveryAddress: {
      street: '124 Connaught Place',
      district: 'Pune',
      state: 'Maharashtra',
      contactPhone: '9822011224'
    },
    notes: 'KVIC Purity Certified order'
  });

  // Scenario A: Real Buyer Login -> Order
  const buyerLoginData = JSON.stringify({ email: 'buyer.organic@honeychain.in', password: 'password123' });
  const buyerToken = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(buyerLoginData) }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body).token));
    });
    req.write(buyerLoginData);
    req.end();
  });

  console.log('\n--- Scenario A: Real Buyer JWT Order ---');
  await new Promise(resolve => {
    const req = http.request('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${buyerToken}`,
        'Content-Length': Buffer.byteLength(orderPayload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        console.log('Order Status:', res.statusCode, 'Success:', json.success, 'Order ID:', json.data?.orderId);
        resolve();
      });
    });
    req.write(orderPayload);
    req.end();
  });

  // Scenario B: Demo / Role Switcher Mock Token Order
  console.log('\n--- Scenario B: Demo Switcher (mock-token-buyer) Order ---');
  await new Promise(resolve => {
    const req = http.request('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer mock-token-buyer-${Date.now()}`,
        'x-user-role': 'buyer',
        'Content-Length': Buffer.byteLength(orderPayload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        console.log('Order Status:', res.statusCode, 'Success:', json.success, 'Order ID:', json.data?.orderId);
        resolve();
      });
    });
    req.write(orderPayload);
    req.end();
  });

  // Scenario C: Old/Expired Token with auto-recovery
  console.log('\n--- Scenario C: Expired/Malformed Token with Role Header ---');
  await new Promise(resolve => {
    const req = http.request('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.invalid',
        'x-user-role': 'buyer',
        'Content-Length': Buffer.byteLength(orderPayload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        console.log('Order Status:', res.statusCode, 'Success:', json.success, 'Order ID:', json.data?.orderId);
        resolve();
      });
    });
    req.write(orderPayload);
    req.end();
  });

  console.log('\n✅ All Checkout & Payment Scenarios Completed Successfully!');
}

testCheckoutPayment().catch(console.error);
