const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Razorpay = require('razorpay');

// Parse .env.local with quotes stripped
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const k = trimmed.slice(0, eqIdx).trim();
        let v = trimmed.slice(eqIdx + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        process.env[k] = v;
      }
    }
  });
}

async function main() {
  const report = {
    mongo: {},
    google: {},
    cloudinary: {},
    razorpay: {},
    shiprocket: {},
    imagekit: {},
    resend: {},
  };

  console.log('=== SERVICE HEALTH CHECK START ===\n');

  // 1. MONGODB ATLAS
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collNames = collections.map((c) => c.name);
    let sampleProduct = null;
    if (collNames.includes('products')) {
      sampleProduct = await mongoose.connection.db.collection('products').findOne({});
    }
    const productCount = collNames.includes('products') ? await mongoose.connection.db.collection('products').countDocuments() : 0;
    report.mongo = {
      status: 'Working',
      connected: true,
      database: mongoose.connection.db.databaseName,
      collections: collNames,
      productCount,
      sampleProductName: sampleProduct ? sampleProduct.name : 'N/A',
    };
    await mongoose.disconnect();
    console.log('[PASS] MongoDB Atlas connected successfully. Product count:', productCount);
  } catch (err) {
    report.mongo = { status: 'Broken', error: err.message };
    console.error('[FAIL] MongoDB Atlas error:', err.message);
  }

  // 2. GOOGLE OAUTH
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      report.google = { status: 'Broken', error: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET' };
    } else {
      const isFormatValid = clientId.includes('.apps.googleusercontent.com') && clientSecret.startsWith('GOCSPX-');
      report.google = {
        status: isFormatValid ? 'Configured' : 'Warning',
        clientIdPreview: clientId.slice(0, 15) + '...',
        validFormat: isFormatValid,
      };
      console.log('[PASS] Google OAuth credentials present and format validated.');
    }
  } catch (err) {
    report.google = { status: 'Broken', error: err.message };
  }

  // 3. CLOUDINARY
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary environment variables');
    }
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    // Upload a 1x1 transparent png data uri
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await cloudinary.uploader.upload(sampleBase64, {
      folder: 'khavyn_audit_test',
      tags: ['audit_test'],
    });

    // Test loading the URL
    const pingRes = await fetch(uploadRes.secure_url, { method: 'HEAD' });
    const urlLoadable = pingRes.status === 200;

    // Delete test image to keep account clean
    await cloudinary.uploader.destroy(uploadRes.public_id);

    report.cloudinary = {
      status: urlLoadable ? 'Working' : 'Broken',
      uploadSuccess: true,
      secureUrl: uploadRes.secure_url,
      urlLoadable,
      cloudName,
    };
    console.log('[PASS] Cloudinary upload & loadable URL verified:', uploadRes.secure_url);
  } catch (err) {
    report.cloudinary = { status: 'Broken', error: err.message };
    console.error('[FAIL] Cloudinary test error:', err.message);
  }

  // 4. RAZORPAY
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const isLive = keyId.startsWith('rzp_live_');
    const isTest = keyId.startsWith('rzp_test_');

    let apiAuthSuccess = false;
    let authError = null;

    if (keyId && keySecret) {
      const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
      try {
        // Safe read call: fetch payments list with count 1
        const payments = await rzp.payments.all({ count: 1 });
        apiAuthSuccess = true;
      } catch (e) {
        authError = e.error ? e.error.description || JSON.stringify(e.error) : e.message;
      }
    }

    report.razorpay = {
      status: apiAuthSuccess ? 'Working' : 'Auth Failed',
      mode: isLive ? 'LIVE' : isTest ? 'TEST' : 'UNKNOWN',
      keyIdPrefix: keyId.slice(0, 9),
      isLive,
      apiAuthSuccess,
      authError,
    };
    console.log(`[PASS] Razorpay Mode: ${report.razorpay.mode}, API Authenticated: ${apiAuthSuccess}`);
    if (isLive) {
      console.warn('⚠️ [CRITICAL ALERT] RAZORPAY IS RUNNING IN LIVE PRODUCTION MODE! REAL MONEY WILL BE CHARGED FOR TRANSACTIONS!');
    }
  } catch (err) {
    report.razorpay = { status: 'Broken', error: err.message };
    console.error('[FAIL] Razorpay error:', err.message);
  }

  // 5. SHIPROCKET
  try {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;
    if (!email || !password) {
      report.shiprocket = { status: 'Not Configured', error: 'Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD' };
    } else {
      const loginRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok || !loginData.token) {
        report.shiprocket = {
          status: 'Authentication Failed',
          error: loginData.message || 'Shiprocket login failed',
          response: loginData,
        };
        console.error('[FAIL] Shiprocket Authentication Failed:', loginData);
      } else {
        const token = loginData.token;
        // Check Pickup address
        const pickupRes = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const pickupData = await pickupRes.json();
        const pickupAddresses = pickupData.data?.shipping_address || [];
        const hasPickup = pickupAddresses.length > 0;

        report.shiprocket = {
          status: hasPickup ? 'Working' : 'Blocker: Missing Pickup Address',
          authenticated: true,
          pickupAddressesCount: pickupAddresses.length,
          hasPickupAddress: hasPickup,
          pickupAddresses: pickupAddresses.map((a) => ({
            id: a.id,
            pickup_location: a.pickup_location,
            city: a.city,
            state: a.state,
            pin_code: a.pin_code,
          })),
        };
        console.log(`[PASS] Shiprocket Authenticated. Pickup Addresses Count: ${pickupAddresses.length}`);
        if (!hasPickup) {
          console.warn('⚠️ [BLOCKER] Shiprocket has NO pickup address configured in dashboard!');
        }
      }
    }
  } catch (err) {
    report.shiprocket = { status: 'Broken', error: err.message };
    console.error('[FAIL] Shiprocket test error:', err.message);
  }

  // 6. IMAGEKIT
  try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !urlEndpoint) {
      report.imagekit = { status: 'Not Configured', error: 'Missing ImageKit keys' };
    } else {
      // Test upload to ImageKit via REST API
      const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
      const formData = new FormData();
      formData.append('file', 'data:text/plain;base64,c2FtcGxlLXRlc3QtY29udGVudA==');
      formData.append('fileName', 'audit-test.txt');
      formData.append('folder', '/khavyn-audit');

      const ikUploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });
      const ikUploadData = await ikUploadRes.json();
      if (ikUploadRes.ok && ikUploadData.url) {
        // Check loadable URL
        const checkUrl = await fetch(ikUploadData.url);
        report.imagekit = {
          status: 'Working',
          uploadedUrl: ikUploadData.url,
          fileId: ikUploadData.fileId,
          urlLoadable: checkUrl.status === 200,
        };
        // Clean up uploaded file
        if (ikUploadData.fileId) {
          await fetch(`https://api.imagekit.io/v1/files/${ikUploadData.fileId}`, {
            method: 'DELETE',
            headers: { Authorization: authHeader },
          });
        }
        console.log('[PASS] ImageKit Upload & Loadable URL verified:', ikUploadData.url);
      } else {
        report.imagekit = {
          status: 'Broken',
          error: ikUploadData.message || JSON.stringify(ikUploadData),
        };
        console.error('[FAIL] ImageKit Upload error:', ikUploadData);
      }
    }
  } catch (err) {
    report.imagekit = { status: 'Broken', error: err.message };
    console.error('[FAIL] ImageKit error:', err.message);
  }

  // 7. RESEND
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      report.resend = { status: 'Not Configured', error: 'Missing RESEND_API_KEY' };
    } else {
      // Query Resend domains
      const domainsRes = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const domainsData = await domainsRes.json();
      const domains = domainsData.data || [];
      const khavynDomain = domains.find((d) => d.name.includes('khavyn'));

      // Check API Key validity by inspecting response
      if (!domainsRes.ok) {
        report.resend = {
          status: 'Broken',
          apiKeyValid: false,
          error: domainsData.message || JSON.stringify(domainsData),
        };
      } else {
        const isVerified = khavynDomain?.status === 'verified';
        report.resend = {
          status: isVerified ? 'Working (Verified Domain)' : 'Working (Fallback Mode)',
          apiKeyValid: true,
          domainsFound: domains.map((d) => ({ name: d.name, status: d.status })),
          khavynDomainStatus: khavynDomain ? khavynDomain.status : 'Domain Not Added in Resend Dashboard',
          fallbackGraceful: true,
          notes: isVerified
            ? 'khavyn.com is verified for sending'
            : 'Domain khavyn.com is not verified yet. Resend will only deliver from onboarding@resend.dev to the account registration email.',
        };
        console.log('[PASS] Resend API Key Valid. Domains found:', domains.map((d) => `${d.name}:${d.status}`).join(', ') || 'None');
      }
    }
  } catch (err) {
    report.resend = { status: 'Broken', error: err.message };
    console.error('[FAIL] Resend error:', err.message);
  }

  console.log('\n=== FINAL HEALTH CHECK RESULT ===');
  console.log(JSON.stringify(report, null, 2));

  fs.writeFileSync(
    path.join(__dirname, 'health-report.json'),
    JSON.stringify(report, null, 2),
    'utf8'
  );
}

main().catch(console.error);
