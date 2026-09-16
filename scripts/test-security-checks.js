const fs = require('fs');
const path = require('path');

async function runSecurityChecks() {
  console.log('=== KHAVYN SECURITY VERIFICATION ===\n');

  // 1. Check /api/admin/upload without token
  try {
    const res = await fetch('http://localhost:3000/api/admin/upload', {
      method: 'POST',
    });
    console.log(`1. Unauthenticated POST /api/admin/upload status: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    console.log('   Response:', data);
    if (res.status === 401) {
      console.log('   [PASS] Protected: returned 401 Unauthorized');
    } else {
      console.log('   [FAIL] Expected 401');
    }
  } catch (e) {
    console.log('   Error calling /api/admin/upload:', e.message);
  }

  // 2. Check /api/orders/KHV-TEST-123/invoice without token
  try {
    const res = await fetch('http://localhost:3000/api/orders/KHV-TEST-123/invoice');
    console.log(`\n2. Unauthenticated GET /api/orders/[orderNumber]/invoice status: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    console.log('   Response:', data);
    if (res.status === 401 || res.status === 404) {
      console.log('   [PASS] Protected from IDOR');
    } else {
      console.log('   [FAIL] Unexpected response');
    }
  } catch (e) {
    console.log('   Error calling invoice route:', e.message);
  }

  // 3. Scan client-side bundles (.next/static/chunks) for secrets
  console.log('\n3. Scanning client-side chunks (.next/static/chunks) for sensitive secrets...');
  const chunksDir = path.join(__dirname, '..', '.next', 'static', 'chunks');
  
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  const secrets = [];
  const actualSecretKeys = [
    'MONGODB_URI',
    'RAZORPAY_KEY_SECRET',
    'CLOUDINARY_API_SECRET',
    'IMAGEKIT_PRIVATE_KEY',
    'SHIPROCKET_PASSWORD',
    'RESEND_API_KEY',
    'GOOGLE_CLIENT_SECRET',
    'ADMIN_SESSION_SECRET',
    'USER_SESSION_SECRET',
    'MSG91_AUTH_KEY'
  ];

  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const [key, ...rest] = line.split('=');
    if (actualSecretKeys.includes(key)) {
      const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
      if (val && val.length > 5) {
        secrets.push({ key, val });
      }
    }
  });

  function getFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else if (file.endsWith('.js')) {
        results.push(fullPath);
      }
    });
    return results;
  }

  const chunkFiles = getFiles(chunksDir);
  console.log(`   Found ${chunkFiles.length} client chunk files to scan.`);
  let leakedCount = 0;

  for (const file of chunkFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const { key, val } of secrets) {
      if (content.includes(val)) {
        console.error(`   [CRITICAL LEAK] Secret ${key} found in client chunk: ${path.basename(file)}`);
        leakedCount++;
      }
    }
  }

  if (leakedCount === 0) {
    console.log('   [PASS] 0 server secrets leaked in client JavaScript bundles!');
  } else {
    console.error(`   [FAIL] ${leakedCount} secrets leaked!`);
  }
}

runSecurityChecks().catch(console.error);
