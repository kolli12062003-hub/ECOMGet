const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const homeDecorProducts = [
      { "name": "Wall Art Canvas", "price": 2999, "vendor": "Decor Trends", "category": "Home Decor", "image": "Wall Art Canvas.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 10, "description": "Beautiful wall art canvas, 24x36 inches, multicolor design for home decoration" },
      { "name": "LED Table Lamp", "price": 1499, "vendor": "LightHouse", "category": "Home Decor", "image": "LED Table Lamp.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 15, "description": "Modern LED table lamp, 15 inches height, black color with adjustable brightness" },
      { "name": "Decorative Cushions", "price": 999, "vendor": "HomeStyle", "category": "Home Decor", "image": "Decorative Cushions.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 20, "description": "Set of decorative cushions, 16x16 inches, cotton material in assorted colors" },
      { "name": "Cordless Drill", "price": 3999, "vendor": "ToolTech", "category": "Home Decor", "image": "Cordless Drill.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 8, "description": "Powerful cordless drill, yellow/black color, perfect for home improvement projects" },
      { "name": "Wall Paint Set", "price": 2499, "vendor": "ColorSplash", "category": "Home Decor", "image": "Wall Paint Set.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 12, "description": "Wall paint set, 1 gallon emulsion paint in assorted colors for home painting" },
      { "name": "Photo Frame Set", "price": 1299, "vendor": "Decor Trends", "category": "Home Decor", "image": "Photo Frame Set.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 18, "description": "Wooden photo frame set in various sizes, black color for displaying memories" },
      { "name": "Ceiling Light Fixture", "price": 4999, "vendor": "LightHouse", "category": "Home Decor", "image": "Ceiling Light Fixture.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 6, "description": "Elegant ceiling light fixture, 18 inches diameter, bronze color with glass elements" },
      { "name": "Decorative Vase", "price": 799, "vendor": "HomeStyle", "category": "Home Decor", "image": "Decorative Vase.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 25, "description": "Ceramic decorative vase, 12 inches height, white color for floral arrangements" },
      { "name": "Tool Kit", "price": 1999, "vendor": "ToolTech", "category": "Home Decor", "image": "Tool Kit.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 10, "description": "Comprehensive 100-piece tool kit, red/black color for home repairs and projects" },
      { "name": "Area Rug", "price": 3499, "vendor": "Decor Trends", "category": "Home Decor", "image": "Area Rug.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 7, "description": "Wool area rug, 5x7 feet, grey color to enhance living space aesthetics" },
      { "name": "Curtain Set", "price": 1799, "vendor": "HomeStyle", "category": "Home Decor", "image": "Curtain Set.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 14, "description": "Polyester curtain set, 84 inches length, beige color for window decoration" },
      { "name": "Paint Roller Kit", "price": 599, "vendor": "ColorSplash", "category": "Home Decor", "image": "Paint Roller Kit.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 22, "description": "9-piece paint roller kit, blue color with foam rollers for smooth painting" },
      { "name": "Wall Clock", "price": 1299, "vendor": "Decor Trends", "category": "Home Decor", "image": "Wall Clock.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 16, "description": "Wooden wall clock, 24 inches diameter, brown color with metal accents" },
      { "name": "Pendant Light", "price": 2499, "vendor": "LightHouse", "category": "Home Decor", "image": "Pendant Light.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 9, "description": "Modern pendant light, 12 inches diameter, black metal design for contemporary decor" },
      { "name": "DIY Shelving Kit", "price": 1999, "vendor": "ToolTech", "category": "Home Decor", "image": "DIY Shelving Kit.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 11, "description": "Wooden DIY shelving kit, 24x10 inches, natural color for easy home organization" }
    ];

    const insertedProducts = [];
    for (const productData of homeDecorProducts) {
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
    console.log('✅ HOME DECOR SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
