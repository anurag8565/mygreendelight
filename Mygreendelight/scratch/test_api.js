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

  // Register models
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model("User", UserSchema, "users");

  const DeliveryAssignmentSchema = new mongoose.Schema({}, { strict: false });
  const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment", DeliveryAssignmentSchema, "deliveryassignments");

  const GrocerySchema = new mongoose.Schema({}, { strict: false });
  const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema, "groceries");

  const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assigneddelliveryboy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assigment: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAssignment" },
    items: [{ grocery: { type: mongoose.Schema.Types.ObjectId, ref: "Grocery" } }]
  }, { strict: false });
  const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders");

  try {
    const orders = await Order.find({})
      .populate("user", "name email mobile")
      .populate("assigneddelliveryboy", "name mobile email")
      .populate("assigment")
      .sort({ createdAt: -1 })
      .lean();

    console.log("SUCCESS! Found populated orders:", orders.length);
    console.log("First populated order ID:", orders[0]._id.toString());
    console.log("First populated order user:", orders[0].user);
  } catch (err) {
    console.error("POPULATE ERROR:", err);
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
