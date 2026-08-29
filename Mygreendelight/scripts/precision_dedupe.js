const fs = require('fs');
const mongoose = require('mongoose');

async function precisionClean() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  await mongoose.connect(uri);
  const groceryCol = mongoose.connection.db.collection('groceries');

  const allItems = await groceryCol.find({}).toArray();
  console.log(`Initial total items in database: ${allItems.length}`);

  // Standardize helper
  function getRootName(name) {
    let s = (name || '').toLowerCase();
    s = s.replace(/\([^)]*\)/g, ' '); // remove (hindi) or brackets
    s = s.replace(/[\/\-\–_,]/g, ' ');
    s = s.replace(/\b(online|bhopal|buy|fresh|desi|deshi|hybrid|loose|new|sku|[0-9]+(kg|g|gm|pc|pcs)?)\b/g, '');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  // Deduplicate by root name
  const seen = new Map();
  const toDeleteIds = [];

  for (const item of allItems) {
    const root = getRootName(item.name);
    if (!root) continue;

    if (seen.has(root)) {
      const existing = seen.get(root);
      // If the current item has a clevup CDN image and existing doesn't, upgrade existing's image
      if (item.image && item.image.includes('cdn2.clevup.in') && (!existing.image || !existing.image.includes('cdn2.clevup.in'))) {
        await groceryCol.updateOne({ _id: existing._id }, { $set: { image: item.image } });
      }
      toDeleteIds.push(item._id);
    } else {
      seen.set(root, item);
    }
  }

  if (toDeleteIds.length > 0) {
    await groceryCol.deleteMany({ _id: { $in: toDeleteIds } });
    console.log(`Deleted ${toDeleteIds.length} duplicate items.`);
  }

  // Now fix categories and variations for all remaining items
  const remaining = await groceryCol.find({}).toArray();
  for (const item of remaining) {
    const lower = (item.name + ' ' + (item.description || '')).toLowerCase();
    let cat = "Vegetables";

    if (/apple|banana|orange|papaya|guava|kiwi|pomegranate|pear|plum|dates|blueberry|grape|mango|fruit|mosambi|lime|kela|seb|amrood|anaar|santra|papita|nashpati|aalubukhara/i.test(lower) && !/custard apple gourd|apple gourd|raw banana|kaccha kela/i.test(lower)) {
      cat = "Fruits";
    } else if (/broccoli|mushroom|zucchini|sprout|sweet corn|baby corn|red capsicum|yellow capsicum/i.test(lower)) {
      cat = "Exotics";
    } else if (/ghee|paneer|butter|milk|dairy|staple|atta|curd|dahi|khoya|mawa/i.test(lower)) {
      cat = "Dairy & Staples";
    } else {
      cat = "Vegetables";
    }

    // Ensure price is realistic Bhopal rate
    let basePrice = item.price > 0 ? item.price : 40;
    if (basePrice > 500 && !/ghee/i.test(lower)) {
      basePrice = Math.round(basePrice / 10);
    }

    const variations = [
      { weight: "250g", price: Math.max(10, Math.round(basePrice * 0.28)), stock: 40 },
      { weight: "500g", price: Math.max(18, Math.round(basePrice * 0.52)), stock: 50 },
      { weight: "1 kg", price: Math.round(basePrice), stock: 60 },
      { weight: "2 kg", price: Math.round(basePrice * 1.95), stock: 30 }
    ];

    await groceryCol.updateOne(
      { _id: item._id },
      {
        $set: {
          category: cat,
          price: basePrice,
          variations: variations,
          unit: item.unit || "kg"
        }
      }
    );
  }

  const finalItems = await groceryCol.find({}).sort({ category: 1, name: 1 }).toArray();
  console.log(`\n======================================================`);
  console.log(`FINAL CLEAN PRODUCT COUNT: ${finalItems.length}`);
  const catSummary = {};
  finalItems.forEach(i => {
    catSummary[i.category] = (catSummary[i.category] || 0) + 1;
  });
  console.log("Category breakdown:", catSummary);
  console.log(`======================================================`);

  // Write updated master CSV & JSON
  const csvHeaders = ["name", "category", "price", "unit", "stock", "image", "description", "sourcing", "storage", "variations"];
  const csvRows = finalItems.map(p => {
    return [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      `"${p.unit || 'kg'}"`,
      p.stock || 50,
      `"${p.image}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${(p.sourcing || '').replace(/"/g, '""')}"`,
      `"${(p.storage || '').replace(/"/g, '""')}"`,
      `"${JSON.stringify(p.variations || []).replace(/"/g, '""')}"`
    ].join(',');
  });

  fs.writeFileSync('public/combined_bhopal_products.csv', [csvHeaders.join(','), ...csvRows].join('\n'), 'utf-8');
  fs.writeFileSync('public/combined_bhopal_products.json', JSON.stringify(finalItems, null, 2), 'utf-8');
  console.log("Exported clean CSV and JSON to public directory!");

  process.exit(0);
}

precisionClean().catch(console.error);
