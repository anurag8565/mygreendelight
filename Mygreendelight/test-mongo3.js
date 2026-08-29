const mongoose = require('mongoose');

const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB via legacy URL...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Successfully connected to MongoDB with legacy URL!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to connect to MongoDB:");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
