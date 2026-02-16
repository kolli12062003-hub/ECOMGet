const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function addLatLonToBag() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    // Add lat and lon to the product with vendor "Tulasi18" in Bags category
    const result = await products.updateOne(
      { vendor: 'Tulasi18', category: 'Bags' },
      { $set: { lat: 17.4486, lon: 78.3908 } }
    );

    console.log('Updated', result.modifiedCount, 'product with lat and lon');
  } finally {
    await client.close();
  }
}

addLatLonToBag().catch(console.error);
