const mongoose = require('mongoose');

async function fixTrailing() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  await mongoose.connect(uri);

  const groceryCol = mongoose.connection.db.collection('groceries');

  // Fix any item with trailing spaces or exotic spellings
  const allItems = await groceryCol.find({}).toArray();
  for (const item of allItems) {
    let cat = (item.category || "").trim();
    if (/exotic/i.test(cat) || /exostic/i.test(cat)) {
      cat = "Exotics";
    } else if (/fruit/i.test(cat)) {
      cat = "Fruits";
    } else if (/veg/i.test(cat)) {
      cat = "Vegetables";
    } else if (/dairy|staple|rice|atta/i.test(cat)) {
      cat = "Dairy & Staples";
    } else {
      cat = "Vegetables";
    }
    await groceryCol.updateOne({ _id: item._id }, { $set: { category: cat } });
  }

  const distinct = await groceryCol.distinct("category");
  console.log("FINAL CLEAN DISTINCT CATEGORIES:", distinct);
  for (const c of distinct) {
    const cnt = await groceryCol.countDocuments({ category: c });
    console.log(`- ${c}: ${cnt} items`);
  }
  process.exit(0);
}

fixTrailing().catch(console.error);
