const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const musicalProducts = [
      { "name": "Acoustic Guitar", "price": 799, "vendor": "Music Haven", "category": "Musical Instruments", "image": "Acoustic Guitar.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "String instrument, Wood material, Natural color" },
      { "name": "Electric Guitar", "price": 499, "vendor": "Rock Shop", "category": "Musical Instruments", "image": "Electric Guitar.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 10, "description": "String instrument, Wood and Metal material, Sunburst color" },
      { "name": "Digital Piano", "price": 899, "vendor": "Melody Mart", "category": "Musical Instruments", "image": "Digital Piano.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 10, "description": "Keyboard instrument, Plastic and Metal material, Black color" },
      { "name": "Drum Kit", "price": 749, "vendor": "Music Haven", "category": "Musical Instruments", "image": "Drum Kit.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Percussion instrument, Wood and Metal material, Red color" },
      { "name": "Violin", "price": 999, "vendor": "Classical Sounds", "category": "Musical Instruments", "image": "Violin.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 10, "description": "String instrument, Wood material, Brown color" },
      { "name": "Guitar Strings", "price": 399, "vendor": "Tune Up Co.", "category": "Musical Instruments", "image": "Guitar Strings.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 10, "description": "Accessory, Steel material, Silver color" },
      { "name": "Drumsticks", "price": 349, "vendor": "Rhythm Gear", "category": "Musical Instruments", "image": "Drumsticks.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 10, "description": "Accessory, Wood material, Natural color" },
      { "name": "Ukulele", "price": 599, "vendor": "Music Haven", "category": "Musical Instruments", "image": "Ukulele.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 10, "description": "String instrument, Wood material, Natural color" },
      { "name": "Saxophone", "price": 799, "vendor": "Classical Sounds", "category": "Musical Instruments", "image": "Saxophone.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Wind instrument, Brass material, Gold color" },
      { "name": "Harmonica", "price": 499, "vendor": "Tune Up Co.", "category": "Musical Instruments", "image": "Harmonica.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 10, "description": "Wind instrument, Metal and Plastic material, Silver color" },
      { "name": "Flute", "price": 699, "vendor": "Classical Sounds", "category": "Musical Instruments", "image": "Flute.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 10, "description": "Wind instrument, Silver-plated material, Silver color" },
      { "name": "Electric Keyboard", "price": 999, "vendor": "Melody Mart", "category": "Musical Instruments", "image": "Electric Keyboard.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 10, "description": "Keyboard instrument, Plastic material, Black color" },
      { "name": "Guitar Picks", "price": 399, "vendor": "Tune Up Co.", "category": "Musical Instruments", "image": "Guitar Picks.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 10, "description": "Accessory, Plastic material, Assorted color" },
      { "name": "Trumpet", "price": 849, "vendor": "Classical Sounds", "category": "Musical Instruments", "image": "Trumpet.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 10, "description": "Wind instrument, Brass material, Gold color" }
    ];

    const insertedProducts = [];
    for (const productData of musicalProducts) {
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
    console.log('✅ MUSICAL INSTRUMENTS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
