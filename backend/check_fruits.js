const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const fruits = await products.find({ category: 'Fruits' }).toArray();
    console.log('Total Fruits products:', fruits.length);
    const activeFruits = fruits.filter(p => p.status === 'active');
    console.log('Active Fruits products:', activeFruits.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Fruits' });
    console.log('Fruits category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
