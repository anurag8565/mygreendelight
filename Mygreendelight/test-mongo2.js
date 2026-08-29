const mongoose = require('mongoose');

const uri = "mongodb+srv://anuragsinghas183_db_user:D481SSD8geGpGYQC@cluster0.stkdtxo.mongodb.net";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 5000 });
    console.log("Successfully connected to MongoDB with family: 4!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to connect to MongoDB:");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
