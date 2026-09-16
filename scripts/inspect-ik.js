const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
let privateKey = '';
content.split('\n').forEach((l) => {
  if (l.trim().startsWith('IMAGEKIT_PRIVATE_KEY=')) {
    privateKey = l.trim().slice('IMAGEKIT_PRIVATE_KEY='.length).trim().replace(/\"/g, '');
  }
});

async function run() {
  const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
  
  // Test 1: Upload a sample mp4 or text or image
  const formData = new FormData();
  formData.append('file', 'data:text/plain;base64,SEVMTE8gV09STEQ=');
  formData.append('fileName', 'test-doc.txt');
  formData.append('folder', '/khavyn/product-videos');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: authHeader },
    body: formData,
  });
  const data = await res.json();
  console.log('Upload Result:', data);

  if (data.url) {
    const fetchRes = await fetch(data.url);
    console.log('Fetch Status:', fetchRes.status);
    console.log('Fetch Text:', await fetchRes.text());
    
    // Clean up
    await fetch(`https://api.imagekit.io/v1/files/${data.fileId}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    });
    console.log('Cleaned up.');
  }
}

run().catch(console.error);
