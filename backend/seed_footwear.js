const { MongoClient } = require('mongodb');

// const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecom_shopnest';
const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Create or update Footwear category
    const categoryData = {
      name: 'Footwear',
      description: 'Shoes and footwear for all ages and styles',
      image: 'footwear-hero.jpg',
      status: 'active'
    };

    const category = await categories.findOneAndUpdate(
      { name: 'Footwear' },
      { $set: categoryData },
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category ? category.name : 'Footwear');

    const footwearProducts = [
      { "name": "High Heels", "price": 2499, "vendor": "Elegant Steps", "category": "Footwear", "subcategory": "Women's Footwear", "image": "High Heels.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 12, "description": "Elegant high heels perfect for formal occasions, made with faux leather for comfort and style." },
      { "name": "Ballet Flats", "price": 1999, "vendor": "Graceful Steps", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Ballet Flats.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 15, "description": "Comfortable ballet flats in nude color, ideal for everyday wear." },
      { "name": "Wedge Sandals", "price": 2699, "vendor": "Fashion Feet", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Wedge Sandals.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "Stylish wedge sandals made with cork for a trendy look." },
      { "name": "Dress Sandals", "price": 2499, "vendor": "Chic Soles", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Dress Sandals.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 8, "description": "Elegant dress sandals in silver synthetic material." },
      { "name": "Ankle Boots", "price": 3499, "vendor": "Trendy Treads", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Ankle Boots.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 6, "description": "Fashionable ankle boots in faux suede for versatile styling." },
      { "name": "Canvas Sneakers", "price": 1799, "vendor": "Cool Kicks", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Canvas Sneakers.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 20, "description": "Casual canvas sneakers in white, machine washable for easy care." },
      { "name": "Flip Flops", "price": 799, "vendor": "Beach Walk", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Flip Flops.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 25, "description": "Comfortable rubber flip flops in blue for beach or casual wear." },
      { "name": "Stilettos", "price": 2999, "vendor": "Elegant Steps", "category": "Footwear", "subcategory": "Women's Footwear", "image": "Stilettos.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 9, "description": "Classic red patent leather stilettos for special occasions." },
      { "name": "Leather Sneakers", "price": 2999, "vendor": "Step Style", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Leather Sneakers.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 14, "description": "Premium white leather sneakers for men, wipe clean for maintenance." },
      { "name": "Running Shoes", "price": 3499, "vendor": "Speed Stride", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Running Shoes.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 11, "description": "High-performance mesh running shoes in black/red for active lifestyles." },
      { "name": "Casual Loafers", "price": 1999, "vendor": "Comfort Walk", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Casual Loafers.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 16, "description": "Navy suede loafers, use a suede brush for care." },
      { "name": "Formal Shoes", "price": 3999, "vendor": "Classy Steps", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Formal Shoes.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 7, "description": "Brown leather formal shoes, polish regularly for shine." },
      { "name": "Hiking Boots", "price": 4999, "vendor": "Trail Trek", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Hiking Boots.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 5, "description": "Durable waterproof leather hiking boots in brown." },
      { "name": "Chelsea Boots", "price": 3999, "vendor": "Urban Walk", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Chelsea Boots.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 8, "description": "Black leather Chelsea boots, polish regularly." },
      { "name": "Slip-On Sneakers", "price": 2299, "vendor": "Easy Stride", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Slip-On Sneakers.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 18, "description": "Grey canvas slip-on sneakers, machine washable." },
      { "name": "Sports Sandals", "price": 1499, "vendor": "Active Feet", "category": "Footwear", "subcategory": "Men's Footwear", "image": "Sports Sandals.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 13, "description": "Blue/black synthetic sports sandals for outdoor activities." },
      { "name": "Kids Sneakers", "price": 1299, "vendor": "Tiny Treads", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Sneakers.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 22, "description": "Blue canvas sneakers for kids, machine washable." },
      { "name": "Kids Sandals", "price": 799, "vendor": "Little Steps", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Sandals.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 28, "description": "Pink rubber sandals for kids, easy to clean." },
      { "name": "Kids Boots", "price": 1499, "vendor": "Tiny Treads", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Boots.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Brown faux leather boots for kids." },
      { "name": "Kids Slippers", "price": 599, "vendor": "Cozy Kids", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Slippers.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 30, "description": "Blue fleece slippers for kids, machine washable." },
      { "name": "Kids Running Shoes", "price": 1399, "vendor": "Speedy Steps", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Running Shoes.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 15, "description": "Green mesh running shoes for active kids." },
      { "name": "Kids Canvas Shoes", "price": 999, "vendor": "Tiny Treads", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Canvas Shoes.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 20, "description": "Red canvas shoes for kids, machine washable." },
      { "name": "Kids Flip Flops", "price": 499, "vendor": "Little Steps", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Flip Flops.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 25, "description": "Yellow rubber flip flops for kids." },
      { "name": "Kids Dress Shoes", "price": 1599, "vendor": "Tiny Steps", "category": "Footwear", "subcategory": "Kids' Footwear", "image": "Kids Dress Shoes.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 12, "description": "Black faux leather dress shoes for kids." }
    ];

    // Clear existing footwear products
    await products.deleteMany({ category: 'Footwear' });
    console.log('Cleared existing footwear products');

    const insertedProducts = [];
    const updatedProducts = [];
    for (const productData of footwearProducts) {
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
    console.log('✅ FOOTWEAR SEEDING COMPLETED');
    console.log('   Category:', category ? category.name : 'Footwear');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
