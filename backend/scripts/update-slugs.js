const { MongoClient } = require('mongodb');

async function updateSlugs() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('ecom_shopnest');
  const cats = await db.collection('categories').find({}).toArray();
  for (const cat of cats) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await db.collection('categories').updateOne({ _id: cat._id }, { $set: { slug: slug } });
    console.log('Updated', cat.name, 'to slug:', slug);
  }
  await client.close();
}

updateSlugs();
