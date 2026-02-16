const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const beauty = await products.find({ category: 'Beauty Products' }).toArray();
    console.log('Total Beauty products:', beauty.length);
    const activeBeauty = beauty.filter(p => p.status === 'active');
    console.log('Active Beauty products:', activeBeauty.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Beauty Products' });
    console.log('Beauty category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
