const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const content = fs.readFileSync(envPath, 'utf8');
let apiKey = '';
content.split('\n').forEach((l) => {
  if (l.trim().startsWith('RESEND_API_KEY=')) {
    apiKey = l.trim().slice('RESEND_API_KEY='.length).trim();
    if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.slice(1, -1);
  }
});

async function testArbitrary() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'KHAVYN <onboarding@resend.dev>',
      to: 'random_customer_12345@gmail.com',
      subject: 'KHAVYN Test',
      html: '<p>Test</p>',
    }),
  });
  const data = await res.json();
  console.log('Status:', res.status, 'Response:', data);
}
testArbitrary().catch(console.error);
