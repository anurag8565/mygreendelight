const fs = require('fs');
const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB!");

  const rawJson = fs.readFileSync('public/gramhat_products.json', 'utf-8');
  const products = JSON.parse(rawJson);
  console.log("Total items to test:", products.length);

  const GrocerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true, default: "kg" },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, default: "" },
    sourcing: { type: String, default: "" },
    storage: { type: String, default: "" },
    variations: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
  }, { timestamps: true });

  const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema);

  let successCount = 0;
  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    try {
      let variations = item.variations;
      if (typeof variations === 'string') {
        try { variations = JSON.parse(variations); } catch(e) { variations = []; }
      }
      if (!Array.isArray(variations)) variations = [];

      const doc = await Grocery.create({
        name: item.name.trim(),
        price: Number(item.price) || 0,
        stock: Number(item.stock) || 50,
        unit: item.unit?.trim() || "kg",
        category: item.category?.trim() || "Vegetables",
        image: item.image?.trim() || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        description: item.description?.trim() || "Farm fresh produce.",
        sourcing: item.sourcing?.trim() || "Local Bhopal Mandi",
        storage: item.storage?.trim() || "Keep refrigerated.",
        variations: variations,
      });
      successCount++;
      console.log(`[${i+1}/${products.length}] OK: ${doc.name}`);
    } catch (err) {
      console.error(`[${i+1}/${products.length}] FAILED: ${item.name} ->`, err.message);
    }
  }

  console.log(`\nDONE! Inserted: ${successCount} / ${products.length}`);
  process.exit(0);
}

run().catch(console.error);
