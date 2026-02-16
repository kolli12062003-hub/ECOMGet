const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const jewelleryProducts = [
      // Women's Jewellery
      { "name": "Gold Necklace", "price": 24999, "vendor": "Shine Jewelers", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Gold Necklace.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 5, "description": "Elegant 22K gold necklace with intricate design" },
      { "name": "Diamond Earrings", "price": 34999, "vendor": "Gem Palace", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Diamond Earrings.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 3, "description": "Stunning diamond stud earrings in 18K white gold" },
      { "name": "Silver Bracelet", "price": 3999, "vendor": "Sparkle Boutique", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Silver Bracelet.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "Beautiful sterling silver link bracelet" },
      { "name": "Pearl Ring", "price": 7999, "vendor": "Elegant Gems", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Pearl Ring.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 8, "description": "Classic pearl solitaire ring in sterling silver" },
      { "name": "Emerald Necklace", "price": 18999, "vendor": "Luxury Jewels", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Emerald Necklace.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 4, "description": "Exquisite emerald pendant necklace in 18K gold" },
      { "name": "Ruby Pendant", "price": 15999, "vendor": "Gem Galleria", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Ruby Pendant.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 6, "description": "Vibrant ruby pendant in 18K gold setting" },
      { "name": "Gold Anklet", "price": 12999, "vendor": "Ankle Gems", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Gold Anklet.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 7, "description": "Delicate 22K gold chain anklet" },
      { "name": "Sapphire Bracelet", "price": 16999, "vendor": "Blue Sparkle", "category": "Jewellery", "subcategory": "Women's Jewellery", "image": "Sapphire Bracelet.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 5, "description": "Tennis bracelet with blue sapphires" },

      // Men's Jewellery
      { "name": "Silver Chain", "price": 5999, "vendor": "Silver Shine", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Silver Chain.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 12, "description": "Classic sterling silver chain necklace" },
      { "name": "Gold Cufflinks", "price": 11999, "vendor": "Golden Glow", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Gold Cufflinks.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 8, "description": "Elegant 18K gold cufflinks for formal wear" },
      { "name": "Leather Bracelet", "price": 2999, "vendor": "Rugged Gems", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Leather Bracelet.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 15, "description": "Stylish leather cuff bracelet" },
      { "name": "Titanium Ring", "price": 4999, "vendor": "Steel Spark", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Titanium Ring.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 9, "description": "Durable titanium band ring" },
      { "name": "Onyx Pendant", "price": 7999, "vendor": "Dark Gems", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Onyx Pendant.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 6, "description": "Mysterious black onyx pendant in silver" },
      { "name": "Silver Cuff Bracelet", "price": 6999, "vendor": "Silver Shine", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Silver Cuff Bracelet.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 7, "description": "Modern silver cuff bracelet design" },
      { "name": "Men's Gold Ring", "price": 9999, "vendor": "Golden Glow", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Mens Gold Ring.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Classic men's gold band ring" },
      { "name": "Beaded Bracelet", "price": 3999, "vendor": "Rugged Gems", "category": "Jewellery", "subcategory": "Men's Jewellery", "image": "Beaded Bracelet.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 11, "description": "Stylish beaded bracelet for men" },

      // Kids' Jewellery
      { "name": "Kids Silver Bracelet", "price": 1999, "vendor": "Tiny Treasures", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Silver Bracelet.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 20, "description": "Safe and adorable silver bracelet for kids" },
      { "name": "Kids Beaded Necklace", "price": 1499, "vendor": "Little Gems", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Beaded Necklace.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 25, "description": "Colorful beaded necklace for children" },
      { "name": "Kids Charm Bracelet", "price": 2499, "vendor": "Tiny Treasures", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Charm Bracelet.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 18, "description": "Fun charm bracelet with cute designs" },
      { "name": "Kids Gold Earrings", "price": 3999, "vendor": "Little Sparkle", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Gold Earrings.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 15, "description": "Safe gold earrings for kids" },
      { "name": "Kids Heart Pendant", "price": 2999, "vendor": "Little Gems", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Heart Pendant.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 22, "description": "Sweet heart-shaped pendant for kids" },
      { "name": "Kids Star Ring", "price": 1999, "vendor": "Tiny Treasures", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Star Ring.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 30, "description": "Star-shaped ring for children" },
      { "name": "Kids Crystal Necklace", "price": 2499, "vendor": "Little Sparkle", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Crystal Necklace.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 16, "description": "Sparkly crystal necklace for kids" },
      { "name": "Kids Animal Charm", "price": 1799, "vendor": "Tiny Treasures", "category": "Jewellery", "subcategory": "Kids' Jewellery", "image": "Kids Animal Charm.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 28, "description": "Adorable animal-shaped charm for kids" }
    ];

    const insertedProducts = [];
    for (const productData of jewelleryProducts) {
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
    console.log('✅ JEWELLERY SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
