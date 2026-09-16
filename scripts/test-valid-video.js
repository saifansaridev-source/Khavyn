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

async function testValidVideo() {
  const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
  
  // 1-frame valid WebM base64
  const validWebmBase64 = 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnAQAAAAAAABtTuAZkh1kffmSGlDKFlSua1OsAuE2bnSdovImSc55q1QiTR2OASt3qAlqm36GCA+UBAAAAAAAAHOEBAAAAAAAAHTuAZ4EA5AEAEE3gQcKmgQZ1bWl4YWSCoEN1c3RvbYMAAAAA';

  const formData = new FormData();
  formData.append('file', 'data:video/webm;base64,' + validWebmBase64);
  formData.append('fileName', 'valid-test.webm');
  formData.append('folder', '/khavyn/product-videos');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: authHeader },
    body: formData,
  });

  const data = await res.json();
  console.log('Upload status:', res.status);
  console.log('URL:', data.url);

  if (res.ok && data.url) {
    const checkRes = await fetch(data.url);
    console.log('Video URL load status:', checkRes.status);
    if (data.fileId) {
      await fetch(`https://api.imagekit.io/v1/files/${data.fileId}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      console.log('Cleaned up file.');
    }
  } else {
    console.log('Error:', data);
  }
}

testValidVideo().catch(console.error);
