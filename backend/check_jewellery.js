const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    // Check all jewellery categories
    const womensJewellery = await products.find({ category: 'Jewellery' }).toArray();
    const mensJewellery = await products.find({ category: 'Mens Jewellery' }).toArray();
    const kidsJewellery = await products.find({ category: 'Kids Jewellery' }).toArray();

    console.log('Total Womens Jewellery products:', womensJewellery.length);
    console.log('Total Mens Jewellery products:', mensJewellery.length);
    console.log('Total Kids Jewellery products:', kidsJewellery.length);

    const totalJewellery = womensJewellery.length + mensJewellery.length + kidsJewellery.length;
    console.log('Total Jewellery products (all categories):', totalJewellery);

    const activeWomens = womensJewellery.filter(p => p.status === 'active');
    const activeMens = mensJewellery.filter(p => p.status === 'active');
    const activeKids = kidsJewellery.filter(p => p.status === 'active');
    const totalActive = activeWomens.length + activeMens.length + activeKids.length;

    console.log('Active Womens Jewellery products:', activeWomens.length);
    console.log('Active Mens Jewellery products:', activeMens.length);
    console.log('Active Kids Jewellery products:', activeKids.length);
    console.log('Total Active Jewellery products:', totalActive);

    const categories = db.collection('categories');
    const cat = await categories.findOne({ name: 'Jewellery' });
    console.log('Jewellery category:', cat ? 'exists' : 'not found');
    if (cat) {
      console.log('Category status:', cat.status);
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
