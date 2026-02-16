const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const sportsFitnessProducts = [
      { "name": "Treadmill", "price": 24999, "vendor": "FitGear", "category": "Sports & Fitness", "image": "Treadmill.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 5, "description": "High-quality treadmill for home workouts, with multiple speed settings and incline options." },
      { "name": "Yoga Mat", "price": 999, "vendor": "Zen Fitness", "category": "Sports & Fitness", "image": "Yoga Mat.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 20, "description": "Non-slip yoga mat made from eco-friendly TPE material, perfect for all yoga practices." },
      { "name": "Dumbbell Set", "price": 2999, "vendor": "PowerLift", "category": "Sports & Fitness", "image": "Dumbbell Set.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 15, "description": "Complete dumbbell set with adjustable weights for strength training at home." },
      { "name": "Resistance Bands", "price": 799, "vendor": "FitGear", "category": "Sports & Fitness", "image": "Resistance Bands.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 25, "description": "Set of resistance bands for full-body workouts, suitable for all fitness levels." },
      { "name": "Stationary Bike", "price": 14999, "vendor": "CycleWorks", "category": "Sports & Fitness", "image": "Stationary Bike.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 8, "description": "Indoor stationary bike with adjustable resistance and digital display for cardio training." },
      { "name": "Kettlebell", "price": 1999, "vendor": "PowerLift", "category": "Sports & Fitness", "image": "Kettlebell.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 12, "description": "Cast iron kettlebell for functional strength training and conditioning exercises." },
      { "name": "Fitness Tracker", "price": 3999, "vendor": "TechFit", "category": "Sports & Fitness", "image": "Fitness Tracker.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 18, "description": "Advanced fitness tracker with heart rate monitoring and activity tracking features." },
      { "name": "Jump Rope", "price": 499, "vendor": "Zen Fitness", "category": "Sports & Fitness", "image": "Jump Rope.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 30, "description": "Adjustable jump rope for cardio workouts, lightweight and durable." },
      { "name": "Exercise Ball", "price": 1299, "vendor": "FitGear", "category": "Sports & Fitness", "image": "Exercise Ball.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 14, "description": "Stability exercise ball for core strengthening and balance training." },
      { "name": "Weight Bench", "price": 7999, "vendor": "PowerLift", "category": "Sports & Fitness", "image": "Weight Bench.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 6, "description": "Adjustable weight bench for strength training and weightlifting exercises." },
      { "name": "Running Shoes", "price": 3499, "vendor": "SportZone", "category": "Sports & Fitness", "image": "Running Shoes.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 22, "description": "Comfortable running shoes with cushioning and support for all terrains." },
      { "name": "Sports Water Bottle", "price": 599, "vendor": "Zen Fitness", "category": "Sports & Fitness", "image": "Sports Water Bottle.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 28, "description": "Insulated sports water bottle to keep drinks cold during workouts." },
      { "name": "Gym Gloves", "price": 799, "vendor": "FitGear", "category": "Sports & Fitness", "image": "Gym Gloves.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 16, "description": "Protective gym gloves for weightlifting and strength training." },
      { "name": "Elliptical Trainer", "price": 19999, "vendor": "CycleWorks", "category": "Sports & Fitness", "image": "Elliptical Trainer.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 4, "description": "Low-impact elliptical trainer for full-body cardio workouts." },
      { "name": "Tennis Racket", "price": 2499, "vendor": "SportZone", "category": "Sports & Fitness", "image": "Tennis Racket.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Professional tennis racket with graphite construction for optimal performance." }
    ];

    const insertedProducts = [];
    for (const productData of sportsFitnessProducts) {
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
    console.log('✅ SPORTS & FITNESS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
