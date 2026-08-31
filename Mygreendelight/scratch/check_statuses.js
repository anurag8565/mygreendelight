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
  await mongoose.connect(uri);
  const orders = await mongoose.connection.db.collection("orders").find({}).toArray();
  const statusCounts = {};
  orders.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  console.log("Status breakdown of all orders:", statusCounts);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
