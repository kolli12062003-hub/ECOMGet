const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function checkWatches() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    console.log('🔍 Checking Watches products...\n');

    const watchesProducts = await products.find({ category: 'Watches' }).toArray();

    console.log(`📊 Total Watches products: ${watchesProducts.length}\n`);

    const subcategories = {};
    watchesProducts.forEach(product => {
      const subcat = product.subcategory || 'No Subcategory';
      if (!subcategories[subcat]) {
        subcategories[subcat] = [];
      }
      subcategories[subcat].push(product.name);
    });

    console.log('📂 Subcategories:');
    Object.keys(subcategories).forEach(subcat => {
      console.log(`  ${subcat}: ${subcategories[subcat].length} products`);
      subcategories[subcat].slice(0, 3).forEach(name => console.log(`    - ${name}`));
      if (subcategories[subcat].length > 3) {
        console.log(`    ... and ${subcategories[subcat].length - 3} more`);
      }
    });

    console.log('\n✅ Check completed!');

  } finally {
    await client.close();
  }
}

checkWatches().catch(console.error);
