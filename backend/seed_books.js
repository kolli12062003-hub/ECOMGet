const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecom_shopnest');
    const products = db.collection('products');

    const booksProducts = [
      { "name": "The Great Gatsby", "price": 499, "vendor": "Classic Reads", "category": "Books", "image": "The Great Gatsby.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 25, "description": "A classic American novel by F. Scott Fitzgerald, exploring the Jazz Age and the American Dream" },
      { "name": "1984", "price": 399, "vendor": "Dystopian Books", "category": "Books", "image": "1984.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 30, "description": "George Orwell's dystopian masterpiece about totalitarianism and surveillance" },
      { "name": "To Kill a Mockingbird", "price": 449, "vendor": "Literary Hub", "category": "Books", "image": "To Kill a Mockingbird.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 20, "description": "Harper Lee's Pulitzer Prize-winning novel about racial injustice in the American South" },
      { "name": "Pride and Prejudice", "price": 349, "vendor": "Classic Reads", "category": "Books", "image": "Pride and Prejudice.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 35, "description": "Jane Austen's beloved romance novel about love, marriage, and social class" },
      { "name": "The Catcher in the Rye", "price": 429, "vendor": "Modern Classics", "category": "Books", "image": "The Catcher in the Rye.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 28, "description": "J.D. Salinger's coming-of-age story following Holden Caulfield's journey" },
      { "name": "Sapiens", "price": 599, "vendor": "Non-Fiction Books", "category": "Books", "image": "Sapiens.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 15, "description": "Yuval Noah Harari's groundbreaking exploration of human history" },
      { "name": "The Hobbit", "price": 499, "vendor": "Fantasy Reads", "category": "Books", "image": "The Hobbit.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 22, "description": "J.R.R. Tolkien's fantasy adventure about Bilbo Baggins and the One Ring" },
      { "name": "Becoming", "price": 699, "vendor": "Memoir Books", "category": "Books", "image": "Becoming.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 18, "description": "Michelle Obama's inspiring memoir about her life and journey" },
      { "name": "Dune", "price": 549, "vendor": "Sci-Fi Books", "category": "Books", "image": "Dune.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 20, "description": "Frank Herbert's epic science fiction novel set on the desert planet Arrakis" },
      { "name": "Atomic Habits", "price": 649, "vendor": "Self-Help Books", "category": "Books", "image": "Atomic Habits.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 25, "description": "James Clear's guide to building good habits and breaking bad ones" },
      { "name": "The Alchemist", "price": 399, "vendor": "Fiction Hub", "category": "Books", "image": "The Alchemist.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 30, "description": "Paulo Coelho's philosophical novel about following your dreams" },
      { "name": "Educated", "price": 599, "vendor": "Memoir Books", "category": "Books", "image": "Educated.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 20, "description": "Tara Westover's powerful memoir about education and family" },
      { "name": "Harry Potter", "price": 799, "vendor": "Fantasy Reads", "category": "Books", "image": "Harry Potter.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 15, "description": "J.K. Rowling's magical series about the boy wizard Harry Potter" },
      { "name": "Thinking, Fast and Slow", "price": 649, "vendor": "Non-Fiction Books", "category": "Books", "image": "Thinking, Fast and Slow.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 18, "description": "Daniel Kahneman's exploration of how we think and make decisions" },
      { "name": "The Shining", "price": 499, "vendor": "Horror Books", "category": "Books", "image": "The Shining.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 22, "description": "Stephen King's terrifying horror novel about the Overlook Hotel" }
    ];

    const insertedProducts = [];
    for (const productData of booksProducts) {
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
    console.log('✅ BOOKS SEEDING COMPLETED');
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

  } finally {
    await client.close();
  }
}

seed().catch(console.error);
