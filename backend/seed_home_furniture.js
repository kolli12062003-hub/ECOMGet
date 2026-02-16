const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const homeFurnitureProducts = [
      { "name": "Modern Sofa", "price": 24999, "vendor": "Comfort Living", "category": "Home Furniture", "image": "Modern Sofa.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "3-seater sofa with fabric upholstery, comfortable seating for living room" },
      { "name": "Dining Table", "price": 15999, "vendor": "Home Essentials", "category": "Home Furniture", "image": "Dining Table.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 10, "description": "Wooden dining table for 6 people, sturdy and elegant design" },
      { "name": "King Size Bed", "price": 34999, "vendor": "Sleep Well", "category": "Home Furniture", "image": "King Size Bed.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "King size bed frame with storage, perfect for master bedroom" },
      { "name": "Office Chair", "price": 8999, "vendor": "WorkSpace Solutions", "category": "Home Furniture", "image": "Office Chair.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Ergonomic office chair with adjustable height and lumbar support" },
      { "name": "Bookshelf", "price": 12999, "vendor": "Home Essentials", "category": "Home Furniture", "image": "Bookshelf.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 10, "description": "5-tier wooden bookshelf for organizing books and decor" },
      { "name": "Coffee Table", "price": 7999, "vendor": "Comfort Living", "category": "Home Furniture", "image": "Coffee Table.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 10, "description": "Glass top coffee table with metal frame, modern design" },
      { "name": "Wardrobe", "price": 29999, "vendor": "Storage Masters", "category": "Home Furniture", "image": "Wardrobe.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 10, "description": "3-door wardrobe with ample storage space for clothes" },
      { "name": "Recliner Chair", "price": 18999, "vendor": "Comfort Living", "category": "Home Furniture", "image": "Recliner Chair.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 10, "description": "Single recliner chair with footrest, ideal for relaxation" },
      { "name": "Study Table", "price": 11999, "vendor": "WorkSpace Solutions", "category": "Home Furniture", "image": "Study Table.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Compact study table with drawers for home office" },
      { "name": "TV Stand", "price": 14999, "vendor": "Home Essentials", "category": "Home Furniture", "image": "TV Stand.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 10, "description": "Wooden TV stand with storage compartments" },
      { "name": "Dressing Table", "price": 16999, "vendor": "Beauty Home", "category": "Home Furniture", "image": "Dressing Table.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Mirror dressing table with stool and storage drawers" },
      { "name": "Bar Stool", "price": 4999, "vendor": "Comfort Living", "category": "Home Furniture", "image": "Bar Stool.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 10, "description": "Set of 2 bar stools with backrest, suitable for kitchen counter" },
      { "name": "Shoe Rack", "price": 6999, "vendor": "Storage Masters", "category": "Home Furniture", "image": "Shoe Rack.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 10, "description": "6-tier shoe rack for organized footwear storage" },
      { "name": "Rocking Chair", "price": 22999, "vendor": "Comfort Living", "category": "Home Furniture", "image": "Rocking Chair.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 10, "description": "Traditional rocking chair, perfect for nursery or living room" }
    ];

    const insertedProducts = [];
    for (const productData of homeFurnitureProducts) {
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
    console.log('✅ HOME FURNITURE SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
