const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function updateProductCategories() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    console.log('🔄 UPDATING PRODUCT CATEGORIES FROM "Groceries" TO "Grocery"');

    // Update all products with category "Groceries" to "Grocery"
    const result = await products.updateMany(
      { category: 'Groceries' },
      { $set: { category: 'Grocery' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products from "Groceries" to "Grocery"`);

    // Verify the update
    const groceryProducts = await products.find({ category: 'Grocery' }).toArray();
    console.log(`📊 Total Grocery products after update: ${groceryProducts.length}`);

    const groceriesProducts = await products.find({ category: 'Groceries' }).toArray();
    console.log(`📊 Remaining Groceries products: ${groceriesProducts.length}`);

  } finally {
    await client.close();
  }
}

updateProductCategories().catch(console.error);
