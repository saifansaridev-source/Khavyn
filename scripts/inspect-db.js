const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '..', '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
let uri = '';
content.split('\n').forEach((l) => {
  if (l.trim().startsWith('MONGODB_URI=')) {
    uri = l.trim().slice('MONGODB_URI='.length).trim();
    if (uri.startsWith('"') && uri.endsWith('"')) uri = uri.slice(1, -1);
  }
});

async function check() {
  await mongoose.connect(uri);
  console.log('Connected to DB:', mongoose.connection.name);
  const dbs = await mongoose.connection.db.admin().listDatabases();
  console.log('All DBs on cluster:', dbs.databases.map(d => `${d.name} (${d.sizeOnDisk} bytes)`));
  
  const testDb = mongoose.connection.useDb('test');
  const settings = await testDb.collection('storesettings').find({}).toArray();
  console.log('storesettings count:', settings.length);
  if (settings.length > 0) {
    console.log('StoreSettings doc:', JSON.stringify(settings[0], null, 2));
  }
  await mongoose.disconnect();
}
check().catch(console.error);
