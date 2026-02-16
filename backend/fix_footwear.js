const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust path as needed

async function fixFootwear() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Find all footwear products
        const footwearProducts = await Product.find({
            category: { $in: ["Women's Footwear", "Men's Footwear", "Kids' Footwear"] }
        });

        console.log(`Found ${footwearProducts.length} footwear products`);

        // Update each product to ensure it has the required fields
        for (const product of footwearProducts) {
            const updateData = {
                status: product.status || 'active',
                stock: product.stock || 10,
                description: product.description || `${product.name} - A quality product from ${product.vendor}`
            };

            await Product.updateOne({ _id: product._id }, updateData);
        }

        console.log('Footwear products fixed successfully');
    } catch (error) {
        console.error('Error fixing footwear:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

fixFootwear();
