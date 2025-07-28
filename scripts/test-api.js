const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testAPI() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing API endpoints...\n');

  const endpoints = [
    '/api/master-barang',
    '/api/master-kategori',
    '/api/stock-barang'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);

      const response = await fetch(`${baseUrl}${endpoint}?page=1&limit=5`);
      const data = await response.json();

      console.log(`Status: ${response.status}`);
      console.log(`Success: ${data.success}`);
      console.log(`Total records: ${data.total || 0}`);
      console.log(`Data length: ${data.data ? data.data.length : 0}`);

      if (data.data && data.data.length > 0) {
        console.log('Sample record:');
        console.log(JSON.stringify(data.data[0], null, 2));
      } else {
        console.log('❌ No data returned');
        if (data.message) {
          console.log(`Error message: ${data.message}`);
        }
      }

      console.log('---\n');

    } catch (error) {
      console.error(`❌ Error testing ${endpoint}:`, error.message);
      console.log('---\n');
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:3000\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev\n');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testAPI();
  }
}

main();
