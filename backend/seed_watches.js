const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Create or update Watches category
    const categoryData = {
      name: 'Watches',
      description: 'Watches and timepieces for all ages and styles',
      image: 'watches-hero.jpg',
      status: 'active'
    };

    const category = await categories.findOneAndUpdate(
      { name: 'Watches' },
      { $set: categoryData },
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category ? category.name : 'Watches');

    const watchesProducts = [
      { "name": "Mens Minimalist Watch", "price": 4999, "vendor": "TimeTrend", "image": "Mens Minimalist Watch.jpg", "type": "Analog", "strapMaterial": "Leather", "caseMaterial": "Stainless Steel", "waterResistance": "3 ATM", "otherImages": ["Mens Minimalist Watch1.jpg", "Mens Minimalist Watch2.jpg", "Mens Minimalist Watch3.jpg"], "lat": 17.4486, "lon": 78.3908, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Hybrid Smartwatch", "price": 7999, "vendor": "TechTime", "image": "Hybrid Smartwatch.jpg", "type": "Hybrid", "strapMaterial": "Silicone", "caseMaterial": "Aluminum", "waterResistance": "5 ATM", "otherImages": ["Hybrid Smartwatch1.jpg", "Hybrid Smartwatch2.jpg", "Hybrid Smartwatch3.jpg"], "lat": 17.4512, "lon": 78.3855, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Sports Watch", "price": 3499, "vendor": "ActiveWear", "image": "Sports Watch.jpg", "type": "Digital", "strapMaterial": "Rubber", "caseMaterial": "Resin", "waterResistance": "10 ATM", "otherImages": ["Sports Watch1.jpg", "Sports Watch2.jpg", "Sports Watch3.jpg"], "lat": 17.4421, "lon": 78.3882, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Gold Watch", "price": 12999, "vendor": "EliteTime", "image": "Gold Watch.jpg", "type": "Analog", "strapMaterial": "Stainless Steel", "caseMaterial": "Gold Plated", "waterResistance": "5 ATM", "otherImages": ["Gold Watch1.jpg", "Gold Watch2.jpg", "Gold Watch3.jpg"], "lat": 17.4550, "lon": 78.3920, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Fitness Tracker Watch", "price": 5999, "vendor": "FitZone", "image": "Fitness Tracker Watch.jpg", "type": "Smartwatch", "strapMaterial": "Silicone", "caseMaterial": "Plastic", "waterResistance": "5 ATM", "otherImages": ["Fitness Tracker Watch1.jpg", "Fitness Tracker Watch2.jpg", "Fitness Tracker Watch3.jpg"], "lat": 17.4399, "lon": 78.4421, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Pilot Chronograph", "price": 6499, "vendor": "AeroTime", "image": "Pilot Chronograph.jpg", "type": "Analog", "strapMaterial": "Leather", "caseMaterial": "Stainless Steel", "waterResistance": "10 ATM", "otherImages": ["Pilot Chronograph1.jpg", "Pilot Chronograph2.jpg", "Pilot Chronograph3.jpg"], "lat": 17.4455, "lon": 78.3800, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Dive Watch", "price": 8499, "vendor": "OceanTime", "image": "Dive Watch.jpg", "type": "Analog", "strapMaterial": "Rubber", "caseMaterial": "Stainless Steel", "waterResistance": "20 ATM", "otherImages": ["Dive Watch1.jpg", "Dive Watch2.jpg", "Dive Watch3.jpg"], "lat": 17.4480, "lon": 78.3890, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Hybrid Smartwatch", "price": 9999, "vendor": "TechTrend", "image": "Hybrid Smartwatch.jpg", "type": "Hybrid", "strapMaterial": "Silicone", "caseMaterial": "Titanium", "waterResistance": "5 ATM", "otherImages": ["Hybrid Smartwatch1.jpg", "Hybrid Smartwatch2.jpg", "Hybrid Smartwatch3.jpg"], "lat": 17.4520, "lon": 78.3870, "category": "Watches", "subcategory": "Men's Watches" },
      { "name": "Rose Watch", "price": 6999, "vendor": "ChicTime", "image": "Rose Watch.jpg", "type": "Analog", "strapMaterial": "Rose Gold Steel", "caseMaterial": "Rose Gold Steel", "waterResistance": "3 ATM", "otherImages": ["Rose Watch1.jpg", "Rose Watch2.jpg", "Rose Watch3.jpg"], "lat": 17.4400, "lon": 78.3850, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Crystal Smartwatch", "price": 8999, "vendor": "TechStyle", "image": "Crystal Smartwatch.jpg", "type": "Smartwatch", "strapMaterial": "Silicone", "caseMaterial": "Aluminum", "waterResistance": "5 ATM", "otherImages": ["Crystal Smartwatch1.jpg", "Crystal Smartwatch2.jpg", "Crystal Smartwatch3.jpg"], "lat": 17.4490, "lon": 78.3950, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Minimalist Silver Watch", "price": 4499, "vendor": "SimpleTime", "image": "Minimalist Silver Watch.jpg", "type": "Analog", "strapMaterial": "Stainless Steel", "caseMaterial": "Stainless Steel", "waterResistance": "3 ATM", "otherImages": ["Minimalist Silver Watch1.jpg", "Minimalist Silver Watch2.jpg", "Minimalist Silver Watch3.jpg"], "lat": 17.4550, "lon": 78.3920, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Diamond Accent Watch", "price": 14999, "vendor": "LuxeTime", "image": "Diamond Accent Watch.jpg", "type": "Analog", "strapMaterial": "Stainless Steel", "caseMaterial": "Stainless Steel", "waterResistance": "5 ATM", "otherImages": ["Diamond Accent Watch1.jpg", "Diamond Accent Watch2.jpg", "Diamond Accent Watch3.jpg"], "lat": 17.4430, "lon": 78.3860, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Fitness Band", "price": 3999, "vendor": "FitChic", "image": "Fitness Band.jpg", "type": "Smartwatch", "strapMaterial": "Silicone", "caseMaterial": "Plastic", "waterResistance": "5 ATM", "otherImages": ["Fitness Band1.jpg", "Fitness Band2.jpg", "Fitness Band3.jpg"], "lat": 17.4500, "lon": 78.3840, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Pearl Elegance Watch", "price": 7999, "vendor": "GraceTime", "image": "Pearl Elegance Watch.jpg", "type": "Analog", "strapMaterial": "Pearl", "caseMaterial": "Stainless Steel", "waterResistance": "3 ATM", "otherImages": ["Pearl Elegance Watch1.jpg", "Pearl Elegance Watch2.jpg", "Pearl Elegance Watch3.jpg"], "lat": 17.4470, "lon": 78.3910, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Rose Quartz Smartwatch", "price": 10999, "vendor": "TechChic", "image": "Rose Quartz Smartwatch.jpg", "type": "Smartwatch", "strapMaterial": "Silicone", "caseMaterial": "Aluminum", "waterResistance": "5 ATM", "otherImages": ["Rose Quartz Smartwatch1.jpg", "Rose Quartz Smartwatch2.jpg", "Rose Quartz Smartwatch3.jpg"], "lat": 17.4400, "lon": 78.3850, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Floral Accent Watch", "price": 5499, "vendor": "BloomTime", "image": "Floral Accent Watch.jpg", "type": "Analog", "strapMaterial": "Leather", "caseMaterial": "Stainless Steel", "waterResistance": "3 ATM", "otherImages": ["Floral Accent Watch1.jpg", "Floral Accent Watch2.jpg", "Floral Accent Watch3.jpg"], "lat": 17.4486, "lon": 78.3908, "category": "Watches", "subcategory": "Women's Watches" },
      { "name": "Cartoon Watch", "price": 1499, "vendor": "KidsTime", "image": "Cartoon Watch.jpg", "type": "Digital", "strapMaterial": "Rubber", "caseMaterial": "Plastic", "waterResistance": "1 ATM", "otherImages": ["Cartoon Watch1.jpg", "Cartoon Watch2.jpg", "Cartoon Watch3.jpg"], "lat": 17.4512, "lon": 78.3855, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Smart Watch", "price": 2999, "vendor": "TechKids", "image": "Smart Watch.jpg", "type": "Smartwatch", "strapMaterial": "Silicone", "caseMaterial": "Plastic", "waterResistance": "3 ATM", "otherImages": ["Smart Watch1.jpg", "Smart Watch2.jpg", "Smart Watch3.jpg"], "lat": 17.4421, "lon": 78.3882, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Colorful Digital Watch", "price": 999, "vendor": "FunTime", "image": "Colorful Digital Watch.jpg", "type": "Digital", "strapMaterial": "Silicone", "caseMaterial": "Plastic", "waterResistance": "1 ATM", "otherImages": ["Colorful Digital Watch1.jpg", "Colorful Digital Watch2.jpg", "Colorful Digital Watch3.jpg"], "lat": 17.4550, "lon": 78.3920, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Superhero Watch", "price": 1999, "vendor": "HeroTime", "image": "Superhero Watch.jpg", "type": "Analog", "strapMaterial": "Nylon", "caseMaterial": "Plastic", "waterResistance": "3 ATM", "otherImages": ["Superhero Watch1.jpg", "Superhero Watch2.jpg", "Superhero Watch3.jpg"], "lat": 17.4399, "lon": 78.4421, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Learning Watch", "price": 2499, "vendor": "EduTime", "image": "Learning Watch.jpg", "type": "Digital", "strapMaterial": "Silicone", "caseMaterial": "Plastic", "waterResistance": "1 ATM", "otherImages": ["Learning Watch1.jpg", "Learning Watch2.jpg", "Learning Watch3.jpg"], "lat": 17.4455, "lon": 78.3800, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Animal Print Watch", "price": 1799, "vendor": "WildTime", "image": "Animal Print Watch.jpg", "type": "Analog", "strapMaterial": "Faux Leather", "caseMaterial": "Stainless Steel", "waterResistance": "3 ATM", "otherImages": ["Animal Print Watch1.jpg", "Animal Print Watch2.jpg", "Animal Print Watch3.jpg"], "lat": 17.4480, "lon": 78.3890, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Glow Digital Watch", "price": 1299, "vendor": "BrightTime", "image": "Glow Digital Watch.jpg", "type": "Digital", "strapMaterial": "Silicone", "caseMaterial": "Plastic", "waterResistance": "1 ATM", "otherImages": ["Glow Digital Watch1.jpg", "Glow Digital Watch2.jpg", "Glow Digital Watch3.jpg"], "lat": 17.4520, "lon": 78.3870, "category": "Watches", "subcategory": "Kids' Watches" },
      { "name": "Adventure Smartwatch", "price": 3499, "vendor": "ExploreTime", "image": "Adventure Smartwatch.jpg", "type": "Smartwatch", "strapMaterial": "Nylon", "caseMaterial": "Resin", "waterResistance": "10 ATM", "otherImages": ["Adventure Smartwatch1.jpg", "Adventure Smartwatch2.jpg", "Adventure Smartwatch3.jpg"], "lat": 17.4400, "lon": 78.3850, "category": "Watches", "subcategory": "Kids' Watches" }
    ];

    // Clear existing watches products
    await products.deleteMany({ category: 'Watches' });
    console.log('Cleared existing watches products');

    const insertedProducts = [];
    const updatedProducts = [];
    for (const productData of watchesProducts) {
      const existingProduct = await products.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = { ...productData, status: 'active' };
        await products.insertOne(product);
        insertedProducts.push(product);
        console.log('✅ Product inserted:', product.name);
      } else {
        // Update existing product with correct category and subcategory
        await products.updateOne(
          { name: productData.name },
          { $set: { category: productData.category, subcategory: productData.subcategory, status: 'active' } }
        );
        updatedProducts.push(productData.name);
        console.log('🔄 Product updated:', productData.name);
      }
    }

    console.log('\n========================================');
    console.log('✅ WATCHES SEEDING COMPLETED');
    console.log('   Category:', category ? category.name : 'Watches');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
