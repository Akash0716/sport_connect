import app from '../src/app.js';
import prisma from '../src/config/db.js';
import http from 'http';
import assert from 'assert';

const PORT = 5099;
let server;
let baseUrl;

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${path}`;
    const parsedUrl = new URL(url);

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          resolve({ status: res.statusCode, body });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting SportConnect API Test Suite...\n');

  // Start temporary HTTP server
  await new Promise((resolve) => {
    server = app.listen(PORT, () => {
      baseUrl = `http://localhost:${PORT}`;
      console.log(`Test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // 1. Health check test
    console.log('1. Testing GET /api/health...');
    const health = await makeRequest('/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'UP');
    console.log('   ✅ Health check passed');

    // 2. Registration & Login tests
    console.log('\n2. Testing Auth endpoints (Register & Login)...');
    const testEmail = `testplayer_${Date.now()}@sportconnect.com`;
    const regRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Player',
        email: testEmail,
        password: 'Password@123',
        confirmPassword: 'Password@123',
      },
    });
    assert.strictEqual(regRes.status, 201);
    assert.ok(regRes.body.data.token);
    const playerToken = regRes.body.data.token;
    console.log('   ✅ Player Registration passed');

    // Admin login test (from seed)
    const adminLoginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@sportconnect.com',
        password: 'Admin@123',
      },
    });
    assert.strictEqual(adminLoginRes.status, 200);
    const adminToken = adminLoginRes.body.data.token;
    console.log('   ✅ Admin Login passed');

    // 3. Unauthorized guard test
    console.log('\n3. Testing Role Authorization Guard...');
    const unauthSportRes = await makeRequest('/api/sports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${playerToken}` },
      body: { name: 'Unauthorized Sport Test' },
    });
    assert.strictEqual(unauthSportRes.status, 403);
    console.log('   ✅ Non-admin sport creation blocked (403 Forbidden)');

    // 4. Admin Sport creation & Duplicate check
    console.log('\n4. Testing Admin Sport Creation & Uniqueness...');
    const newSportName = `Squash_${Date.now()}`;
    const createSportRes = await makeRequest('/api/sports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { name: newSportName, description: 'High-speed racket sport' },
    });
    assert.strictEqual(createSportRes.status, 201);
    const createdSportId = createSportRes.body.data.id;
    console.log('   ✅ Admin created sport successfully');

    // Duplicate sport test
    const dupSportRes = await makeRequest('/api/sports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { name: newSportName },
    });
    assert.strictEqual(dupSportRes.status, 400);
    console.log('   ✅ Duplicate sport name rejected (400 Bad Request)');

    // 5. Past Date Session Creation Guard Test
    console.log('\n5. Testing Past Session Guard...');
    const pastSessionRes = await makeRequest('/api/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${playerToken}` },
      body: {
        sportId: createdSportId,
        date: '2020-01-01',
        startTime: '10:00',
        venue: 'Test Arena',
        additionalPlayersNeeded: 4,
      },
    });
    assert.strictEqual(pastSessionRes.status, 400);
    console.log('   ✅ Past session creation rejected by backend guard');

    // 6. Valid Session Creation & Joining
    console.log('\n6. Testing Valid Session Creation & Joining...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const validSessionRes = await makeRequest('/api/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${playerToken}` },
      body: {
        sportId: createdSportId,
        date: tomorrowStr,
        startTime: '18:00',
        venue: 'Test Campus Ground',
        additionalPlayersNeeded: 2,
      },
    });
    assert.strictEqual(validSessionRes.status, 201);
    const sessionId = validSessionRes.body.data.id;
    console.log('   ✅ Session created successfully');

    // Join session as Admin
    const joinRes = await makeRequest(`/api/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(joinRes.status, 200);
    console.log('   ✅ Admin joined session successfully');

    // Duplicate join guard test
    const dupJoinRes = await makeRequest(`/api/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(dupJoinRes.status, 400);
    console.log('   ✅ Duplicate join rejected (400 Bad Request)');

    // 7. Cancellation Guard Test
    console.log('\n7. Testing Session Cancellation with Reason...');
    const cancelRes = await makeRequest(`/api/sessions/${sessionId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${playerToken}` },
      body: { cancellationReason: 'Weather forecast heavy rain warning' },
    });
    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.body.data.status, 'CANCELLED');
    console.log('   ✅ Session cancelled by creator with reason');

    // 8. Admin Reports Analytics Test
    console.log('\n8. Testing Admin Reports API...');
    const reportsRes = await makeRequest('/api/reports/analytics?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(reportsRes.status, 200);
    assert.ok(Array.isArray(reportsRes.body.data.sportPopularity));
    console.log('   ✅ Admin reports metrics calculated from PostgreSQL');

    console.log('\n✨ ALL BACKEND INTEGRATION TESTS PASSED CLEANLY!\n');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
}

runTests();
