const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
let privateKey = '';
let urlEndpoint = '';
content.split('\n').forEach((l) => {
  if (l.trim().startsWith('IMAGEKIT_PRIVATE_KEY=')) {
    privateKey = l.trim().slice('IMAGEKIT_PRIVATE_KEY='.length).trim().replace(/\"/g, '');
  }
  if (l.trim().startsWith('IMAGEKIT_URL_ENDPOINT=')) {
    urlEndpoint = l.trim().slice('IMAGEKIT_URL_ENDPOINT='.length).trim().replace(/\"/g, '');
  }
});

async function testVideoUpload() {
  console.log('Testing ImageKit Video Upload with Private Key...');
  const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
  
  // A minimal valid MP4 file (ftyp box header, ~32 bytes)
  const dummyMp4Hex = '000000186674797069736f6d0000020069736f6d69736f32617663310000000866726565';
  const dummyBuffer = Buffer.from(dummyMp4Hex, 'hex');

  const formData = new FormData();
  formData.append('file', 'data:video/mp4;base64,' + dummyBuffer.toString('base64'));
  formData.append('fileName', 'test-product-showcase.mp4');
  formData.append('folder', '/khavyn/product-videos');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
    body: formData,
  });

  const data = await res.json();
  console.log('ImageKit upload response status:', res.status);
  console.log('Uploaded video URL:', data.url);

  if (res.ok && data.url) {
    // Check if URL is loadable
    const checkRes = await fetch(data.url);
    console.log('Video URL load status:', checkRes.status);

    // Delete test video
    if (data.fileId) {
      await fetch(`https://api.imagekit.io/v1/files/${data.fileId}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      console.log('Cleaned up test video file.');
    }
  } else {
    console.error('ImageKit upload failed:', data);
  }
}

testVideoUpload().catch(console.error);
