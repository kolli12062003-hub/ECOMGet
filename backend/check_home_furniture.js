const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const homeFurniture = await products.find({ category: 'Home Furniture' }).toArray();
    console.log('Total Home Furniture products:', homeFurniture.length);
    const activeHomeFurniture = homeFurniture.filter(p => p.status === 'active');
    console.log('Active Home Furniture products:', activeHomeFurniture.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Home Furniture' });
    console.log('Home Furniture category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
