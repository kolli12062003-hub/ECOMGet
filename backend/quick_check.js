const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const count = await products.countDocuments({ category: { $in: ['Jewellery', 'Mens Jewellery', 'Kids Jewellery'] } });
    console.log('Total Jewellery products (all categories):', count);
  } finally {
    await client.close();
  }
}

check().catch(console.error);
