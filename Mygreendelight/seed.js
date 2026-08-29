const mongoose = require('mongoose');

// Use the legacy connection string since the network has DNS issues with SRV
const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";

const GrocerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, enum: ["kg", "g", "l", "ml", "piece"], required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema);

const dummyGroceries = [
  {
    name: "Fresh Red Apples",
    price: 150,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=400",
    category: "Fruits & Vegetables"
  },
  {
    name: "Whole Wheat Atta",
    price: 240,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    category: "Rice, Atta & Grains"
  },
  {
    name: "Farm Fresh Eggs",
    price: 90,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=400",
    category: "Dairy & Eggs"
  },
  {
    name: "Amul Pure Milk",
    price: 66,
    unit: "l",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400",
    category: "Dairy & Eggs"
  },
  {
    name: "Potato (Aloo)",
    price: 40,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400",
    category: "Fruits & Vegetables"
  },
  {
    name: "Onion (Pyaz)",
    price: 35,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&q=80&w=400",
    category: "Fruits & Vegetables"
  },
  {
    name: "Maggi 2-Minute Noodles",
    price: 14,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400",
    category: "Instant & Packaged Food"
  },
  {
    name: "Turmeric Powder (Haldi)",
    price: 60,
    unit: "g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    category: "Spices & Masalas"
  },
  {
    name: "Basmati Rice",
    price: 180,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=400",
    category: "Rice, Atta & Grains"
  },
  {
    name: "Coca-Cola",
    price: 40,
    unit: "ml",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=400",
    category: "Beverages & Drinks"
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected! Checking if data exists...");
    
    const count = await Grocery.countDocuments();
      console.log("Inserting dummy products...");
      await Grocery.insertMany(dummyGroceries);
      console.log("Successfully inserted 10 dummy products!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
