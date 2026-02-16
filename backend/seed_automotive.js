const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const automotiveProducts = [
      { "name": "Car Wax", "price": 799, "vendor": "Auto Shine", "category": "Automotive", "image": "Car Wax.jpg", "lat": 17.4486, "lon": 78.3908, "description": "High-gloss carnauba wax for a brilliant, long-lasting shine and protection." },
      { "name": "Tire Cleaner", "price": 499, "vendor": "Wheel Works", "category": "Automotive", "image": "Tire Cleaner.jpg", "lat": 17.4512, "lon": 78.3855, "description": "Powerful foam cleaner that removes brake dust and road grime, leaving tires with a deep black finish." },
      { "name": "Car Air Freshener", "price": 299, "vendor": "Fresh Drive", "category": "Automotive", "image": "Car Air Freshener.jpg", "lat": 17.4421, "lon": 78.3882, "description": "Long-lasting new car scent to keep your vehicle's interior smelling fresh." },
      { "name": "Engine Oil", "price": 999, "vendor": "Motor Mate", "category": "Automotive", "image": "Engine Oil.jpg", "lat": 17.4550, "lon": 78.3920, "description": "Synthetic 5W-30 engine oil for improved performance and engine protection." },
      { "name": "Car Floor Mats", "price": 1499, "vendor": "Auto Comfort", "category": "Automotive", "image": "Car Floor Mats.jpg", "lat": 17.4399, "lon": 78.4421, "description": "All-weather heavy-duty rubber floor mats to protect your car's interior." },
      { "name": "Car Battery", "price": 3999, "vendor": "Power Plus", "category": "Automotive", "image": "Car Battery.jpg", "lat": 17.4455, "lon": 78.3800, "description": "Reliable 12V car battery with a 3-year warranty for consistent starting power." },
      { "name": "Brake Pads", "price": 1999, "vendor": "Stop Safe", "category": "Automotive", "image": "Brake Pads.jpg", "lat": 17.4480, "lon": 78.3890, "description": "Set of ceramic front brake pads for quiet and reliable stopping power." },
      { "name": "Car Wash Shampoo", "price": 399, "vendor": "Clean Ride", "category": "Automotive", "image": "Car Wash Shampoo.jpg", "lat": 17.4520, "lon": 78.3870, "description": "pH-neutral car wash shampoo that safely lifts dirt without stripping wax." },
      { "name": "Oil Filter", "price": 599, "vendor": "Engine Care", "category": "Automotive", "image": "Oil Filter.jpg", "lat": 17.4400, "lon": 78.3850, "description": "High-efficiency oil filter designed to protect your engine from contaminants." },
      { "name": "Car Seat Covers", "price": 2499, "vendor": "Interior Style", "category": "Automotive", "image": "Car Seat Covers.jpg", "lat": 17.4490, "lon": 78.3950, "description": "Premium leatherette car seat covers for a stylish and protective upgrade." },
      { "name": "Air Filter", "price": 499, "vendor": "Pure Air", "category": "Automotive", "image": "Air Filter.jpg", "lat": 17.4550, "lon": 78.3920, "description": "Engine air filter that improves airflow and prevents harmful particles from entering the engine." },
      { "name": "Car Polisher", "price": 1299, "vendor": "Shine Pro", "category": "Automotive", "image": "Car Polisher.jpg", "lat": 17.4430, "lon": 78.3860, "description": "Orbital car polisher for applying wax and sealant for a swirl-free finish." },
      { "name": "Windshield Cleaner", "price": 399, "vendor": "Clear View", "category": "Automotive", "image": "Windshield Cleaner.jpg", "lat": 17.4500, "lon": 78.3840, "description": "Streak-free glass cleaner for crystal clear visibility." },
      { "name": "Car Vacuum Cleaner", "price": 1999, "vendor": "Clean Cabin", "category": "Automotive", "image": "Car Vacuum Cleaner.jpg", "lat": 17.4470, "lon": 78.3910, "description": "Portable 12V car vacuum cleaner with multiple attachments for a thorough clean." },
      { "name": "Car Cover", "price": 999, "vendor": "Protect Plus", "category": "Automotive", "image": "Car Cover.jpg", "lat": 17.4400, "lon": 78.3850, "description": "Water-resistant and UV-protective car cover for all-season protection." }
    ];

    const insertedProducts = [];
    for (const productData of automotiveProducts) {
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
    console.log('✅ AUTOMOTIVE SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
