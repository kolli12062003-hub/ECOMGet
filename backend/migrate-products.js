require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Define schemas
const sellerSchema = new mongoose.Schema({
  businessName: String,
  email: String,
  fullname: String
});

const productSchema = new mongoose.Schema({
  name: String,
  vendor: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
});

const Seller = mongoose.model('Seller', sellerSchema);
const Product = mongoose.model('Product', productSchema);

async function migrateProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    console.log('📦 Fetching all products...');
    const products = await Product.find({});
    console.log(`Found ${products.length} total products\n`);

    console.log('🔍 Checking for products without sellerId...');
    const productsWithoutSellerId = products.filter(p => !p.sellerId);
    console.log(`Found ${productsWithoutSellerId.length} products without sellerId\n`);

    if (productsWithoutSellerId.length === 0) {
      console.log('✅ All products already have sellerId!');
      process.exit(0);
    }

    console.log('👥 Fetching all sellers...');
    const sellers = await Seller.find({});
    console.log(`Found ${sellers.length} sellers\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    console.log('🔄 Starting migration...\n');

    for (const product of productsWithoutSellerId) {
      console.log(`Processing: "${product.name}" (vendor: "${product.vendor}")`);

      // Find seller by business name (case-insensitive)
      const seller = sellers.find(s => 
        s.businessName.toLowerCase() === product.vendor.toLowerCase()
      );

      if (seller) {
        // Update product with sellerId
        await Product.updateOne(
          { _id: product._id },
          { $set: { sellerId: seller._id } }
        );
        console.log(`  ✅ Added sellerId: ${seller._id} (${seller.businessName})\n`);
        updatedCount++;
      } else {
        console.log(`  ⚠️  No seller found for vendor: "${product.vendor}" - SKIPPED\n`);
        skippedCount++;
      }
    }

    console.log('========================================');
    console.log('✅ MIGRATION COMPLETED!');
    console.log(`   Updated: ${updatedCount} products`);
    console.log(`   Skipped: ${skippedCount} products (no matching seller)`);
    console.log('========================================\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateProducts();