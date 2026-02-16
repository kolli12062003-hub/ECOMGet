const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function revertServicesCategory() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('🔄 REVERTING SERVICES CATEGORY FROM "General Business" TO "Services"');
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const result = await products.updateMany(
      { category: "General Business" },
      { $set: { category: "Services" } }
    );

    console.log('✅ Connected to MongoDB');
    console.log(`✅ Updated ${result.modifiedCount} products from "General Business" to "Services"`);
    console.log('📊 Total Services products:', await products.countDocuments({ category: "Services" }));
    console.log('📊 Remaining General Business products:', await products.countDocuments({ category: "General Business" }));
    console.log('========================================');
    console.log('✅ CATEGORY REVERT COMPLETED');
    console.log('========================================');

  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

revertServicesCategory().catch(console.error);
