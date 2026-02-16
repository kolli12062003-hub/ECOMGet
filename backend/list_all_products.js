const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function listProducts() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const allProducts = await products.find({}).toArray();
    console.log('Total products in database:', allProducts.length);

    if (allProducts.length > 0) {
      console.log('Sample products:');
      allProducts.slice(0, 10).forEach(product => {
        console.log(`- Name: ${product.name}, Category: ${product.category}, Status: ${product.status}`);
      });
    }

    const groceryProducts = allProducts.filter(p => p.category && p.category.toLowerCase().includes('grocery'));
    console.log('Products with grocery in category:', groceryProducts.length);
    groceryProducts.forEach(product => {
      console.log(`- Name: ${product.name}, Category: ${product.category}`);
    });

  } finally {
    await client.close();
  }
}

listProducts().catch(console.error);
