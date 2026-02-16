const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const petfoodProducts = [
      { "name": "Dry Dog Food", "price": 799, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Dry Dog Food.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 50, "description": "High-quality dry dog food with balanced nutrition for adult dogs" },
      { "name": "Wet Cat Food", "price": 499, "vendor": "Feline Feast", "category": "Pet Food", "image": "Wet Cat Food.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 40, "description": "Tasty wet cat food in gravy, perfect for feline nutrition" },
      { "name": "Puppy Kibble", "price": 899, "vendor": "Puppy Palace", "category": "Pet Food", "image": "Puppy Kibble.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 35, "description": "Nutritious kibble specially formulated for growing puppies" },
      { "name": "Senior Dog Food", "price": 749, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Senior Dog Food.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 30, "description": "Specialized food for senior dogs with joint support ingredients" },
      { "name": "Grain-Free Cat Food", "price": 999, "vendor": "Feline Feast", "category": "Pet Food", "image": "Grain-Free Cat Food.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 25, "description": "Grain-free cat food for sensitive feline digestive systems" },
      { "name": "Dog Treats", "price": 399, "vendor": "Pet Treats Co.", "category": "Pet Food", "image": "Dog Treats.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 60, "description": "Delicious dog treats for training and rewards" },
      { "name": "Cat Treats", "price": 349, "vendor": "Feline Feast", "category": "Pet Food", "image": "Cat Treats.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 55, "description": "Tasty cat treats to pamper your feline friend" },
      { "name": "Puppy Wet Food", "price": 599, "vendor": "Puppy Palace", "category": "Pet Food", "image": "Puppy Wet Food.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 45, "description": "Soft wet food ideal for puppies transitioning to solid food" },
      { "name": "Senior Cat Food", "price": 799, "vendor": "Feline Feast", "category": "Pet Food", "image": "Senior Cat Food.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 28, "description": "Nutrient-rich food for senior cats with added vitamins" },
      { "name": "Dog Dental Chews", "price": 499, "vendor": "Pet Treats Co.", "category": "Pet Food", "image": "Dog Dental Chews.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 40, "description": "Dental chews that help clean teeth and freshen breath" },
      { "name": "Kitten Food", "price": 699, "vendor": "Feline Feast", "category": "Pet Food", "image": "Kitten Food.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 32, "description": "Specialized nutrition for growing kittens" },
      { "name": "Grain-Free Dog Food", "price": 999, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Grain-Free Dog Food.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 20, "description": "Grain-free dog food for dogs with grain sensitivities" },
      { "name": "Cat Dental Treats", "price": 399, "vendor": "Feline Feast", "category": "Pet Food", "image": "Cat Dental Treats.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 38, "description": "Dental treats that promote oral health in cats" },
      { "name": "Adult Dog Food", "price": 849, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Adult Dog Food.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 42, "description": "Balanced adult dog food for daily nutrition" },
      { "name": "Fish Food Flakes", "price": 299, "vendor": "Aquatic Pets", "category": "Pet Food", "image": "Fish Food Flakes.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 70, "description": "Nutritious flakes for tropical fish and aquarium pets" }
    ];

    const insertedProducts = [];
    for (const productData of petfoodProducts) {
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
    console.log('✅ PETFOOD SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
