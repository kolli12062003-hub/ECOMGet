const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const kitchenProducts = [
      { "name": "Non-Stick Cookware Set", "price": 3999, "vendor": "Kitchen Essentials", "category": "Kitchen Products", "image": "nonstick.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "5-piece non-stick cookware set, induction compatible, PFOA-free" },
      { "name": "Stainless Steel Knife Set", "price": 1499, "vendor": "Cookware Hub", "category": "Kitchen Products", "image": "Stainless Steel Knife Set.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 15, "description": "6-piece stainless steel knife set with ergonomic handles and sharpener" },
      { "name": "Air Fryer", "price": 7999, "vendor": "Tech Kitchen", "category": "Kitchen Products", "image": "Air Fryer.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 8, "description": "4.1L air fryer with rapid air technology and digital display" },
      { "name": "Blender", "price": 3499, "vendor": "Cookware Hub", "category": "Kitchen Products", "image": "Blender.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 12, "description": "1.5L blender with multiple speed settings and powerful motor" },
      { "name": "Microwave Oven", "price": 9999, "vendor": "Tech Kitchen", "category": "Kitchen Products", "image": "Microwave Oven.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 5, "description": "28L microwave oven with convection, grill, and microwave modes" },
      { "name": "Mixing Bowl Set", "price": 1299, "vendor": "Cookware Hub", "category": "Kitchen Products", "image": "Mixing Bowl Set.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 20, "description": "3-piece stainless steel mixing bowl set with nesting design" },
      { "name": "Electric Kettle", "price": 1999, "vendor": "Home Appliances", "category": "Kitchen Products", "image": "Electric Kettle.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 18, "description": "1.7L electric kettle with auto shut-off and boil-dry protection" },
      { "name": "Cutlery Set", "price": 999, "vendor": "Home Depot", "category": "Kitchen Products", "image": "Cutlery Set.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 25, "description": "24-piece stainless steel cutlery set, elegant and rust-resistant" },
      { "name": "Food Processor", "price": 5999, "vendor": "Tech Kitchen", "category": "Kitchen Products", "image": "Food Processor.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 7, "description": "2.1L food processor with multiple attachments for chopping and slicing" },
      { "name": "Toaster", "price": 2499, "vendor": "Home Appliances", "category": "Kitchen Products", "image": "Toaster.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 14, "description": "2-slice toaster with variable browning control and crumb tray" },
      { "name": "Glassware Set", "price": 1799, "vendor": "Home Depot", "category": "Kitchen Products", "image": "Glassware Set.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 16, "description": "12-piece glassware set, dishwasher safe and lead-free" },
      { "name": "Pressure Cooker", "price": 2999, "vendor": "Tech Kitchen", "category": "Kitchen Products", "image": "Pressure Cooker.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 9, "description": "5L pressure cooker with induction base and safety valve" },
      { "name": "Silicone Baking Mat", "price": 799, "vendor": "Kitchen Essentials", "category": "Kitchen Products", "image": "Silicone Baking Mat.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 22, "description": "16.5x11.6 inch silicone baking mat, non-stick and reusable" },
      { "name": "Coffee Maker", "price": 4999, "vendor": "Tech Kitchen", "category": "Kitchen Products", "image": "Coffee Maker.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 11, "description": "12-cup coffee maker with programmable settings and keep warm function" },
      { "name": "Ceramic Dinner Set", "price": 3999, "vendor": "Home Depot", "category": "Kitchen Products", "image": "Ceramic Dinner Set.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 13, "description": "12-piece ceramic dinner set, microwave and dishwasher safe" }
    ];

    const insertedProducts = [];
    for (const productData of kitchenProducts) {
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
    console.log('✅ KITCHEN PRODUCTS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
