const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function updateSubcategories() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    // Update products with category 'Jewellery' to add subcategory 'Women's Jewellery'
    const result1 = await products.updateMany(
      { category: 'Jewellery', subcategory: { $exists: false } },
      { $set: { subcategory: "Women's Jewellery" } }
    );
    console.log('Updated', result1.modifiedCount, 'products to Women\'s Jewellery subcategory');

    // Update products with category 'Mens Jewellery' to add subcategory 'Men's Jewellery'
    const result2 = await products.updateMany(
      { category: 'Mens Jewellery' },
      { $set: { subcategory: "Men's Jewellery" } }
    );
    console.log('Updated', result2.modifiedCount, 'products to Men\'s Jewellery subcategory');

    // Update products with category 'Kids Jewellery' to add subcategory 'Kids' Jewellery'
    const result3 = await products.updateMany(
      { category: 'Kids Jewellery' },
      { $set: { subcategory: "Kids' Jewellery" } }
    );
    console.log('Updated', result3.modifiedCount, 'products to Kids\' Jewellery subcategory');

    console.log('Subcategory updates completed.');
  } finally {
    await client.close();
  }
}

updateSubcategories().catch(console.error);
