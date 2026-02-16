const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const sportsFitnessProducts = await products.find({ category: 'Sports & Fitness' }).toArray();
    console.log('Total Sports & Fitness Products:', sportsFitnessProducts.length);
    const activeSportsFitnessProducts = sportsFitnessProducts.filter(p => p.status === 'active');
    console.log('Active Sports & Fitness Products:', activeSportsFitnessProducts.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Sports & Fitness' });
    console.log('Sports & Fitness category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
