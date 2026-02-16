const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const count = await products.countDocuments();
    console.log('Total products:', count);
    const active = await products.countDocuments({ status: 'active' });
    console.log('Active products:', active);
    const inactive = await products.countDocuments({ status: 'inactive' });
    console.log('Inactive products:', inactive);
    const noStatus = await products.countDocuments({ status: { $exists: false } });
    console.log('Products without status:', noStatus);
  } finally {
    await client.close();
  }
}

check().catch(console.error);
