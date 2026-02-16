const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const books = await products.find({ category: 'Books' }).toArray();
    console.log('Total Books products:', books.length);
    const activeBooks = books.filter(p => p.status === 'active');
    console.log('Active Books products:', activeBooks.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Books' });
    console.log('Books category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
