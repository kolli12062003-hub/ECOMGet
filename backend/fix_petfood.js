const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function fix() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const result = await products.updateMany(
      { category: 'Pet Food' },
      { $set: { status: 'active' } }
    );
    console.log('Updated', result.modifiedCount, 'Petfood products to active status');
  } finally {
    await client.close();
  }
}

fix().catch(console.error);
