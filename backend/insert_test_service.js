const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function insertTest() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const testProduct = {
      name: "Test Home Cleaning",
      price: 499,
      vendor: "Test CleanHome Services",
      category: "Services",
      image: "Home Cleaning.jpg",
      lat: 17.4486,
      lon: 78.3908,
      stock: 10,
      status: 'active',
      description: "Professional home cleaning service including dusting, vacuuming, and sanitizing"
    };

    const existing = await products.findOne({ name: "Test Home Cleaning" });
    if (!existing) {
      const result = await products.insertOne(testProduct);
      console.log('✅ Test product inserted:', result.insertedId);
    } else {
      console.log('⏭️  Test product already exists');
    }

    // Check if it was inserted
    const count = await products.countDocuments({ category: 'Services' });
    console.log('Total Services products now:', count);

  } finally {
    await client.close();
  }
}

insertTest().catch(console.error);