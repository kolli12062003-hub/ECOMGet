const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';


async function seedCategory() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const categories = db.collection('categories');

    const clothingCategory = {
      name: 'Clothes',
      status: 'active',
      description: 'Fashion and clothing items for all occasions',
      image: 'clothes-category.jpg'
    };

    const existingCategory = await categories.findOne({ name: 'Clothes' });
    if (!existingCategory) {
      await categories.insertOne(clothingCategory);
      console.log('✅ Clothes category inserted');
    } else {
      console.log('⏭️  Clothes category already exists');
    }

  } finally {
    await client.close();
  }
}

seedCategory().catch(console.error);
