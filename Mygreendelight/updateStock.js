const mongoose = require('mongoose');

async function updateStock() {
  await mongoose.connect('mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority');
  const db = mongoose.connection.useDb('myDatabase');
  const groceries = db.collection('groceries');
  
  // Update base stock
  const res1 = await groceries.updateMany({}, { $set: { stock: 50 } });
  
  // Update variations stock if they exist
  const allGroceries = await groceries.find({}).toArray();
  for (let g of allGroceries) {
    if (g.variations && g.variations.length > 0) {
      const updatedVars = g.variations.map(v => ({...v, stock: 50}));
      await groceries.updateOne({ _id: g._id }, { $set: { variations: updatedVars } });
    }
  }
  
  console.log('Stocks updated. Base modified:', res1.modifiedCount);
  process.exit(0);
}

updateStock();
