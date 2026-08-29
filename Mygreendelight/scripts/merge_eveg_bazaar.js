const fs = require('fs');
const mongoose = require('mongoose');

async function mergeCatalog() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB!");

  const db = mongoose.connection.db;
  const groceryCol = db.collection('groceries');

  const evegRaw = fs.readFileSync('public/eveg_bazaar_products.json', 'utf-8');
  const evegProducts = JSON.parse(evegRaw);

  const existingDbItems = await groceryCol.find({}).toArray();
  console.log(`Found ${existingDbItems.length} existing items in DB.`);

  function simplify(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[\(\)\/\-–_,\.]/g, ' ')
      .replace(/\b(online|bhopal|buy|fresh|desi|deshi|hybrid|loose|new|sku|[0-9]+)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  let updatedPhotosCount = 0;
  let newAddedCount = 0;

  for (const eveg of evegProducts) {
    const evegSimple = simplify(eveg.name);
    if (!evegSimple) continue;

    // Find match in existing DB
    let matchedDoc = null;
    for (const doc of existingDbItems) {
      const docSimple = simplify(doc.name);
      if (
        docSimple === evegSimple ||
        (docSimple.length > 3 && evegSimple.includes(docSimple)) ||
        (evegSimple.length > 3 && docSimple.includes(evegSimple))
      ) {
        matchedDoc = doc;
        break;
      }
    }

    // Determine clean Category
    let category = eveg.category || "Vegetables";
    const lower = (eveg.name + " " + (eveg.description || "")).toLowerCase();
    if (/apple|banana|orange|papaya|guava|kiwi|pomegranate|pear|plum|dates|berry|grape|mango|fruit|mosambi|lime/i.test(lower)) {
      category = "Fruits";
    } else if (/broccoli|mushroom|zucchini|sprout|corn|capsicum/i.test(lower)) {
      category = "Exotics";
    } else if (/ghee|paneer|butter|milk|dairy|staple|atta|curd|dahi|khoya|mawa/i.test(lower)) {
      category = "Dairy & Staples";
    } else {
      category = "Vegetables";
    }

    if (matchedDoc) {
      // Update image if EVegetableBazaar image is high-res cdn2.clevup.in
      const updates = {};
      if (eveg.image && eveg.image.includes('cdn2.clevup.in')) {
        updates.image = eveg.image;
        updatedPhotosCount++;
      }
      if (eveg.description && eveg.description.length > (matchedDoc.description || '').length) {
        updates.description = eveg.description;
      }
      if (Object.keys(updates).length > 0) {
        await groceryCol.updateOne({ _id: matchedDoc._id }, { $set: updates });
        console.log(`Updated photo/info for existing: ${matchedDoc.name}`);
      }
    } else {
      // Add as NEW unique product
      const basePrice = eveg.price > 0 ? eveg.price : 40;
      const variations = [
        { weight: "250g", price: Math.max(10, Math.round(basePrice * 0.28)), stock: 40 },
        { weight: "500g", price: Math.max(18, Math.round(basePrice * 0.52)), stock: 50 },
        { weight: "1 kg", price: Math.round(basePrice), stock: 60 },
        { weight: "2 kg", price: Math.round(basePrice * 1.95), stock: 30 }
      ];

      const newDoc = {
        name: eveg.name.trim(),
        price: basePrice,
        stock: 60,
        unit: "1 kg",
        category: category,
        image: eveg.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        description: eveg.description || `100% fresh ${eveg.name} delivered directly in Bhopal.`,
        sourcing: "Direct from Bhopal Krishi Mandi & local organic growers (Raisen / Sehore / Hoshangabad)",
        storage: "Keep in a cool, well-ventilated space or refrigerate. Wash thoroughly before use.",
        variations: variations,
        reviews: [],
        rating: 4.8,
        numReviews: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await groceryCol.insertOne(newDoc);
      newAddedCount++;
      console.log(`+ Added NEW product: ${eveg.name} (${category}) -> ₹${basePrice}`);
    }
  }

  // Final count
  const allFinal = await groceryCol.find({}).sort({ category: 1, name: 1 }).toArray();
  console.log(`\n======================================================`);
  console.log(`MERGE SUMMARY:`);
  console.log(`- Photos / Descriptions Enhanced on Existing: ${updatedPhotosCount}`);
  console.log(`- New Unique Produce Added: ${newAddedCount}`);
  console.log(`- Total Live Produce Catalog in Store: ${allFinal.length}`);
  console.log(`======================================================`);

  // Export Combined CSV & JSON
  const csvHeaders = ["name", "category", "price", "unit", "stock", "image", "description", "sourcing", "storage", "variations"];
  const csvRows = allFinal.map(p => {
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

  const fullCsv = [csvHeaders.join(','), ...csvRows].join('\n');
  fs.writeFileSync('public/combined_bhopal_products.csv', fullCsv, 'utf-8');
  fs.writeFileSync('public/combined_bhopal_products.json', JSON.stringify(allFinal, null, 2), 'utf-8');
  console.log(`Saved combined CSV to: public/combined_bhopal_products.csv`);
  console.log(`Saved combined JSON to: public/combined_bhopal_products.json`);

  process.exit(0);
}

mergeCatalog().catch(console.error);
