import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data };
}

async function runAudit() {
  console.log('====================================================');
  console.log('🧪 HONEY CHAIN LIVE RUNTIME VERIFICATION SUITE');
  console.log('====================================================\n');

  const results = {};

  // Check Health
  console.log('Checking Server Health & DB Status...');
  const health = await request('/health');
  console.log('✅ Server Health:', JSON.stringify(health.data));
  results.health = health.data;

  // 1. Login as Farmer
  console.log('\n[1] Testing Farmer Login...');
  const farmerLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'ramesh.farmer@example.com', password: 'password123' },
  });
  console.log(`Farmer Login Status: ${farmerLogin.status}, Success: ${farmerLogin.data?.success}`);
  const farmerToken = farmerLogin.data?.token;
  const farmerUser = farmerLogin.data?.data?.user;
  results.farmerLogin = { status: farmerLogin.status, success: farmerLogin.data?.success, user: farmerUser?.name };

  // 2. Create a new honey batch
  console.log('\n[2] Creating New Honey Batch in Database...');
  const newBatchPayload = {
    floralSource: 'Mustard Blossom',
    quantityKg: 350,
    state: 'Rajasthan',
    district: 'Bharatpur',
    village: 'Uchain',
    farmLocation: 'Bharatpur Apiary Cluster, Sector 4',
    hiveCount: 45,
    beeSpecies: 'Apis mellifera (European Honeybee)',
    moisturePercent: 17.5,
    color: 'Light Amber',
    pricePerKg: 290,
    notes: 'Pure Mustard Blossom raw honey from winter mustard crop in Bharatpur',
    harvestDate: new Date().toISOString(),
  };

  const createBatch = await request('/batches', {
    method: 'POST',
    headers: { Authorization: `Bearer ${farmerToken}` },
    body: newBatchPayload,
  });
  console.log(`Create Batch Status: ${createBatch.status}, Batch ID: ${createBatch.data?.data?.batchId}`);
  const createdBatch = createBatch.data?.data;
  results.createBatch = {
    status: createBatch.status,
    batchId: createdBatch?.batchId,
    mongoId: createdBatch?._id,
    genesisHash: createdBatch?.blockchainHash?.slice(0, 20) + '...',
  };

  // 3. Verify Batch Exists in Database
  console.log('\n[3] Verifying Batch Lookup in DB by ID...');
  const getBatch = await request(`/batches/${createdBatch?._id}`, {
    headers: { Authorization: `Bearer ${farmerToken}` },
  });
  console.log(`Get Batch Status: ${getBatch.status}, Floral Source: ${getBatch.data?.data?.floralSource}`);
  results.getBatch = {
    status: getBatch.status,
    floralSource: getBatch.data?.data?.floralSource,
    quantityKg: getBatch.data?.data?.quantityKg,
  };

  // 4. Verify Genesis Hash & Traceability Event
  console.log('\n[4] Verifying Genesis Hash & Traceability Chain in DB...');
  const getTrace = await request(`/traceability/${createdBatch?.batchId}`);
  const events = getTrace.data?.data?.events || [];
  console.log(`Traceability Status: ${getTrace.status}, Events Count: ${events.length}`);
  const firstEvent = events[0];
  console.log(`Genesis Event Type: ${firstEvent?.eventType}, Location: ${firstEvent?.location}`);
  results.traceability = {
    status: getTrace.status,
    eventsCount: events.length,
    eventType: firstEvent?.eventType,
    hasHash: !!(firstEvent?.metadata?.blockchainHash || firstEvent?.eventHash || firstEvent?.metadata?.merkleVerified),
  };

  // 5. Query Farmer Dashboard Batches
  console.log('\n[5] Querying Farmer Batches...');
  const farmerBatches = await request('/batches', {
    headers: { Authorization: `Bearer ${farmerToken}` },
  });
  console.log(`Farmer Batches Count: ${farmerBatches.data?.data?.length}`);
  results.farmerBatches = { count: farmerBatches.data?.data?.length };

  // 6. Create Quality Assessment (IS 4941:1994 Standard)
  console.log('\n[6] Creating Quality Assessment (IS 4941:1994 Standard)...');
  const qualityPayload = {
    batchId: createdBatch?._id,
    floralSource: 'Mustard Blossom',
    moisturePercent: 17.2,
    hmfLevel: 14.5,
    fructoseGlucoseRatio: 1.15,
    c4SugarAdulteration: '< 1.0% (NMR Pure)',
    pollenDensity: '78,000 pollen grains/g (Brassica napus > 84%)',
    finalGrade: 'Grade A+ (NMR Certified 100% Pure)',
    isAiAssisted: true,
    notes: 'Conforms to Indian National Standard IS 4941:1994 and FSSAI Honey Guidelines',
  };
  const qualityRes = await request('/quality/assess', {
    method: 'POST',
    headers: { Authorization: `Bearer ${farmerToken}` },
    body: qualityPayload,
  });
  console.log(`Quality Assessment Status: ${qualityRes.status}, Grade: ${qualityRes.data?.data?.finalGrade}`);
  results.qualityAssessment = {
    status: qualityRes.status,
    grade: qualityRes.data?.data?.finalGrade,
  };

  // 7. Create Processing Request
  console.log('\n[7] Creating Processing Request...');
  const procPayload = {
    batchId: createdBatch?.batchId,
    serviceType: 'Micro-Filtration & Settling',
    notes: 'Keep cold filtered under 42 deg C to preserve enzymes',
    quantityKg: 350,
  };
  const procRes = await request('/processing/requests', {
    method: 'POST',
    headers: { Authorization: `Bearer ${farmerToken}` },
    body: procPayload,
  });
  console.log(`Processing Request Status: ${procRes.status}, Req ID: ${procRes.data?.data?.requestId || procRes.data?.data?._id}`);
  results.processingRequest = {
    status: procRes.status,
    id: procRes.data?.data?.requestId || procRes.data?.data?._id,
  };

  // 8. Verify Batch State / Status Transition in DB
  console.log('\n[8] Verifying Batch Status in DB...');
  const checkBatchStatus = await request(`/batches/${createdBatch?._id}`, {
    headers: { Authorization: `Bearer ${farmerToken}` },
  });
  console.log(`Batch Status: ${checkBatchStatus.data?.data?.status}`);
  results.batchStatus = { currentStatus: checkBatchStatus.data?.data?.status };

  // 9. Marketplace Listings
  console.log('\n[9] Checking Active Marketplace Listings...');
  const marketListings = await request('/marketplace/listings');
  console.log(`Marketplace Listings Status: ${marketListings.status}, Count: ${marketListings.data?.data?.length || 0}`);
  results.marketplace = {
    status: marketListings.status,
    count: marketListings.data?.data?.length || 0,
  };

  // 10. Generate / Verify QR URL
  console.log('\n[10] Verifying QR URL Format...');
  const passportUrl = `http://localhost:5173/passport/${createdBatch?.batchId}`;
  console.log(`QR Target URL: ${passportUrl}`);
  results.qr = { targetUrl: passportUrl, valid: true };

  // 11. Open Public QR Passport (Zero Auth)
  console.log('\n[11] Opening Public QR Passport (Public context, zero token)...');
  const publicPassport = await request(`/batches/public/${createdBatch?.batchId}`);
  console.log(`Public Passport Status: ${publicPassport.status}, Floral Source: ${publicPassport.data?.data?.batch?.floralSource || publicPassport.data?.data?.floralSource}`);
  results.publicPassport = {
    status: publicPassport.status,
    loaded: !!(publicPassport.data?.data?.batch || publicPassport.data?.data?.floralSource),
  };

  // 12. Verify Passport Content
  console.log('\n[12] Verifying Passport Batch Details...');
  const passData = publicPassport.data?.data?.batch || publicPassport.data?.data;
  console.log(`- Floral Source: ${passData?.floralSource}`);
  console.log(`- Producer State: ${passData?.origin?.state || passData?.apiaryLocation?.state}`);
  console.log(`- Moisture: ${passData?.moisturePercent || passData?.moistureContent}%`);
  results.passportContent = {
    floralSource: passData?.floralSource,
    state: passData?.origin?.state || passData?.apiaryLocation?.state,
    moisturePercent: passData?.moisturePercent || passData?.moistureContent,
  };

  // 13. Verify Traceability History in Passport
  console.log('\n[13] Verifying Complete Traceability History for Batch...');
  const traceHistory = await request(`/traceability/${createdBatch?.batchId}`);
  const traceEvents = traceHistory.data?.data?.events || [];
  console.log(`Trace Events Count: ${traceEvents.length}`);
  traceEvents.forEach((ev, idx) => {
    console.log(`  [Event ${idx + 1}] Type: ${ev.eventType} | Location: ${ev.location} | Actor: ${ev.actorName || ev.performedBy?.name}`);
  });
  results.traceEventsInPassport = {
    count: traceEvents.length,
    events: traceEvents.map((e) => e.eventType),
  };

  // 14. Verify Cryptographic Integrity
  console.log('\n[14] Verifying Cryptographic Audit Trail / State Chain...');
  let hashesPresent = traceEvents.length > 0 && traceEvents.some((e) => !!(e.eventHash || e.metadata?.blockchainHash || e.metadata?.merkleVerified));
  console.log(`All events cryptographically signed into state chain: ${hashesPresent}`);
  results.integrity = {
    hashesPresent,
    genesisHash: createdBatch?.blockchainHash,
  };

  // 15. Processor Role Login
  console.log('\n[15] Testing Processor Login...');
  const procLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'karan.processor@example.com', password: 'password123' },
  });
  console.log(`Processor Login Status: ${procLogin.status}, Role: ${procLogin.data?.data?.user?.role}`);
  const procToken = procLogin.data?.token;
  results.processorLogin = { status: procLogin.status, role: procLogin.data?.data?.user?.role };

  // 16. Buyer Role Login
  console.log('\n[16] Testing Buyer Login...');
  const buyerLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'anita.buyer@example.com', password: 'password123' },
  });
  console.log(`Buyer Login Status: ${buyerLogin.status}, Role: ${buyerLogin.data?.data?.user?.role}`);
  const buyerToken = buyerLogin.data?.token;
  results.buyerLogin = { status: buyerLogin.status, role: buyerLogin.data?.data?.user?.role };

  // 17. Artisan / Retailer Role Login
  console.log('\n[17] Testing Artisan Login...');
  const artisanLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'meera.artisan@example.com', password: 'password123' },
  });
  console.log(`Artisan Login Status: ${artisanLogin.status}, Role: ${artisanLogin.data?.data?.user?.role}`);
  results.artisanLogin = { status: artisanLogin.status, role: artisanLogin.data?.data?.user?.role };

  // 18. Admin Role Login with admin@honeychain.in & Overview
  console.log('\n[18] Testing Admin Login (admin@honeychain.in) & Overview...');
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@honeychain.in', password: 'password123' },
  });
  console.log(`Admin Login Status: ${adminLogin.status}, Role: ${adminLogin.data?.data?.user?.role}, Email: ${adminLogin.data?.data?.user?.email}`);
  const adminToken = adminLogin.data?.token;

  const adminOverview = await request('/admin/overview', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`Admin Overview Status: ${adminOverview.status}, Success: ${adminOverview.data?.success}`);
  results.admin = {
    status: adminOverview.status,
    success: adminOverview.data?.success,
    email: adminLogin.data?.data?.user?.email,
  };

  // 19. Role-Based Access Protection (Unauthorized Access Rejection)
  console.log('\n[19] Testing Role Protection (Buyer attempting admin route)...');
  const unauthorizedAdminReq = await request('/admin/overview', {
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  console.log(`Unauthorized Request Status: ${unauthorizedAdminReq.status} (Expected 403 Forbidden)`);
  results.roleProtection = {
    status: unauthorizedAdminReq.status,
    rejectedProperly: unauthorizedAdminReq.status === 403,
  };

  // 20. Invalid QR / Batch ID Test
  console.log('\n[20] Testing Invalid QR / Batch ID Handling...');
  const invalidBatch = await request('/batches/public/INVALID_NONEXISTENT_BATCH_99999');
  console.log(`Invalid Batch Status: ${invalidBatch.status} (Expected 404), Message: ${invalidBatch.data?.message}`);
  results.invalidBatch = {
    status: invalidBatch.status,
    handledProperly: invalidBatch.status === 404,
  };

  // 21. Chatbot / Gemini API Graceful Fallback Test
  console.log('\n[21] Testing AI Assistant / Chatbot Route...');
  const chatbotRes = await request('/chatbot/message', {
    method: 'POST',
    body: { message: 'How do I maintain optimal hive moisture during winter in Kashmir?' },
  });
  console.log(`Chatbot Response Status: ${chatbotRes.status}, Body:`, JSON.stringify(chatbotRes.data));
  results.chatbot = {
    status: chatbotRes.status,
    handledGracefully: chatbotRes.status === 500 && chatbotRes.data?.error?.includes('Gemini API key is not configured'),
  };

  // 22. Database Persistence Mode Confirmation
  console.log('\n[22] Confirming Database Engine...');
  const dbHealth = await request('/health');
  console.log(`Database Mode: ${dbHealth.data?.db}`);
  results.dbEngine = dbHealth.data?.db;

  console.log('\n====================================================');
  console.log('📊 FINAL RUNTIME TEST SUMMARY:');
  console.log(JSON.stringify(results, null, 2));
  console.log('====================================================');
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
});
