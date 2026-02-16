const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const serviceNames = [
      "Home Cleaning", "Plumbing Repair", "Electrical Work", "Gardening Service",
      "Car Wash", "Pest Control", "AC Repair", "Painting Service", "Appliance Repair",
      "Tutoring", "Pet Grooming", "Event Planning", "Photography", "Massage Therapy",
      "House Painting"
    ];

    console.log('🔍 Checking for specific service products:');
    console.log('========================================');

    for (const name of serviceNames) {
      const product = await products.findOne({ name });
      console.log(`${name}: ${product ? 'EXISTS' : 'NOT FOUND'}`);
    }

    console.log('\n========================================');
    console.log('Checking all products with category containing "Service":');
    const allServices = await products.find({ category: { $regex: 'Service', $options: 'i' } }).toArray();
    console.log('Found', allServices.length, 'products');

    if (allServices.length > 0) {
      console.log('Sample product:', JSON.stringify(allServices[0], null, 2));
    }

    console.log('\n========================================');
    console.log('Checking all products with "Cleaning" in name:');
    const cleaningProducts = await products.find({ name: { $regex: 'Cleaning', $options: 'i' } }).toArray();
    console.log('Found', cleaningProducts.length, 'products');

    if (cleaningProducts.length > 0) {
      console.log('Sample cleaning product:', JSON.stringify(cleaningProducts[0], null, 2));
    }

    console.log('\n========================================');
    console.log('Total products in database:');
    const totalProducts = await products.countDocuments();
    console.log('Total:', totalProducts);

  } finally {
    await client.close();
  }
}

check().catch(console.error);