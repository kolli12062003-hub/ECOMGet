const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function fixServicesCategories() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully');
    const db = client.db('ecom_shopnest');
    console.log('📊 Using database:', db.databaseName);
    const products = db.collection('products');

    const serviceNames = [
      "Home Cleaning", "Plumbing Repair", "Electrical Work", "Gardening Service",
      "Car Wash", "Pest Control", "AC Repair", "Painting Service", "Appliance Repair",
      "Tutoring", "Pet Grooming", "Event Planning", "Photography", "Massage Therapy",
      "House Painting"
    ];

    console.log('🔧 Fixing service product categories...');

    let updatedCount = 0;
    for (const name of serviceNames) {
      const result = await products.updateOne(
        { name },
        { $set: { category: "Services" } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated category for: ${name}`);
        updatedCount++;
      } else {
        console.log(`⏭️  No update needed for: ${name}`);
      }
    }

    console.log('\n========================================');
    console.log(`✅ CATEGORY FIX COMPLETED`);
    console.log(`   Products updated: ${updatedCount}`);
    console.log('========================================\n');

    // Verify the fix
    console.log('🔍 Verifying fix...');
    const servicesCount = await products.countDocuments({ category: "Services" });
    console.log(`Total products with category "Services": ${servicesCount}`);

  } finally {
    await client.close();
  }
}

fixServicesCategories().catch(console.error);
