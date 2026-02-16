const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const organicProducts = await products.find({ category: 'Organic Veggies&Fruits' }).toArray();
    console.log('Total Organic Veggies&Fruits Products:', organicProducts.length);
    const activeOrganicProducts = organicProducts.filter(p => p.status === 'active');
    console.log('Active Organic Veggies&Fruits Products:', activeOrganicProducts.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Organic Veggies&Fruits' });
    console.log('Organic Veggies&Fruits category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
