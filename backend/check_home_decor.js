const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const homeDecorProducts = await products.find({ category: 'Home Decor' }).toArray();
    console.log('Total Home Decor Products:', homeDecorProducts.length);
    const activeHomeDecorProducts = homeDecorProducts.filter(p => p.status === 'active');
    console.log('Active Home Decor Products:', activeHomeDecorProducts.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Home Decor' });
    console.log('Home Decor category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
