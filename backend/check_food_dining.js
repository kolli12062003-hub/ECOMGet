const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const foodDining = await products.find({ category: 'Food & Dining' }).toArray();
    console.log('Total Food & Dining products:', foodDining.length);
    const activeFoodDining = foodDining.filter(p => p.status === 'active');
    console.log('Active Food & Dining products:', activeFoodDining.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Food & Dining' });
    console.log('Food & Dining category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
