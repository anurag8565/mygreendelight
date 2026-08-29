const fs = require('fs');

const filePath = 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4394\\content.md';
const content = fs.readFileSync(filePath, 'utf-8');

console.log("Content size (KB):", (content.length / 1024).toFixed(1));

// Look for product json data or next.js __NEXT_DATA__ or product elements
const nextDataMatch = content.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

if (nextDataMatch) {
  console.log("Found __NEXT_DATA__!");
  try {
    const json = JSON.parse(nextDataMatch[1]);
    console.log("Page props keys:", Object.keys(json.props?.pageProps || {}));
    fs.writeFileSync('scripts/eveg_next_data.json', JSON.stringify(json, null, 2));
  } catch (e) {
    console.error("JSON parse error:", e);
  }
} else {
  console.log("No __NEXT_DATA__ script tag, searching for JSON strings or product patterns...");
  // Let's search for cdn2.clevup.in images and product titles
  const regex = /"name":"([^"]+)","price":([0-9.]+)/g;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    console.log(`Found: ${match[1]} - ₹${match[2]}`);
    count++;
  }
  console.log("Total found with simple regex:", count);
}
