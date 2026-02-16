/*
  Seed script for Food & Dine category and products
  Usage:
    node scripts/seed-food-dine.js
  Env:
    MONGODB_URI (optional) - defaults to mongodb://127.0.0.1:27017/ecomreact
*/

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const dbName = new URL(MONGODB_URI).pathname.replace('/', '') || 'ecomreact';
    const db = client.db(dbName);

    const categories = db.collection('categories');
    const products = db.collection('products');

    // Ensure indexes
    await categories.createIndex({ slug: 1 }, { unique: true });
    await products.createIndex({ categoryId: 1 });
    // await products.createIndex({ title: 'text' }); // Skip if already exists

    // Upsert category
    const category = {
      name: 'Food & Dine',
      slug: 'food-dine',
      description: 'Meals, snacks, and dining experiences including restaurants and takeout.',
      updatedAt: new Date(),
    };

    let catId;
    const existingCat = await categories.findOne({ slug: category.slug });
    if (existingCat) {
      await categories.updateOne({ _id: existingCat._id }, { $set: category });
      catId = existingCat._id;
    } else {
      category.createdAt = new Date();
      const res = await categories.insertOne(category);
      catId = res.insertedId;
    }

    // Products list
    const baseProducts = [
      {
        title: 'Pepperoni Pizza',
        description: 'Classic Italian pizza with pepperoni, cheese, and tomato sauce',
        price: 349,
        currency: 'INR',
        images: ['Pepperoni Pizza.jpg'],
        stock: 50,
        rating: 4.5,
        tags: ['pizza', 'italian', 'fast-food'],
        subcategory: 'Pizza'
      },
      {
        title: 'Veggie Burger',
        description: 'Delicious veggie burger with fresh vegetables and special sauce',
        price: 179,
        currency: 'INR',
        images: ['Veggie Burger.jpg'],
        stock: 30,
        rating: 4.2,
        tags: ['burger', 'vegetarian', 'healthy'],
        subcategory: 'Burger'
      },
      {
        title: 'Spaghetti-Carbonara',
        description: 'Creamy spaghetti carbonara with bacon and parmesan cheese',
        price: 279,
        currency: 'INR',
        images: ['Spaghetti Carbonara.jpg'],
        stock: 25,
        rating: 4.7,
        tags: ['pasta', 'italian', 'creamy'],
        subcategory: 'Pasta'
      },
      {
        title: 'Butter Chicken',
        description: 'Rich and creamy butter chicken curry with aromatic spices',
        price: 399,
        currency: 'INR',
        images: ['Butter Chicken.jpg'],
        stock: 20,
        rating: 4.8,
        tags: ['curry', 'indian', 'spicy'],
        subcategory: 'Curry'
      },
      {
        title: 'California Roll',
        description: 'Fresh California roll with avocado, crab, and cucumber',
        price: 649,
        currency: 'INR',
        images: ['California Roll.webp'],
        stock: 15,
        rating: 4.4,
        tags: ['sushi', 'japanese', 'seafood'],
        subcategory: 'Sushi'
      },
      {
        title: 'Club Sandwich',
        description: 'Triple-decker club sandwich with chicken, bacon, and veggies',
        price: 159,
        currency: 'INR',
        images: ['Club Sandwich.jpg'],
        stock: 40,
        rating: 4.3,
        tags: ['sandwich', 'club', 'chicken'],
        subcategory: 'Sandwich'
      },
      {
        title: 'Greek Salad',
        description: 'Fresh Greek salad with feta cheese, olives, and vegetables',
        price: 199,
        currency: 'INR',
        images: ['Greek Salad.jpg'],
        stock: 35,
        rating: 4.1,
        tags: ['salad', 'greek', 'healthy'],
        subcategory: 'Salad'
      },
      {
        title: 'BBQ Ribs',
        description: 'Slow-cooked BBQ ribs with coleslaw and special sauce',
        price: 449,
        currency: 'INR',
        images: ['BBQ Ribs.jpeg'],
        stock: 18,
        rating: 4.6,
        tags: ['bbq', 'ribs', 'grilled'],
        subcategory: 'Grilled'
      },
      {
        title: 'Tiramisu',
        description: 'Classic Italian tiramisu with coffee and mascarpone cream',
        price: 249,
        currency: 'INR',
        images: ['Tiramisu.jpeg'],
        stock: 22,
        rating: 4.5,
        tags: ['dessert', 'italian', 'coffee'],
        subcategory: 'Dessert'
      },
      {
        title: 'South Indian Thali',
        description: 'Complete South Indian thali with rice, curries, and sides',
        price: 229,
        currency: 'INR',
        images: ['South Indian Thali.jpeg'],
        stock: 28,
        rating: 4.4,
        tags: ['thali', 'south-indian', 'rice'],
        subcategory: 'Thali'
      },
      {
        title: 'Mutton Rogan Josh',
        description: 'Spicy Kashmiri mutton rogan josh curry',
        price: 429,
        currency: 'INR',
        images: ['Mutton Rogan Josh.jpeg'],
        stock: 16,
        rating: 4.7,
        tags: ['curry', 'mutton', 'kashmiri'],
        subcategory: 'Curry'
      },
      {
        title: 'Veg Fried Rice',
        description: 'Vegetable fried rice with Asian spices and vegetables',
        price: 169,
        currency: 'INR',
        images: ['Veg Fried Rice.jpeg'],
        stock: 45,
        rating: 4.2,
        tags: ['rice', 'vegetarian', 'asian'],
        subcategory: 'Rice'
      },
      {
        title: 'Steamed Bao Buns',
        description: 'Soft steamed bao buns with savory fillings',
        price: 149,
        currency: 'INR',
        images: ['Steamed Bao Buns.jpg'],
        stock: 32,
        rating: 4.3,
        tags: ['bao', 'steamed', 'asian'],
        subcategory: 'Asian'
      },
      {
        title: 'Shawarma Wrap',
        description: 'Middle Eastern shawarma wrap with spiced meat and veggies',
        price: 219,
        currency: 'INR',
        images: ['Shawarma Wrap.jpg'],
        stock: 38,
        rating: 4.5,
        tags: ['shawarma', 'wrap', 'middle-eastern'],
        subcategory: 'Wrap'
      },
      {
        title: 'Chocolate Lava Cake',
        description: 'Warm chocolate lava cake with molten center',
        price: 199,
        currency: 'INR',
        images: ['Chocolate Lava Cake.jpg'],
        stock: 25,
        rating: 4.6,
        tags: ['dessert', 'chocolate', 'cake'],
        subcategory: 'Dessert'
      }
    ];

    for (const p of baseProducts) {
      const doc = {
        name: p.title,
        description: p.description,
        price: p.price,
        vendor: 'Food & Dining Vendor', // Default vendor
        category: 'Food & Dining',
        subcategory: p.subcategory,
        image: p.images[0], // Use first image
        stock: p.stock,
        updatedAt: new Date(),
      };
      const existing = await products.findOne({ name: p.title, category: 'Food & Dining' });
      if (existing) {
        await products.updateOne({ _id: existing._id }, { $set: doc });
      } else {
        doc.createdAt = new Date();
        await products.insertOne(doc);
      }
    }

    console.log('Food & Dine category and products seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
