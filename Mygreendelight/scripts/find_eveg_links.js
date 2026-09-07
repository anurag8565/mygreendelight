const fs = require('fs');

const filePath = 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4394\\content.md';
const content = fs.readFileSync(filePath, 'utf-8');

const hrefs = new Set();
const regex = /href="([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  hrefs.add(match[1]);
}

console.log("All Unique Links found on subziquick_clean.in:");
console.log(Array.from(hrefs).filter(h => !h.startsWith('#') && !h.endsWith('.css') && !h.endsWith('.js') && !h.endsWith('.png')));
