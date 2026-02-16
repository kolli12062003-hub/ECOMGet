const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully');
    const db = client.db('ecom_shopnest');
    console.log('📊 Using database:', db.databaseName);
    const products = db.collection('products');

    const servicesProducts = [
      { "name": "Home Cleaning", "price": 499, "vendor": "CleanHome Services", "category": "Services", "image": "Home Cleaning.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "Professional home cleaning service including dusting, vacuuming, and sanitizing" },
      { "name": "Plumbing Repair", "price": 799, "vendor": "FixIt Plumbing", "category": "Services", "image": "Plumbing Repair.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 5, "description": "Expert plumbing repair services for leaks, blockages, and installations" },
      { "name": "Electrical Work", "price": 999, "vendor": "Spark Electric", "category": "Services", "image": "Electrical Work.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 3, "description": "Licensed electrician services for wiring, repairs, and installations" },
      { "name": "Gardening Service", "price": 349, "vendor": "GreenThumb Gardens", "category": "Services", "image": "Gardening Service.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 8, "description": "Complete gardening services including lawn care, planting, and maintenance" },
      { "name": "Car Wash", "price": 299, "vendor": "ShinyCars", "category": "Services", "image": "Car Wash.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 15, "description": "Professional car washing and detailing services" },
      { "name": "Pest Control", "price": 649, "vendor": "BugBusters", "category": "Services", "image": "Pest Control.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 6, "description": "Effective pest control services for homes and businesses" },
      { "name": "AC Repair", "price": 1199, "vendor": "CoolAir Systems", "category": "Services", "image": "AC Repair.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 4, "description": "Air conditioning repair and maintenance services" },
      { "name": "Painting Service", "price": 899, "vendor": "ColorMasters", "category": "Services", "image": "Painting Service.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 7, "description": "Professional painting services for interior and exterior" },
      { "name": "Appliance Repair", "price": 599, "vendor": "FixAll Appliances", "category": "Services", "image": "Appliance Repair.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 9, "description": "Repair services for household appliances" },
      { "name": "Tutoring", "price": 399, "vendor": "LearnWell Academy", "category": "Services", "image": "Tutoring.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 12, "description": "Personalized tutoring services for all subjects and grades" },
      { "name": "Pet Grooming", "price": 449, "vendor": "Pawfect Grooming", "category": "Services", "image": "Pet Grooming.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 11, "description": "Professional pet grooming and care services" },
      { "name": "Event Planning", "price": 1499, "vendor": "Celebrate Events", "category": "Services", "image": "Event Planning.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 2, "description": "Complete event planning and coordination services" },
      { "name": "Photography", "price": 799, "vendor": "Capture Moments", "category": "Services", "image": "Photography.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 8, "description": "Professional photography services for events and portraits" },
      { "name": "Massage Therapy", "price": 699, "vendor": "Relax Spa", "category": "Services", "image": "Massage Therapy.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 6, "description": "Therapeutic massage services for relaxation and wellness" },
      { "name": "House Painting", "price": 1299, "vendor": "PaintPro", "category": "Services", "image": "House Painting.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 5, "description": "Exterior and interior house painting services" }
    ];

    const insertedProducts = [];
    for (const productData of servicesProducts) {
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
    console.log('✅ SERVICES SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
