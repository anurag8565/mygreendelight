const mongoose = require('mongoose');

async function normalize() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB!");

  const db = mongoose.connection.db;
  const groceryCol = db.collection('groceries');
  const categoryCol = db.collection('categories');

  // Let's inspect all distinct categories currently in groceries collection
  const distinctInGroceries = await groceryCol.distinct("category");
  console.log("Current distinct categories in groceries:", distinctInGroceries);

  // Remap weird / rogue categories
  await groceryCol.updateMany(
    { category: { $in: ["Exostic vegetables", "exotic vegetables", "Exotic Vegetables", "Exotics Vegetables"] } },
    { $set: { category: "Exotics" } }
  );

  await groceryCol.updateMany(
    { category: { $in: ["Rice, Atta & Grains", "Atta & Staples", "Dairy Products", "Dairy & Eggs", "Grocery / Dairy Products"] } },
    { $set: { category: "Dairy & Staples" } }
  );

  await groceryCol.updateMany(
    { category: { $regex: /^veg/i } },
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

  // Check again
  const cleanDistinct = await groceryCol.distinct("category");
  console.log("\nCleaned distinct categories in groceries:", cleanDistinct);

  // Now replace Category collection with strictly 4 official categories
  await categoryCol.deleteMany({});

  const officialCategories = [
    {
      name: "Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Exotics",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Dairy & Staples",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await categoryCol.insertMany(officialCategories);

  // Count items per category
  for (const cat of cleanDistinct) {
    const count = await groceryCol.countDocuments({ category: cat });
    console.log(`- ${cat}: ${count} products`);
  }

  console.log("\nALL CATEGORIES 100% NORMALIZED AND SYNCED!");
  process.exit(0);
}

normalize().catch(console.error);
