const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const foodDiningProducts = [
      { "name": "Pepperoni Pizza", "price": 349, "vendor": "PizzaPalace", "category": "Food & Dining", "image": "Pepperoni Pizza.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 50, "description": "Classic Italian pizza with pepperoni, cheese, and tomato sauce" },
      { "name": "Veggie Burger", "price": 179, "vendor": "BurgerBonanza", "category": "Food & Dining", "image": "Veggie Burger.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 30, "description": "Delicious veggie burger with fresh vegetables and special sauce" },
      { "name": "Spaghetti-Carbonara", "price": 279, "vendor": "PastaPlace", "category": "Food & Dining", "image": "Spaghetti Carbonara.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 25, "description": "Creamy spaghetti carbonara with bacon and parmesan cheese" },
      { "name": "Butter Chicken", "price": 399, "vendor": "CurryCorner", "category": "Food & Dining", "image": "Butter Chicken.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 20, "description": "Rich and creamy butter chicken curry with aromatic spices" },
      { "name": "California Roll", "price": 649, "vendor": "SushiSpot", "category": "Food & Dining", "image": "California Roll.webp", "lat": 17.4399, "lon": 78.4421, "stock": 15, "description": "Fresh California roll with avocado, crab, and cucumber" },
      { "name": "Club Sandwich", "price": 159, "vendor": "SnackShack", "category": "Food & Dining", "image": "Club Sandwich.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 40, "description": "Triple-decker club sandwich with chicken, bacon, and veggies" },
      { "name": "Greek Salad", "price": 199, "vendor": "SaladStop", "category": "Food & Dining", "image": "Greek Salad.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 35, "description": "Fresh Greek salad with feta cheese, olives, and vegetables" },
      { "name": "BBQ Ribs", "price": 449, "vendor": "GrillGuru", "category": "Food & Dining", "image": "BBQ Ribs.jpeg", "lat": 17.4520, "lon": 78.3870, "stock": 18, "description": "Slow-cooked BBQ ribs with coleslaw and special sauce" },
      { "name": "Tiramisu", "price": 249, "vendor": "DessertDen", "category": "Food & Dining", "image": "Tiramisu.jpeg", "lat": 17.4400, "lon": 78.3850, "stock": 22, "description": "Classic Italian tiramisu with coffee and mascarpone cream" },
      { "name": "South Indian Thali", "price": 229, "vendor": "TasteOfSouth", "category": "Food & Dining", "image": "South Indian Thali.jpeg", "lat": 17.4490, "lon": 78.3950, "stock": 28, "description": "Complete South Indian thali with rice, curries, and sides" },
      { "name": "Mutton Rogan Josh", "price": 429, "vendor": "CurryCorner", "category": "Food & Dining", "image": "Mutton Rogan Josh.jpeg", "lat": 17.4550, "lon": 78.3920, "stock": 16, "description": "Spicy Kashmiri mutton rogan josh curry" },
      { "name": "Veg Fried Rice", "price": 169, "vendor": "WokToss", "category": "Food & Dining", "image": "Veg Fried Rice.jpeg", "lat": 17.4430, "lon": 78.3860, "stock": 45, "description": "Vegetable fried rice with Asian spices and vegetables" },
      { "name": "Steamed Bao Buns", "price": 149, "vendor": "AsianBites", "category": "Food & Dining", "image": "Steamed Bao Buns.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 32, "description": "Soft steamed bao buns with savory fillings" },
      { "name": "Shawarma Wrap", "price": 219, "vendor": "MediterraneanMunch", "category": "Food & Dining", "image": "Shawarma Wrap.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 38, "description": "Middle Eastern shawarma wrap with spiced meat and veggies" },
      { "name": "Chocolate Lava Cake", "price": 199, "vendor": "DessertDen", "category": "Food & Dining", "image": "Chocolate Lava Cake.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 25, "description": "Warm chocolate lava cake with molten center" }
    ];

    const insertedProducts = [];
    for (const productData of foodDiningProducts) {
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
    console.log('✅ FOOD & DINING SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
