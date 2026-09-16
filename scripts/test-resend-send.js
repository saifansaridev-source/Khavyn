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

async function testResend() {
  console.log('Testing Resend sending capability...');
  // Resend free/unverified tier allows sending from onboarding@resend.dev to the account owner email,
  // or testing api error response. Let's send a test to delivered@resend.dev (Resend's official test sink)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'KHAVYN <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: 'KHAVYN System Audit Test',
      html: '<p>This is an automated system health check from KHAVYN audit.</p>',
    }),
  });

  const data = await res.json();
  console.log('Status code:', res.status);
  console.log('Response:', data);
}

testResend().catch(console.error);
