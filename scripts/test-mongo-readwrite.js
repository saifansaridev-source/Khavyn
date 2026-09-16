const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read URI from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
let uri = '';
content.split('\n').forEach((l) => {
  if (l.trim().startsWith('MONGODB_URI=')) {
    uri = l.trim().slice('MONGODB_URI='.length).trim();
    if (uri.startsWith('"') && uri.endsWith('"')) uri = uri.slice(1, -1);
  }
});

async function runTest() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected! Database:', mongoose.connection.name);

  const testCollection = mongoose.connection.collection('audit_healthcheck');
  
  // Write test
  const testDoc = {
    test: 'khavyn_audit',
    timestamp: new Date(),
    status: 'ok',
  };
  const insertResult = await testCollection.insertOne(testDoc);
  console.log('[WRITE TEST PASS] Inserted document ID:', insertResult.insertedId.toString());

  // Read test
  const readDoc = await testCollection.findOne({ _id: insertResult.insertedId });
  console.log('[READ TEST PASS] Fetched document:', readDoc);

  // Clean up
  await testCollection.deleteOne({ _id: insertResult.insertedId });
  console.log('[CLEANUP PASS] Removed test document.');

  await mongoose.disconnect();
  console.log('MongoDB Read/Write test completed successfully!');
}

runTest().catch((err) => {
  console.error('[FAIL] MongoDB Test Error:', err);
  process.exit(1);
});
