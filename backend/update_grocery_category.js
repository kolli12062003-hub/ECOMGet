require('dotenv').config();
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  image: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  stock: { type: Number, default: 0 },
  description: { type: String },
  type: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function updateGroceryCategory() {
  try {
    console.log('🔄 UPDATING GROCERY CATEGORY FROM "Grocery" TO "Groceries"');

    // Connect to MongoDB using hardcoded URI since .env is not accessible
    const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Update all products with category "Grocery" to "Groceries"
    const result = await Product.updateMany(
      { category: 'Grocery' },
      { $set: { category: 'Groceries' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products from "Grocery" to "Groceries"`);

    // Verify the update
    const groceryProducts = await Product.find({ category: 'Groceries' });
    console.log(`📊 Total Groceries products: ${groceryProducts.length}`);

    // Check if any "Grocery" products remain
    const remainingGrocery = await Product.find({ category: 'Grocery' });
    console.log(`📊 Remaining Grocery products: ${remainingGrocery.length}`);

    console.log('========================================');
    console.log('✅ CATEGORY UPDATE COMPLETED');
    console.log('========================================');

  } catch (error) {
    console.error('❌ Error updating category:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

updateGroceryCategory();
