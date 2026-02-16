const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function seedCategory() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const categories = db.collection('categories');

    const existingCategory = await categories.findOne({ name: 'Organic Veggies&Fruits' });
    if (!existingCategory) {
      await categories.insertOne({
        name: 'Organic Veggies&Fruits',
        status: 'active',
        description: 'Fresh organic vegetables and fruits grown without pesticides'
      });
      console.log('✅ Category inserted: Organic Veggies&Fruits');
    } else {
      console.log('⏭️  Category already exists: Organic Veggies&Fruits');
    }
  } finally {
    await client.close();
  }
}

seedCategory().catch(console.error);
