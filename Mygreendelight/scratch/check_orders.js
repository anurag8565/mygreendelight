const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env.local");
let uri = "";
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    if (line.startsWith("MONGODB_URI=")) {
      uri = line.replace("MONGODB_URI=", "").trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function run() {
  if (!uri) {
    console.log("No MONGODB_URI found in .env.local");
    return;
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB!");
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  const orders = await mongoose.connection.db.collection("orders").find({}).sort({ _id: -1 }).toArray();
  console.log("Total Orders Found in 'orders' collection:", orders.length);
  if (orders.length > 0) {
    console.log("Latest Order Status:", orders[0].status);
    console.log("Latest Order ID:", orders[0]._id);
    console.log("Latest Order Address:", orders[0].address);
    console.log("Latest Order Items count:", orders[0].items?.length);
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
