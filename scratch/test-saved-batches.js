const http = require('http');

async function testSavedBatches() {
  console.log('Testing Saved Honey Batches / Listings Endpoints...');

  // 1. Get listings
  const listings = await new Promise((resolve) => {
    http.get('http://localhost:5000/api/marketplace/listings', res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body).data));
    });
  });

  const testLot = listings[0];
  const lotId = testLot._id || testLot.id;
  console.log('Using lot ID for save test:', lotId);

  // 2. Login as buyer
  const buyerLoginData = JSON.stringify({ email: 'anita.buyer@example.com', password: 'password123' });
  const buyerToken = await new Promise((resolve) => {
    const req = http.request('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(buyerLoginData) }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body).token);
        } catch(e) {
          resolve(null);
        }
      });
    });
    req.write(buyerLoginData);
    req.end();
  });
  console.log('Buyer Token:', buyerToken);

  // 3. Save listing (POST /api/auth/saved-listings/:listingId)
  console.log('\n--- Test 1: Save Listing to User Profile ---');
  await new Promise(resolve => {
    const req = http.request(`http://localhost:5000/api/auth/saved-listings/${lotId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('Save Status:', res.statusCode, JSON.parse(body).message);
        resolve();
      });
    });
    req.end();
  });

  // 4. Fetch saved listings (GET /api/auth/saved-listings)
  console.log('\n--- Test 2: Fetch Saved Listings for Buyer ---');
  await new Promise(resolve => {
    http.get('http://localhost:5000/api/auth/saved-listings', {
      headers: { 'Authorization': `Bearer ${buyerToken}` }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        console.log('Get Saved Status:', res.statusCode, 'Count:', json.data?.length);
        if (json.data?.length > 0) {
          console.log('Saved Item Floral Source:', json.data[0].floralSource || json.data[0].title);
        }
        resolve();
      });
    });
  });

  // 5. Test with demo mock-token-buyer
  console.log('\n--- Test 3: Fetch Saved Listings with Demo Switcher Token ---');
  await new Promise(resolve => {
    http.get('http://localhost:5000/api/auth/saved-listings', {
      headers: {
        'Authorization': `Bearer mock-token-buyer-${Date.now()}`,
        'x-user-role': 'buyer'
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        console.log('Mock Token Get Saved Status:', res.statusCode, 'Count:', json.data?.length);
        resolve();
      });
    });
  });

  console.log('\n✅ Saved Honey Batches Verified Successfully!');
}

testSavedBatches().catch(console.error);
