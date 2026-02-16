const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';
// const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const categories = db.collection('categories');

    const category = {
      name: 'Petfood',
      description: 'Pet food and supplies for dogs, cats, and other pets.',
      image: 'petfood-hero.jpg',
      status: 'active',
      updatedAt: new Date(),
    };

    const existingCat = await categories.findOne({ name: 'Petfood' });
    if (existingCat) {
      await categories.updateOne({ _id: existingCat._id }, { $set: category });
      console.log('Petfood category updated');
    } else {
      category.createdAt = new Date();
      await categories.insertOne(category);
      console.log('Petfood category inserted');
    }

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
