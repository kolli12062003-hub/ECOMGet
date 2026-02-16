const { MongoClient } = require('mongodb');

// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';
const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const bagsProducts = [
      { "name": "Leather Handbag", "price": 2999, "vendor": "Style Trends", "category": "Bags", "image": "Leather Handbag.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "Genuine Leather, Brown, 15L capacity, Multiple compartments, adjustable strap" },
      { "name": "Backpack", "price": 1999, "vendor": "Travel Gear", "category": "Bags", "image": "Backpack.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 10, "description": "Nylon, Black, 30L capacity, Laptop sleeve, water-resistant" },
      { "name": "Travel Duffel Bag", "price": 3499, "vendor": "Adventure Outfitters", "category": "Bags", "image": "Travel Duffel Bag.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "Canvas, Olive Green, 50L capacity, Spacious main compartment, shoe pocket" },
      { "name": "Tote Bag", "price": 1499, "vendor": "Style Trends", "category": "Bags", "image": "Tote Bag.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Canvas, Beige, 20L capacity, Lightweight, foldable" },
      { "name": "Laptop Bag", "price": 2499, "vendor": "Tech Carry", "category": "Bags", "image": "Laptop Bag.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 10, "description": "Polyester, Grey, 18L capacity, Padded laptop compartment, USB charging port" },
      { "name": "Clutch Purse", "price": 999, "vendor": "Fashion Hub", "category": "Bags", "image": "Clutch Purse.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 10, "description": "Faux Leather, Red, 2L capacity, Detachable chain strap, elegant design" },
      { "name": "Gym Bag", "price": 1799, "vendor": "Adventure Outfitters", "category": "Bags", "image": "Gym Bag.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 10, "description": "Polyester, Blue, 25L capacity, Separate wet/dry compartments" },
      { "name": "Crossbody Bag", "price": 1299, "vendor": "Style Trends", "category": "Bags", "image": "Crossbody Bag.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 10, "description": "PU Leather, Tan, 5L capacity, Compact, multiple pockets" },
      { "name": "Travel Backpack", "price": 3999, "vendor": "Travel Gear", "category": "Bags", "image": "Travel Backpack.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Durable Polyester, Dark Blue, 45L capacity, Expandable, anti-theft design" },
      { "name": "Designer Handbag", "price": 4999, "vendor": "Fashion Hub", "category": "Bags", "image": "Designer Handbag.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 10, "description": "Premium Leather, Black, 12L capacity, Luxury hardware, designer logo" },
      { "name": "Sling Bag", "price": 1599, "vendor": "Style Trends", "category": "Bags", "image": "Sling Bag.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Canvas, Grey, 8L capacity, Adjustable strap, front zip pocket" },
      { "name": "Luggage Set", "price": 7999, "vendor": "Adventure Outfitters", "category": "Bags", "image": "Luggage Set.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 10, "description": "ABS Hard-shell, Silver, 3-piece set, Spinner wheels, TSA lock" },
      { "name": "Wallet", "price": 799, "vendor": "Fashion Hub", "category": "Bags", "image": "Wallet.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 10, "description": "Leather, Black, RFID blocking, multiple card slots" },
      { "name": "Messenger Bag", "price": 2199, "vendor": "Tech Carry", "category": "Bags", "image": "Messenger Bag.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 10, "description": "Canvas, Khaki, 15L capacity, Fits 15-inch laptop, vintage look" },
      { "name": "Trolley Bag", "price": 5999, "vendor": "Travel Gear", "category": "Bags", "image": "Trolley Bag.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Polycarbonate, Blue, 60L capacity, Lightweight, 360-degree wheels" }
    ];

    const insertedProducts = [];
    for (const productData of bagsProducts) {
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
    console.log('✅ BAGS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
