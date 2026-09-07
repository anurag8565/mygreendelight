const fs = require('fs');
const mongoose = require('mongoose');

async function fixAllPricingAndVariations() {
  const uri = "mongodb://anuragsinghas183_db_user:D481SSD8geGpGYQC@ac-1advsqp-shard-00-00.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-01.stkdtxo.mongodb.net:27017,ac-1advsqp-shard-00-02.stkdtxo.mongodb.net:27017/myDatabase?ssl=true&authSource=admin&retryWrites=true&w=majority";
  await mongoose.connect(uri);
  const groceryCol = mongoose.connection.db.collection('groceries');

  const items = await groceryCol.find({}).toArray();
  console.log(`Starting calibration for ${items.length} items...`);

  for (const item of items) {
    const name = item.name.toLowerCase();
    let category = "Vegetables";
    let basePrice = 40;
    let unit = "1 kg";
    let variations = [];

    // ==========================================
    // 1. DAIRY & STAPLES
    // ==========================================
    if (name.includes('atta') || name.includes('wheat')) {
      category = "Dairy & Staples";
      basePrice = 240;
      unit = "5 kg";
      variations = [
        { weight: "1 kg", price: 50, stock: 50 },
        { weight: "5 kg", price: 240, stock: 40 },
        { weight: "10 kg", price: 470, stock: 25 }
      ];
    } else if (name.includes('rice') || name.includes('chawal')) {
      category = "Dairy & Staples";
      basePrice = 95;
      unit = "1 kg";
      variations = [
        { weight: "1 kg", price: 95, stock: 50 },
        { weight: "5 kg", price: 460, stock: 30 },
        { weight: "10 kg", price: 899, stock: 20 }
      ];
    } else if (name.includes('ghee')) {
      category = "Dairy & Staples";
      const isCow = name.includes('cow') || name.includes('gay') || name.includes('गाय');
      basePrice = isCow ? 849 : 749;
      unit = "1 Litre";
      variations = [
        { weight: "500 ml", price: isCow ? 440 : 390, stock: 30 },
        { weight: "1 Litre", price: basePrice, stock: 40 },
        { weight: "2 Litre", price: isCow ? 1650 : 1450, stock: 20 },
        { weight: "5 Litre", price: isCow ? 4100 : 3600, stock: 10 }
      ];
    } else if (name.includes('paneer')) {
      category = "Dairy & Staples";
      basePrice = 90;
      unit = "250g";
      variations = [
        { weight: "200g", price: 85, stock: 40 },
        { weight: "500g", price: 195, stock: 50 },
        { weight: "1 kg", price: 380, stock: 30 }
      ];
    } else if (name.includes('dahi') || name.includes('curd')) {
      category = "Dairy & Staples";
      basePrice = 40;
      unit = "400g";
      variations = [
        { weight: "200g", price: 22, stock: 35 },
        { weight: "400g", price: 40, stock: 45 },
        { weight: "1 kg", price: 95, stock: 25 }
      ];
    } else if (name.includes('mawa') || name.includes('khoya')) {
      category = "Dairy & Staples";
      basePrice = 170;
      unit = "500g";
      variations = [
        { weight: "250g", price: 90, stock: 30 },
        { weight: "500g", price: 170, stock: 40 },
        { weight: "1 kg", price: 330, stock: 20 }
      ];
    }

    // ==========================================
    // 2. EXOTICS
    // ==========================================
    else if (name.includes('mushroom')) {
      category = "Exotics";
      basePrice = 55;
      unit = "200g Pack";
      variations = [
        { weight: "200g Pack", price: 55, stock: 40 },
        { weight: "400g (2 Packs)", price: 105, stock: 30 },
        { weight: "1 kg", price: 250, stock: 15 }
      ];
    } else if (name.includes('broccoli')) {
      category = "Exotics";
      basePrice = 120;
      unit = "500g";
      variations = [
        { weight: "250g", price: 65, stock: 30 },
        { weight: "500g", price: 120, stock: 40 },
        { weight: "1 kg", price: 230, stock: 25 }
      ];
    } else if (name.includes('baby corn')) {
      category = "Exotics";
      basePrice = 45;
      unit = "200g Pack";
      variations = [
        { weight: "200g Pack", price: 45, stock: 35 },
        { weight: "400g (2 Packs)", price: 85, stock: 25 }
      ];
    } else if (name.includes('sweet corn') || name.includes('frozen sweet corn')) {
      category = "Exotics";
      basePrice = 40;
      unit = "2 Pcs / 400g";
      variations = [
        { weight: "2 Pcs / 250g", price: 40, stock: 40 },
        { weight: "500g Pack", price: 75, stock: 35 },
        { weight: "1 kg", price: 140, stock: 20 }
      ];
    } else if (name.includes('zucchini')) {
      category = "Exotics";
      basePrice = 80;
      unit = "500g";
      variations = [
        { weight: "250g", price: 45, stock: 30 },
        { weight: "500g", price: 80, stock: 40 },
        { weight: "1 kg", price: 150, stock: 25 }
      ];
    } else if (name.includes('sprout') || name.includes('अंकरित')) {
      category = "Exotics";
      basePrice = 30;
      unit = "200g Pack";
      variations = [
        { weight: "200g Pack", price: 30, stock: 35 },
        { weight: "400g Pack", price: 55, stock: 25 }
      ];
    } else if (name.includes('yellow capsicum') || name.includes('red capsicum')) {
      category = "Exotics";
      basePrice = 110;
      unit = "500g";
      variations = [
        { weight: "250g", price: 60, stock: 25 },
        { weight: "500g", price: 110, stock: 35 },
        { weight: "1 kg", price: 210, stock: 20 }
      ];
    }

    // ==========================================
    // 3. FRUITS
    // ==========================================
    else if (name.includes('banana') || name.includes('kela')) {
      category = "Fruits";
      basePrice = 60;
      unit = "1 Dozen (12 Pcs)";
      variations = [
        { weight: "6 Pcs (Half Dozen)", price: 32, stock: 50 },
        { weight: "12 Pcs (1 Dozen)", price: 60, stock: 60 },
        { weight: "24 Pcs (2 Dozen)", price: 115, stock: 30 }
      ];
    } else if (name.includes('tender coconut') || name.includes('nariyal pani')) {
      category = "Fruits";
      basePrice = 75;
      unit = "1 Pc";
      variations = [
        { weight: "1 Piece", price: 75, stock: 40 },
        { weight: "2 Pieces", price: 145, stock: 30 },
        { weight: "4 Pieces", price: 280, stock: 20 }
      ];
    } else if (name.includes('coconut') || name.includes('nariyal')) {
      category = "Fruits";
      basePrice = 38;
      unit = "1 Pc";
      variations = [
        { weight: "1 Piece", price: 38, stock: 50 },
        { weight: "2 Pieces", price: 72, stock: 40 },
        { weight: "5 Pieces", price: 175, stock: 20 }
      ];
    } else if (name.includes('pineapple') || name.includes('अनानास')) {
      category = "Fruits";
      basePrice = 85;
      unit = "1 Pc";
      variations = [
        { weight: "1 Piece (Approx 1kg)", price: 85, stock: 35 },
        { weight: "2 Pieces", price: 160, stock: 20 }
      ];
    } else if (name.includes('dragon fruit')) {
      category = "Fruits";
      basePrice = 110;
      unit = "1 Pc";
      variations = [
        { weight: "1 Piece (Approx 350g)", price: 110, stock: 30 },
        { weight: "2 Pieces", price: 210, stock: 20 },
        { weight: "1 Box (4 Pcs)", price: 400, stock: 15 }
      ];
    } else if (name.includes('kiwi')) {
      category = "Fruits";
      basePrice = 130;
      unit = "1 Pack (3 Pcs)";
      variations = [
        { weight: "1 Pack (3 Pcs)", price: 130, stock: 35 },
        { weight: "1 Box (6 Pcs)", price: 245, stock: 25 }
      ];
    } else if (name.includes('papaya') || name.includes('papita')) {
      category = "Fruits";
      basePrice = 55;
      unit = "1 kg";
      variations = [
        { weight: "1 Medium Pc (Approx 800g)", price: 48, stock: 40 },
        { weight: "1 Large Pc (Approx 1.2 kg)", price: 68, stock: 40 },
        { weight: "2 kg", price: 105, stock: 20 }
      ];
    } else if (name.includes('apple') || name.includes('sev') || name.includes('gala')) {
      category = "Fruits";
      basePrice = 160;
      unit = "1 kg";
      variations = [
        { weight: "500g (2-3 Pcs)", price: 85, stock: 40 },
        { weight: "1 kg (4-5 Pcs)", price: 160, stock: 50 },
        { weight: "2 kg", price: 310, stock: 25 }
      ];
    } else if (name.includes('pomegranate') || name.includes('anaar') || name.includes('anar')) {
      category = "Fruits";
      basePrice = 170;
      unit = "1 kg";
      variations = [
        { weight: "500g (2 Pcs)", price: 90, stock: 35 },
        { weight: "1 kg (4-5 Pcs)", price: 170, stock: 45 },
        { weight: "2 kg", price: 330, stock: 20 }
      ];
    } else if (name.includes('mosambi') || name.includes('sweet lime') || name.includes('orange') || name.includes('santra')) {
      category = "Fruits";
      basePrice = 90;
      unit = "1 kg";
      variations = [
        { weight: "500g", price: 48, stock: 40 },
        { weight: "1 kg", price: 90, stock: 50 },
        { weight: "2 kg", price: 175, stock: 30 }
      ];
    } else if (name.includes('guava') || name.includes('amrood')) {
      category = "Fruits";
      basePrice = 80;
      unit = "1 kg";
      variations = [
        { weight: "500g", price: 45, stock: 35 },
        { weight: "1 kg", price: 80, stock: 40 },
        { weight: "2 kg", price: 155, stock: 20 }
      ];
    } else if (name.includes('pear') || name.includes('nashpati') || name.includes('plum') || name.includes('dates') || name.includes('amla') || name.includes('blueberry')) {
      category = "Fruits";
      basePrice = name.includes('blueberry') ? 220 : (name.includes('dates') ? 160 : 110);
      unit = "500g";
      variations = [
        { weight: "250g", price: Math.round(basePrice * 0.55), stock: 30 },
        { weight: "500g", price: basePrice, stock: 40 },
        { weight: "1 kg", price: Math.round(basePrice * 1.9), stock: 25 }
      ];
    }

    // ==========================================
    // 4. VEGETABLES & HERBS
    // ==========================================
    else if (name.includes('potato') || name.includes('aloo')) {
      category = "Vegetables";
      basePrice = 28;
      unit = "1 kg";
      variations = [
        { weight: "500g", price: 15, stock: 60 },
        { weight: "1 kg", price: 28, stock: 80 },
        { weight: "2 kg", price: 54, stock: 50 },
        { weight: "5 kg (Mandi Sack)", price: 130, stock: 30 }
      ];
    } else if (name.includes('onion') || name.includes('pyaz') || name.includes('pyaaz')) {
      category = "Vegetables";
      basePrice = 38;
      unit = "1 kg";
      variations = [
        { weight: "500g", price: 20, stock: 60 },
        { weight: "1 kg", price: 38, stock: 80 },
        { weight: "2 kg", price: 74, stock: 50 },
        { weight: "5 kg (Bhopal Farm Direct Pack)", price: 180, stock: 30 }
      ];
    } else if (name.includes('tomato') || name.includes('tamatar')) {
      category = "Vegetables";
      basePrice = 35;
      unit = "1 kg";
      variations = [
        { weight: "500g", price: 18, stock: 60 },
        { weight: "1 kg", price: 35, stock: 80 },
        { weight: "2 kg", price: 68, stock: 45 }
      ];
    } else if (name.includes('ginger') || name.includes('adrak')) {
      category = "Vegetables";
      basePrice = 120;
      unit = "1 kg";
      variations = [
        { weight: "100g", price: 15, stock: 40 },
        { weight: "250g", price: 35, stock: 50 },
        { weight: "500g", price: 65, stock: 40 },
        { weight: "1 kg", price: 120, stock: 25 }
      ];
    } else if (name.includes('garlic') || name.includes('lahsun')) {
      category = "Vegetables";
      basePrice = 180;
      unit = "1 kg";
      variations = [
        { weight: "100g", price: 22, stock: 40 },
        { weight: "250g", price: 50, stock: 50 },
        { weight: "500g", price: 95, stock: 40 },
        { weight: "1 kg", price: 180, stock: 25 }
      ];
    } else if (name.includes('chili') || name.includes('chilli') || name.includes('mirch') || name.includes('coriander') || name.includes('dhaniya') || name.includes('mint') || name.includes('pudina')) {
      category = "Vegetables";
      basePrice = 60;
      unit = "1 kg";
      variations = [
        { weight: "100g", price: 10, stock: 50 },
        { weight: "250g", price: 18, stock: 60 },
        { weight: "500g", price: 32, stock: 40 },
        { weight: "1 kg", price: 60, stock: 25 }
      ];
    } else if (name.includes('lemon') || name.includes('nimbu') || name.includes('neembu')) {
      category = "Vegetables";
      basePrice = 25;
      unit = "4 Pcs";
      variations = [
        { weight: "4 Pieces", price: 25, stock: 50 },
        { weight: "8 Pieces", price: 48, stock: 40 },
        { weight: "250g", price: 35, stock: 30 }
      ];
    } else {
      // General Fresh Vegetables (Bhindi, Lauki, Gobhi, Palak, Brinjal, Beans, Karela, etc.)
      category = "Vegetables";
      basePrice = Math.min(80, Math.max(30, item.price || 40));
      unit = "1 kg";
      variations = [
        { weight: "250g", price: Math.max(10, Math.round(basePrice * 0.28)), stock: 40 },
        { weight: "500g", price: Math.max(18, Math.round(basePrice * 0.52)), stock: 50 },
        { weight: "1 kg", price: basePrice, stock: 60 },
        { weight: "2 kg", price: Math.round(basePrice * 1.95), stock: 30 }
      ];
    }

    await groceryCol.updateOne(
      { _id: item._id },
      {
        $set: {
          category: category,
          price: basePrice,
          unit: unit,
          variations: variations
        }
      }
    );
  }

  // Synchronize master files
  const finalCalibrated = await groceryCol.find({}).sort({ category: 1, name: 1 }).toArray();

  const csvHeaders = ["name", "category", "price", "unit", "stock", "image", "description", "sourcing", "storage", "variations"];
  const csvRows = finalCalibrated.map(p => {
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
  fs.writeFileSync('public/combined_bhopal_products.json', JSON.stringify(finalCalibrated, null, 2), 'utf-8');

  console.log(`\nSUCCESSFULLY CALIBRATED ALL ${finalCalibrated.length} PRODUCTS WITH ACCURATE MANDI PRICING & CONTEXTUAL VARIATIONS!`);
  process.exit(0);
}

fixAllPricingAndVariations().catch(console.error);
