const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function forceSeed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Create or update Grocery category
    const categoryData = {
      name: 'Groceries',
      description: 'Fresh groceries and daily essentials',
      image: 'grocery-hero.jpg',
      status: 'active'
    };

    const category = await categories.findOneAndUpdate(
      { name: 'Groceries' },
      { $set: categoryData },
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category ? category.name : 'Grocery');

    // Delete existing groceries products
    const deleteResult = await products.deleteMany({ category: 'Groceries' });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing groceries products`);

    const groceryProducts = [
      { "name": "Organic Rice", "price": 199, "vendor": "Fresh Farms", "category": "Groceries", "image": "Organic Rice.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 50, "description": "Premium organic rice, healthy and nutritious" },
      { "name": "Whole Wheat Flour", "price": 149, "vendor": "Pure Grains", "category": "Groceries", "image": "Whole Wheat Flour.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 50, "description": "High-quality whole wheat flour for baking" },
      { "name": "Olive Oil", "price": 499, "vendor": "Healthy Oils", "category": "Groceries", "image": "Olive Oil.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 50, "description": "Extra virgin olive oil, rich in antioxidants" },
      { "name": "Fresh Apples", "price": 299, "vendor": "Orchard Fresh", "category": "Groceries", "image": "Fresh Apples.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 50, "description": "Crisp and juicy fresh apples" },
      { "name": "Milk", "price": 59, "vendor": "Dairy Delight", "category": "Groceries", "image": "Milk.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 50, "description": "Fresh cow's milk, pasteurized and homogenized" },
      { "name": "Organic Honey", "price": 399, "vendor": "Sweet Harvest", "category": "Groceries", "image": "Organic Honey.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 50, "description": "Pure organic honey from natural sources" },
      { "name": "Fresh Tomatoes", "price": 99, "vendor": "Green Veggie", "category": "Groceries", "image": "Fresh Tomatoes.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 50, "description": "Ripe and fresh tomatoes, perfect for cooking" },
      { "name": "Pasta", "price": 149, "vendor": "Italiano Foods", "category": "Groceries", "image": "Pasta.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 50, "description": "Authentic Italian pasta, quick to cook" },
      { "name": "Almonds", "price": 599, "vendor": "Nutty Delights", "category": "Groceries", "image": "Almonds.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 50, "description": "Premium quality almonds, rich in nutrients" },
      { "name": "Green Tea", "price": 249, "vendor": "Pure Leaf", "category": "Groceries", "image": "Green Tea (100g).jpg", "lat": 17.4490, "lon": 78.3950, "stock": 50, "description": "Refreshing green tea leaves, 100g pack" },
      { "name": "Fresh Spinach", "price": 79, "vendor": "Green Grocer", "category": "Groceries", "image": "Fresh Spinach.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 50, "description": "Fresh organic spinach leaves" },
      { "name": "Butter", "price": 199, "vendor": "Creamy Dairy", "category": "Groceries", "image": "Butter.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 50, "description": "Creamy butter, perfect for cooking and baking" },
      { "name": "Oats", "price": 299, "vendor": "Healthy Grains", "category": "Groceries", "image": "Oats.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 50, "description": "Nutritious rolled oats for breakfast" },
      { "name": "Fresh Bananas", "price": 99, "vendor": "Fruit Basket", "category": "Groceries", "image": "Fresh Bananas.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 50, "description": "Sweet and fresh bananas" },
      { "name": "Canned Beans", "price": 149, "vendor": "Pantry Staples", "category": "Groceries", "image": "Canned Beans.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 50, "description": "Convenient canned beans, ready to eat" }
    ];

    const insertedProducts = [];
    for (const productData of groceryProducts) {
      const product = { ...productData, status: 'active' };
      await products.insertOne(product);
      insertedProducts.push(product);
      console.log('✅ Product inserted:', product.name);
    }

    console.log('\n========================================');
    console.log('✅ FORCE GROCERY SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

forceSeed().catch(console.error);
