const { MongoClient } = require('mongodb');

// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';
const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const fruitsProducts = [
      { "name": "Fresh Apples", "price": 299, "vendor": "Orchard Fresh", "category": "Fruits", "image": "Fresh Apples.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 50, "description": "Crisp and juicy red apples, perfect for snacking or baking" },
      { "name": "Fresh Bananas", "price": 99, "vendor": "Fruit Basket", "category": "Fruits", "image": "Fresh Bananas.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 100, "description": "Sweet and ripe bananas, great for smoothies and desserts" },
      { "name": "Fresh Oranges", "price": 199, "vendor": "Citrus Delight", "category": "Fruits", "image": "Fresh Oranges.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 75, "description": "Tangy and refreshing oranges, rich in vitamin C" },
      { "name": "Fresh Grapes", "price": 149, "vendor": "Vineyard Fresh", "category": "Fruits", "image": "Fresh Grapes.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 60, "description": "Sweet seedless grapes, perfect for healthy snacking" },
      { "name": "Fresh Strawberries", "price": 399, "vendor": "Berry Farms", "category": "Fruits", "image": "Fresh Strawberries.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 40, "description": "Juicy and sweet strawberries, ideal for desserts and salads" },
      { "name": "Fresh Mangoes", "price": 249, "vendor": "Tropical Fruits", "category": "Fruits", "image": "Fresh Mangoes.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 35, "description": "Ripe and flavorful mangoes, the king of fruits" },
      { "name": "Fresh Pineapples", "price": 199, "vendor": "Tropical Delights", "category": "Fruits", "image": "Fresh Pineapples.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 25, "description": "Sweet and tangy pineapples, great for tropical flavors" },
      { "name": "Fresh Watermelons", "price": 299, "vendor": "Summer Fruits", "category": "Fruits", "image": "Fresh Watermelons.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 20, "description": "Juicy and refreshing watermelons, perfect for summer" },
      { "name": "Fresh Kiwis", "price": 149, "vendor": "Exotic Fruits", "category": "Fruits", "image": "Fresh Kiwis.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 45, "description": "Tangy and nutritious kiwis, packed with vitamins" },
      { "name": "Fresh Peaches", "price": 199, "vendor": "Stone Fruit Co", "category": "Fruits", "image": "Fresh Peaches.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 30, "description": "Sweet and juicy peaches, perfect for canning or eating fresh" },
      { "name": "Fresh Pears", "price": 179, "vendor": "Orchard Fresh", "category": "Fruits", "image": "Fresh Pears.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 55, "description": "Mild and sweet pears, great for salads and desserts" },
      { "name": "Fresh Cherries", "price": 499, "vendor": "Berry Delights", "category": "Fruits", "image": "Fresh Cherries.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 15, "description": "Plump and sweet cherries, a seasonal delicacy" },
      { "name": "Fresh Plums", "price": 129, "vendor": "Stone Fruit Co", "category": "Fruits", "image": "Fresh Plums.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 40, "description": "Juicy and tart plums, perfect for jams and fresh eating" },
      { "name": "Fresh Papayas", "price": 199, "vendor": "Tropical Fruits", "category": "Fruits", "image": "Fresh Papayas.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 28, "description": "Sweet and tropical papayas, rich in digestive enzymes" },
      { "name": "Fresh Avocados", "price": 349, "vendor": "Healthy Fruits", "category": "Fruits", "image": "Fresh Avocados.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 32, "description": "Creamy and nutritious avocados, perfect for guacamole" }
    ];

    const insertedProducts = [];
    for (const productData of fruitsProducts) {
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
    console.log('✅ FRUITS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
