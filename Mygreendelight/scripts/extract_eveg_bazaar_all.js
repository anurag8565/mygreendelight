const fs = require('fs');
const https = require('https');

const sitemapPath = 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4430\\content.md';
const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');

const urlRegex = /<loc>(https:\/\/www\.evegetablebazaar\.in\/products\/[^<]+)<\/loc>/g;
const allUrls = [];
let match;
while ((match = urlRegex.exec(sitemapXml)) !== null) {
  allUrls.push(match[1]);
}

console.log(`Extracted total ${allUrls.length} product URLs from sitemap.`);

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

// Group URLs by base produce name
function getBaseSlug(url) {
  let slug = url.split('/products/')[1] || '';
  slug = slug.replace(/-SKU-[0-9]+/i, '')
             .replace(/-[0-9]+(kg|g|gm|pc|pcs|box|online|bhopal|)-.*/i, '')
             .replace(/-[0-9]+(kg|g|gm|pc|pcs)/i, '')
             .replace(/-online-bhopal/i, '')
             .replace(/-bhopal/i, '');
  return slug;
}

const urlMap = new Map();
for (const u of allUrls) {
  const base = getBaseSlug(u);
  if (!urlMap.has(base)) {
    urlMap.set(base, []);
  }
  urlMap.get(base).push(u);
}

console.log(`Identified ${urlMap.size} unique base produce items.`);

async function scrapeAll() {
  const items = Array.from(urlMap.entries());
  const extractedProducts = [];

  for (let i = 0; i < items.length; i++) {
    const [baseSlug, urls] = items[i];
    const targetUrl = urls[0];
    const html = await fetchUrl(targetUrl);

    if (!html) continue;

    // Extract title from <title> or meta
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1].split(' - ')[0].split(' | ')[0].trim() : baseSlug;

    // Extract image
    const imgMatch = html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/content="([^"]+cdn2\.clevup\.in[^"]+)"/);
    let image = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

    // Extract description
    const descMatch = html.match(/property="og:description"\s+content="([^"]+)"/) || html.match(/name="description"\s+content="([^"]+)"/);
    let description = descMatch ? descMatch[1].replace(/&amp;/g, '&').trim() : '';

    // Extract price from structured data or html
    const priceMatch = html.match(/₹\s*([0-9.]+)/) || html.match(/Rs\.?\s*([0-9.]+)/i) || html.match(/"price":\s*"?([0-9.]+)"?/);
    let price = priceMatch ? parseFloat(priceMatch[1]) : 40;

    // Clean up title (remove SKU codes or weights from title)
    title = title.replace(/\s*[0-9]+(\s*kg|\s*g|\s*gm|\s*pc|\s*pcs)\b/gi, '').replace(/- SKU-[0-9]+/i, '').trim();

    // Determine category
    let category = "Vegetables";
    const lower = title.toLowerCase();
    if (/apple|banana|orange|papaya|guava|kiwi|pomegranate|pear|plum|dates|berry|grape|mango|fruit/i.test(lower)) {
      category = "Fruits";
    } else if (/broccoli|mushroom|zucchini|sprout|corn|capsicum/i.test(lower)) {
      category = "Exotics";
    } else if (/ghee|paneer|butter|milk|dairy|staple|atta|oil/i.test(lower)) {
      category = "Dairy & Staples";
    }

    if (title && image) {
      extractedProducts.push({
        name: title,
        baseSlug,
        price: Math.round(price) || 40,
        category,
        image,
        description: description || `Freshly harvested ${title} sourced directly from local Bhopal farms.`,
        sourcing: "Direct from Bhopal Direct Kisan Farm & local organic growers (Raisen / Sehore / Hoshangabad)",
        storage: "Keep refrigerated or in a cool ventilated place. Wash before use.",
        variations: [
          { weight: "250g", price: Math.max(10, Math.round(price * 0.28)), stock: 40 },
          { weight: "500g", price: Math.max(18, Math.round(price * 0.52)), stock: 50 },
          { weight: "1 kg", price: Math.round(price) || 40, stock: 60 },
          { weight: "2 kg", price: Math.round(price * 1.95) || 75, stock: 30 }
        ]
      });
      console.log(`[${i+1}/${items.length}] Scraped: ${title} (${category}) -> ₹${price}`);
    }
  }

  console.log(`\nSuccessfully extracted ${extractedProducts.length} unique produce items from EVegetableBazaar!`);
  fs.writeFileSync('public/eveg_bazaar_products.json', JSON.stringify(extractedProducts, null, 2));
}

scrapeAll().catch(console.error);
