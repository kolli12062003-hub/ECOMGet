const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const musical = await products.find({ category: 'Musical Instruments' }).toArray();
    console.log('Total Musical Instruments products:', musical.length);
    const activeMusical = musical.filter(p => p.status === 'active');
    console.log('Active Musical Instruments products:', activeMusical.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Musical Instruments' });
    console.log('Musical Instruments category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
