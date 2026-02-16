const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const clothingProducts = await products.find({ category: 'Clothes' }).toArray();
    console.log('Total Clothes Products:', clothingProducts.length);
    const activeClothingProducts = clothingProducts.filter(p => p.status === 'active');
    console.log('Active Clothes Products:', activeClothingProducts.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Clothes' });
    console.log('Clothes category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
