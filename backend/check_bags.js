const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const bags = await products.find({ category: 'Bags' }).toArray();
    console.log('Total Bags products:', bags.length);
    const activeBags = bags.filter(p => p.status === 'active');
    console.log('Active Bags products:', activeBags.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Bags' });
    console.log('Bags category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
