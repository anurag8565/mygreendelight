const mongoose = require('mongoose');
const fs = require('fs');

async function exportMaster() {
  const uri = 'mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority';
  await mongoose.connect(uri);
  const items = await mongoose.connection.db.collection('groceries').find({}).sort({ category: 1, name: 1 }).toArray();

  const csvHeaders = ['name', 'category', 'price', 'unit', 'stock', 'image', 'description', 'sourcing', 'storage', 'variations'];
  const csvRows = items.map(p => {
    return [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      `"${p.unit || 'kg'}"`,
      p.stock || 50,
      `"${p.image}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${(p.sourcing || '').replace(/"/g, '""')}"`,
      `"${(p.storage || '').replace(/"/g, '""')}"`,
      `"${JSON.stringify(p.variations || []).replace(/"/g, '""')}"`
    ].join(',');
  });

  fs.writeFileSync('public/combined_bhopal_products.csv', [csvHeaders.join(','), ...csvRows].join('\n'), 'utf-8');
  fs.writeFileSync('public/combined_bhopal_products.json', JSON.stringify(items, null, 2), 'utf-8');
  console.log('Exported master CSV & JSON cleanly! Total items:', items.length);
  process.exit(0);
}

exportMaster().catch(console.error);
