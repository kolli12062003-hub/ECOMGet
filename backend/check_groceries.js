const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const grocery = await products.find({ category: 'Groceries' }).toArray();
    console.log('Total Groceries products:', grocery.length);
    const activeGrocery = grocery.filter(p => p.status === 'active');
    console.log('Active Groceries products:', activeGrocery.length);
    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Grocery' });
    console.log('Grocery category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
