const mongoose = require('mongoose');

async function clean() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected!");

  const db = mongoose.connection.db;
  const groceryCol = db.collection('groceries');
  const categoryCol = db.collection('categories');

  // 1. Delete dummy items like 'other', 'tomot0'
  const deletedDummyItems = await groceryCol.deleteMany({
    $or: [
      { name: { $in: ["other", "tomot0", "test", "demo"] } },
      { category: { $in: ["Snacks & Biscuits", "Beverages & Drinks", "Instant & Packaged Food", "Spices & Masalas", "Dairy & Eggs", "Fruits & Vegetables", "exotic vegetables"] } }
    ]
  });
  console.log(`Deleted ${deletedDummyItems.deletedCount} old dummy grocery items.`);

  // 2. Clean up Category collection
  await categoryCol.deleteMany({
    name: {
      $nin: ["Vegetables", "Fruits", "Exotics", "Dairy & Staples"]
    }
  });

  // Ensure standard 4 clean produce categories exist
  const standardCategories = [
    {
      name: "Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Exotics",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dairy & Staples",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    },
  ];

  for (const cat of standardCategories) {
    const exists = await categoryCol.findOne({ name: cat.name });
    if (!exists) {
      await categoryCol.insertOne({ ...cat, createdAt: new Date(), updatedAt: new Date() });
    }
  }

  // Normalize remaining products categories
  await groceryCol.updateMany(
    { category: { $regex: /^vegetable/i } },
    { $set: { category: "Vegetables" } }
  );
  await groceryCol.updateMany(
    { category: { $regex: /^fruit/i } },
    { $set: { category: "Fruits" } }
  );
  await groceryCol.updateMany(
    { category: { $regex: /^exotic/i } },
    { $set: { category: "Exotics" } }
  );
  await groceryCol.updateMany(
    { category: { $regex: /^(dairy|staple)/i } },
    { $set: { category: "Dairy & Staples" } }
  );

  const finalCount = await groceryCol.countDocuments();
  console.log(`\nCleanup Complete! Total Genuine Fresh Produce Items in Live Catalog: ${finalCount}`);
  process.exit(0);
}

clean().catch(console.error);
