const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4216\\content.md',
    category: 'Vegetables'
  },
  {
    path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4218\\content.md',
    category: 'Fruits'
  },
  {
    path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4220\\content.md',
    category: 'Exotics'
  },
  {
    path: 'C:\\Users\\win11\\.gemini\\antigravity\\brain\\55e84d64-2221-41f3-814d-9bc6e4250f7a\\.system_generated\\steps\\4222\\content.md',
    category: 'Dairy & Staples'
  }
];

// Curated high quality image map for Indian produce
const imageMap = {
  "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  "tomato": "https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=600&q=80",
  "onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
  "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  "palak": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  "methi": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  "coriander": "https://images.unsplash.com/photo-1588879462716-59a60714b18c?auto=format&fit=crop&w=600&q=80",
  "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  "garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80",
  "ginger": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  "ghee": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
  "paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
  "milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
  "lemon": "https://images.unsplash.com/photo-1533082603893-a1c834889ec9?auto=format&fit=crop&w=600&q=80",
  "chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
  "capsicum": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
  "cucumber": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80",
  "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80",
  "cabbage": "https://images.unsplash.com/photo-1611105637996-0352c38d41e7?auto=format&fit=crop&w=600&q=80",
  "carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80",
  "beetroot": "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=600&q=80",
  "radish": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80",
  "ladyfinger": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80",
  "bhindi": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80",
  "brinjal": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80",
  "bottle gourd": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80",
  "lauki": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80",
  "bitter gourd": "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80",
  "karela": "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80",
  "pumpkin": "https://images.unsplash.com/photo-1506917728037-b6fb01c450a6?auto=format&fit=crop&w=600&q=80",
  "orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80",
  "mango": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
  "papaya": "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80",
  "pomegranate": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  "guava": "https://images.unsplash.com/photo-1536511135898-75612142276c?auto=format&fit=crop&w=600&q=80",
  "watermelon": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  "muskmelon": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  "grapes": "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80",
  "mushroom": "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80",
  "avocado": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80",
  "broccoli": "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",
  "lettuce": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80",
  "atta": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  "flour": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
};

function getProduceImage(name, cat) {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(imageMap)) {
    if (lower.includes(key)) return url;
  }
  if (cat === "Fruits") return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80";
  if (cat === "Exotics") return "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80";
  if (cat === "Dairy & Staples") return "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80";
  return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";
}

const allExtractedProducts = [];
const seenNames = new Set();

files.forEach(({ path: filePath, category }) => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');

  // Match each product block
  // Product cards usually contain <div class="product-description"><a class="product-title ...">NAME</a> ... <input type="hidden" name="price" value="PRICE" />
  const cardRegex = /<div class="product-description"><a[^>]*product-title[^>]*>([\s\S]*?)<\/a>[\s\S]*?<input type="hidden" name="price" value="([^"]+)"/g;

  let match;
  while ((match = cardRegex.exec(content)) !== null) {
    let rawName = match[1].replace(/<[^>]+>/g, '').trim();
    // clean up whitespace and extra brackets
    rawName = rawName.replace(/\s+/g, ' ').trim();
    const priceStr = match[2].trim();
    const price1Kg = parseFloat(priceStr) || 0;

    if (!rawName || price1Kg <= 0) continue;

    // Remove duplicates
    const normalizedKey = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenNames.has(normalizedKey)) continue;
    seenNames.add(normalizedKey);

    const imageUrl = getProduceImage(rawName, category);

    // Standard pack variations
    const variations = [
      { weight: "250g", price: Math.round(price1Kg * 0.28), stock: 40 },
      { weight: "500g", price: Math.round(price1Kg * 0.52), stock: 50 },
      { weight: "1 kg", price: Math.round(price1Kg), stock: 60 },
      { weight: "2 kg", price: Math.round(price1Kg * 1.95), stock: 30 }
    ];

    allExtractedProducts.push({
      name: rawName,
      category: category,
      price: Math.round(price1Kg),
      unit: "1 kg",
      stock: 80,
      image: imageUrl,
      description: `100% farm-fresh ${rawName} sourced daily from trusted local Bhopal & MP farmers. Graded for premium quality, crisp texture, and natural freshness.`,
      sourcing: "Direct from Bhopal Direct Kisan Farm & local organic growers (Raisen / Sehore / Hoshangabad)",
      storage: "Keep in a cool, well-ventilated space or refrigerate. Wash thoroughly with clean water before use.",
      variations: variations
    });
  }
});

console.log(`Extracted total ${allExtractedProducts.length} unique products from kisan_network.in`);

// Write CSV
const csvHeaders = ["name", "category", "price", "unit", "stock", "image", "description", "sourcing", "storage", "variations"];
const csvRows = allExtractedProducts.map(p => {
  return [
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.category}"`,
    p.price,
    `"${p.unit}"`,
    p.stock,
    `"${p.image}"`,
    `"${p.description.replace(/"/g, '""')}"`,
    `"${p.sourcing.replace(/"/g, '""')}"`,
    `"${p.storage.replace(/"/g, '""')}"`,
    `"${JSON.stringify(p.variations).replace(/"/g, '""')}"`
  ].join(',');
});

const csvFull = [csvHeaders.join(','), ...csvRows].join('\n');

const outCsvPath = path.join(__dirname, '..', 'public', 'kisan_network_products.csv');
const outJsonPath = path.join(__dirname, '..', 'public', 'kisan_network_products.json');

fs.writeFileSync(outCsvPath, csvFull, 'utf-8');
fs.writeFileSync(outJsonPath, JSON.stringify(allExtractedProducts, null, 2), 'utf-8');

console.log(`Saved CSV to: ${outCsvPath}`);
console.log(`Saved JSON to: ${outJsonPath}`);
