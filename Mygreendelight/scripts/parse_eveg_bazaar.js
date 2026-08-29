const fs = require('fs');

const stepFiles = [
  { path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4406\\content.md', cat: 'Vegetables' },
  { path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4408\\content.md', cat: 'Fruits' },
  { path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4410\\content.md', cat: 'Vegetables' },
  { path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4412\\content.md', cat: 'Vegetables' },
  { path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4414\\content.md', cat: 'Dairy & Staples' }
];

const evegProducts = [];

stepFiles.forEach(({ path: fpath, cat }) => {
  if (!fs.existsSync(fpath)) return;
  const text = fs.readFileSync(fpath, 'utf-8');

  // Let's search for product cards or links
  // Look for product image url, alt/title, and price (₹)
  // Usually <a href="/products/..." or <img alt="..." or aria-label
  const productBlockRegex = /<a[^>]*href="(\/products\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  while ((match = productBlockRegex.exec(text)) !== null) {
    const link = match[1];
    const block = match[2];

    // Extract title
    const titleMatch = block.match(/alt="([^"]+)"/) || block.match(/<h[0-9][^>]*>([^<]+)<\/h[0-9]>/) || block.match(/title="([^"]+)"/);
    // Extract image
    const imgMatch = block.match(/src="([^"]+)"/) || block.match(/srcset="([^" ]+)/);
    // Extract price
    const priceMatch = block.match(/₹\s*([0-9.]+)/) || block.match(/Rs\.?\s*([0-9.]+)/i);

    if (titleMatch) {
      let name = titleMatch[1].replace(/&amp;/g, '&').trim();
      let image = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';
      let price = priceMatch ? parseFloat(priceMatch[1]) : 0;

      if (name && !name.includes("Logo") && !name.includes("Banner")) {
        evegProducts.push({
          link,
          name,
          image,
          price,
          category: cat
        });
      }
    }
  }
});

console.log(`Found ${evegProducts.length} raw product blocks in EVegetableBazaar`);
console.log("Sample 5 items:", evegProducts.slice(0, 5));
fs.writeFileSync('scripts/eveg_parsed_raw.json', JSON.stringify(evegProducts, null, 2));
