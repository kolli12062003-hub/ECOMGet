const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust path as needed

async function checkFootwear() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Check footwear products
        const footwearProducts = await Product.find({
            category: { $in: ["Women's Footwear", "Men's Footwear", "Kids' Footwear"] }
        });

        console.log(`Found ${footwearProducts.length} footwear products`);

        // Group by category
        const categories = {
            "Women's Footwear": [],
            "Men's Footwear": [],
            "Kids' Footwear": []
        };

        footwearProducts.forEach(product => {
            if (categories[product.category]) {
                categories[product.category].push(product);
            }
        });

        // Display summary
        Object.keys(categories).forEach(cat => {
            console.log(`${cat}: ${categories[cat].length} products`);
        });

        // Check for missing fields
        const missingFields = [];
        footwearProducts.forEach(product => {
            const requiredFields = ['name', 'price', 'vendor', 'category', 'image', 'lat', 'lon', 'stock', 'description'];
            requiredFields.forEach(field => {
                if (!product[field]) {
                    missingFields.push(`${product.name} (${product._id}): missing ${field}`);
                }
            });
        });

        if (missingFields.length > 0) {
            console.log('Products with missing fields:');
            missingFields.forEach(item => console.log(`- ${item}`));
        } else {
            console.log('All products have required fields');
        }

        console.log('Footwear check completed');
    } catch (error) {
        console.error('Error checking footwear:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

checkFootwear();
