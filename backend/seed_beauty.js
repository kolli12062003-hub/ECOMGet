const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';


async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Create or update Beauty category
    const categoryData = {
      name: 'Beauty Products',
      description: 'Beauty and personal care products',
      image: 'beauty-hero.jpg',
      status: 'active'
    };

    const category = await categories.findOneAndUpdate(
      { name: 'Beauty Products' },
      { $set: categoryData },
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category ? category.name : 'Beauty Products');

    const beautyProducts = [
      { "name": "Moisturizing Cream", "price": 799, "vendor": "Glow Essence", "category": "Beauty Products", "image": "Moisturizing Cream.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 20, "description": "Hydrating, Non-comedogenic" },
      { "name": "Facial Cleanser", "price": 499, "vendor": "Pure Skin", "category": "Beauty Products", "image": "Facial Cleanser.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 20, "description": "Deep Cleansing, Oil Control" },
      { "name": "Lipstick Set", "price": 999, "vendor": "Vivid Lips", "category": "Beauty Products", "image": "Lipstick Set.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 20, "description": "Long-lasting, Matte Finish" },
      { "name": "Serum", "price": 1299, "vendor": "Radiant Glow", "category": "Beauty Products", "image": "Serum.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 20, "description": "Brightening, Anti-aging" },
      { "name": "Face Mask Pack", "price": 699, "vendor": "Skin Bliss", "category": "Beauty Products", "image": "Face Mask Pack.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 20, "description": "Soothing, Moisturizing" },
      { "name": "Eyeshadow Palette", "price": 1499, "vendor": "Color Craze", "category": "Beauty Products", "image": "Eyeshadow Palette.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 20, "description": "Highly Pigmented, Blendable" },
      { "name": "Hair Serum", "price": 899, "vendor": "Glossy Locks", "category": "Beauty Products", "image": "Hair Serum.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 20, "description": "Frizz Control, Shine Enhancing" },
      { "name": "Nail Polish Set", "price": 599, "vendor": "Nail Nook", "category": "Beauty Products", "image": "Nail Polish Set.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 20, "description": "Quick Dry, Chip Resistant" },
      { "name": "Sunscreen Lotion", "price": 799, "vendor": "Sun Safe", "category": "Beauty Products", "image": "Sunscreen Lotion.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 20, "description": "SPF 50, Broad Spectrum" },
      { "name": "Perfume", "price": 1999, "vendor": "Fragrance Hub", "category": "Beauty Products", "image": "Perfume.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 20, "description": "Long-lasting, Floral Scent" },
      { "name": "Foundation", "price": 1199, "vendor": "Flawless Face", "category": "Beauty Products", "image": "Foundation.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 20, "description": "Full Coverage, Lightweight" },
      { "name": "Eyeliner", "price": 499, "vendor": "Bold Eyes", "category": "Beauty Products", "image": "Eyeliner.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 20, "description": "Waterproof, Smudge-proof" },
      { "name": "Body Lotion", "price": 599, "vendor": "Silky Skin", "category": "Beauty Products", "image": "Body Lotion.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 20, "description": "Deeply Moisturizing, Non-greasy" },
      { "name": "Hair Mask", "price": 799, "vendor": "Lush Locks", "category": "Beauty Products", "image": "Hair Mask.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 20, "description": "Repairing, Nourishing" },
      { "name": "Mascara", "price": 699, "vendor": "Lash Luxe", "category": "Beauty Products", "image": "Mascara.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 20, "description": "Volumizing, Lengthening" }
    ];

    const insertedProducts = [];
    for (const productData of beautyProducts) {
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
    console.log('✅ BEAUTY SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
