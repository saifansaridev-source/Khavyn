const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
content.split('\n').forEach((l) => {
  const line = l.trim();
  if (line && !line.startsWith('#')) {
    const eq = line.indexOf('=');
    if (eq !== -1) {
      const k = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      console.log(k, 'First char:', val[0], 'Last char:', val[val.length - 1], 'Length:', val.length);
    }
  }
});
