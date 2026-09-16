const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        let preview = '';
        if (key.includes('SECRET') || key.includes('KEY') || key.includes('URI') || key.includes('PASS')) {
          preview = val.slice(0, 8) + '...' + (val.length > 8 ? val.slice(-4) : '');
        } else {
          preview = val.slice(0, 20);
        }
        console.log(`${key}: length=${val.length}, preview=${preview}`);
      }
    }
  });
} else {
  console.log('.env.local does not exist!');
}
