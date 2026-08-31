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

  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment", new mongoose.Schema({}, { strict: false }));
  const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({}, { strict: false }));

  const orders = await Order.find({})
    .populate({ path: "user", model: User, select: "name email mobile", strictPopulate: false })
    .populate({ path: "assigneddelliveryboy", model: User, select: "name mobile email", strictPopulate: false })
    .populate({ path: "assigment", model: DeliveryAssignment, strictPopulate: false })
    .sort({ createdAt: -1 })
    .lean();

  console.log("Direct Model Populate SUCCESS! Orders found:", orders.length);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
