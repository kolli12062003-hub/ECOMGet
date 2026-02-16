const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const organicProducts = [
      { "name": "Organic Tomatoes", "price": 299, "vendor": "Fresh Farms", "category": "Organic Veggies&Fruits", "image": "tomato.jpeg", "lat": 17.4486, "lon": 78.3908, "stock": 20, "description": "Fresh organic tomatoes, 1kg pack, grown without pesticides" },
      { "name": "Organic Carrots", "price": 199, "vendor": "Green Valley", "category": "Organic Veggies&Fruits", "image": "carrot.jpeg", "lat": 17.4512, "lon": 78.3855, "stock": 25, "description": "Crunchy organic carrots, 1kg pack, naturally grown" },
      { "name": "Organic Apples", "price": 399, "vendor": "Orchard Fresh", "category": "Organic Veggies&Fruits", "image": "Organic Apples.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 15, "description": "Sweet organic apples, 1kg pack, pesticide-free" },
      { "name": "Organic Spinach", "price": 149, "vendor": "Leafy Greens", "category": "Organic Veggies&Fruits", "image": "spinach.jpeg", "lat": 17.4550, "lon": 78.3920, "stock": 18, "description": "Fresh organic spinach, 500g pack, nutrient-rich" },
      { "name": "Organic Bananas", "price": 249, "vendor": "Tropical Fruits", "category": "Organic Veggies&Fruits", "image": "Bananas.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 30, "description": "Ripe organic bananas, 1kg pack, naturally sweet" },
      { "name": "Organic Bell Peppers", "price": 179, "vendor": "Colorful Veggies", "category": "Organic Veggies&Fruits", "image": "bell-pepper.jpeg", "lat": 17.4455, "lon": 78.3800, "stock": 12, "description": "Colorful organic bell peppers, 500g pack, mixed colors" },
      { "name": "Organic Avocados", "price": 349, "vendor": "Creamy Fruits", "category": "Organic Veggies&Fruits", "image": "Avocados.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 10, "description": "Creamy organic avocados, 2 pieces, ripe and ready" },
      { "name": "Organic Cucumbers", "price": 129, "vendor": "Fresh Harvest", "category": "Organic Veggies&Fruits", "image": "cucumber.jpeg", "lat": 17.4520, "lon": 78.3870, "stock": 22, "description": "Crisp organic cucumbers, 500g pack, garden fresh" },
      { "name": "Organic Strawberries", "price": 279, "vendor": "Berry Farm", "category": "Organic Veggies&Fruits", "image": "Strawberries.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 14, "description": "Sweet organic strawberries, 500g pack, juicy and fresh" },
      { "name": "Organic Broccoli", "price": 189, "vendor": "Green Garden", "category": "Organic Veggies&Fruits", "image": "broccali.jpeg", "lat": 17.4490, "lon": 78.3950, "stock": 16, "description": "Fresh organic broccoli, 500g pack, nutrient-dense" },
      { "name": "Organic Blueberries", "price": 319, "vendor": "Berry Delight", "category": "Organic Veggies&Fruits", "image": "Blueberries.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 11, "description": "Antioxidant-rich organic blueberries, 250g pack" },
      { "name": "Organic Potatoes", "price": 159, "vendor": "Earth's Bounty", "category": "Organic Veggies&Fruits", "image": "potato.jpeg", "lat": 17.4430, "lon": 78.3860, "stock": 28, "description": "Versatile organic potatoes, 2kg pack, naturally grown" },
      { "name": "Organic Lettuce", "price": 139, "vendor": "Leafy Greens", "category": "Organic Veggies&Fruits", "image": "lettuce.jpeg", "lat": 17.4470, "lon": 78.3910, "stock": 19, "description": "Crisp organic lettuce, 500g pack, perfect for salads" },
      { "name": "Organic Oranges", "price": 299, "vendor": "Citrus Grove", "category": "Organic Veggies&Fruits", "image": "oranges.jpg", "lat": 17.4410, "lon": 78.3840, "stock": 17, "description": "Juicy organic oranges, 1kg pack, vitamin C rich" },
      { "name": "Organic Zucchini", "price": 169, "vendor": "Fresh Harvest", "category": "Organic Veggies&Fruits", "image": "zucchini.jpeg", "lat": 17.4460, "lon": 78.3930, "stock": 13, "description": "Tender organic zucchini, 500g pack, versatile vegetable" }
    ];

    const insertedProducts = [];
    for (const productData of organicProducts) {
      const existingProduct = await products.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = { ...productData, status: 'active' };
        await products.insertOne(product);
        insertedProducts.push(product);
        console.log('✅ Product inserted:', product.name);
      } else {
        console.log('⏭️  Product already exists:', productData.name);
      }
    }

    console.log('\n========================================');
    console.log('✅ ORGANIC VEGGIES & FRUITS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
