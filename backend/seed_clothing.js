const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    // Existing clothes products from ClothesProductDetail.js, converted to required format
    const clothesProducts = [
      { "name": "Saree", "price": 2499, "vendor": "Elegant Threads", "category": "Clothes", "image": "Saree.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "A stylish silk saree in red color, perfect for traditional occasions." },
      { "name": "Kurti", "price": 1999, "vendor": "Graceful Attire", "category": "Clothes", "image": "Kurti.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 10, "description": "Comfortable cotton kurti in blue color, available in multiple sizes." },
      { "name": "Lehenga", "price": 2699, "vendor": "Fashion Boutique", "category": "Clothes", "image": "Lehenga.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "Elegant georgette lehenga in pink color, free size for perfect fit." },
      { "name": "Anarkali Suit", "price": 2499, "vendor": "Chic Styles", "category": "Clothes", "image": "Anarkali Suit.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Beautiful chiffon anarkali suit in green color, available in M, L, XL." },
      { "name": "Western Dress", "price": 3499, "vendor": "Trendy Threads", "category": "Clothes", "image": "Western Dress.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 10, "description": "Stylish polyester western dress in black color, perfect for modern occasions." },
      { "name": "Casual Top", "price": 1799, "vendor": "Cool Trends", "category": "Clothes", "image": "Casual Top.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 10, "description": "Comfortable cotton casual top in white color, available in all sizes." },
      { "name": "Leggings", "price": 799, "vendor": "Active Wear", "category": "Clothes", "image": "Leggings.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 10, "description": "Flexible lycra leggings in black color, perfect for active wear." },
      { "name": "Evening Gown", "price": 2999, "vendor": "Elegant Threads", "category": "Clothes", "image": "Evening Gown.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 10, "description": "Luxurious satin evening gown in navy blue color, for special events." },
      { "name": "Formal Shirt", "price": 2999, "vendor": "Dapper Threads", "category": "Clothes", "image": "Formal Shirt.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Professional cotton formal shirt in white color, available in M, L, XL." },
      { "name": "Blazer", "price": 3499, "vendor": "Sharp Attire", "category": "Clothes", "image": "Blazer.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 10, "description": "Stylish wool blend blazer in gray color, for formal occasions." },
      { "name": "Casual Shirt", "price": 1999, "vendor": "Comfort Threads", "category": "Clothes", "image": "Casual Shirt.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Comfortable linen casual shirt in beige color, perfect for everyday wear." },
      { "name": "Suit", "price": 3999, "vendor": "Classy Attire", "category": "Clothes", "image": "Suit.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 10, "description": "Elegant terry rayon suit in black color, for professional looks." },
      { "name": "Jacket", "price": 4999, "vendor": "Trendy Outerwear", "category": "Clothes", "image": "Jacket.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 10, "description": "Premium leather jacket in brown color, for stylish outerwear." },
      { "name": "Sweater", "price": 3999, "vendor": "Cozy Threads", "category": "Clothes", "image": "Sweater.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 10, "description": "Warm wool sweater in maroon color, perfect for winter." },
      { "name": "Jeans", "price": 2299, "vendor": "Denim Hub", "category": "Clothes", "image": "Men's Jeans.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Classic denim jeans in blue color, available in various sizes." },
      { "name": "T-Shirt", "price": 1499, "vendor": "Casual Trends", "category": "Clothes", "image": "Men's T-Shirt.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "Comfortable cotton t-shirt in black color, for casual wear." },
      { "name": "Kids T-Shirt", "price": 1299, "vendor": "Tiny Trends", "category": "Clothes", "image": "Kids T-Shirt.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 10, "description": "Fun cotton kids t-shirt in yellow color, for children." },
      { "name": "Kids Shorts", "price": 799, "vendor": "Little Threads", "category": "Clothes", "image": "Kids Shorts.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "Comfortable cotton kids shorts in blue color, for playtime." },
      { "name": "Kids Jacket", "price": 1499, "vendor": "Tiny Trends", "category": "Clothes", "image": "Kids Jacket.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Stylish denim kids jacket in blue color, for outdoor activities." },
      { "name": "Kids Pajamas", "price": 599, "vendor": "Cozy Kids", "category": "Clothes", "image": "Kids Pajamas.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 10, "description": "Soft cotton kids pajamas in printed design, for comfortable sleep." },
      { "name": "Kids Sports Wear", "price": 1399, "vendor": "Active Kids", "category": "Clothes", "image": "Kids Sports Wear.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 10, "description": "Durable polyester kids sports wear in red color, for active kids." },
      { "name": "Kids Jeans", "price": 999, "vendor": "Tiny Trends", "category": "Clothes", "image": "Kids Jeans.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 10, "description": "Comfortable denim kids jeans in blue color, for everyday wear." },
      { "name": "Kids Cap", "price": 499, "vendor": "Little Threads", "category": "Clothes", "image": "Kids Cap.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 10, "description": "Fun cotton kids cap in black color, free size." },
      { "name": "Kids Dress", "price": 1599, "vendor": "Tiny Trends", "category": "Clothes", "image": "Kids Dress.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Adorable cotton kids dress in pink color, for special occasions." }
    ];

    const insertedProducts = [];
    for (const productData of clothesProducts) {
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
    console.log('✅ CLOTHES SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
