const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ogiralarajeswari08:vON1WGhNzXosDtr7@cluster1.gi4yshl.mongodb.net/ecom_shopnest?appName=Cluster1';

const offerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['product', 'seller', 'category', 'global']
  },
  targetId: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  discountValue: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  image: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'active', 'inactive'] },
  stock: { type: Number, default: 0 },
  description: { type: String },
  type: { type: String },
  warranty: { type: String },
  expiryDate: { type: Date }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all offers
    const offers = await Offer.find();
    console.log('All offers:', offers.map(o => ({ type: o.type, targetId: o.targetId, discountValue: o.discountValue, isActive: o.isActive })));

    // Get products for Beauty Products
    const products = await Product.find({ category: 'Beauty Products', status: { $in: ['active', 'approved'] } });
    console.log('Beauty Products:', products.map(p => ({ name: p.name, category: p.category, price: p.price })));

    // Simulate the discount application
    const activeOffers = offers.filter(o => o.isActive);
    console.log('Active offers:', activeOffers.map(o => ({ type: o.type, targetId: o.targetId, discountValue: o.discountValue })));

    const productsWithDiscounts = products.map(product => {
      const applicableOffers = activeOffers.filter(offer => {
        if (offer.type === 'global') return true;
        if (offer.type === 'seller' && offer.targetId === product.vendor) return true;
        if (offer.type === 'category' && offer.targetId === product.category) return true;
        if (offer.type === 'product' && offer.targetId === product._id.toString()) return true;
        return false;
      });

      console.log(`Applicable offers for ${product.name}:`, applicableOffers.map(o => o.targetId));

      let bestDiscount = 0;
      let bestOffer = null;

      applicableOffers.forEach(offer => {
        let discount = 0;
        if (offer.discountType === 'percentage') {
          discount = (product.price * offer.discountValue) / 100;
        } else {
          discount = offer.discountValue;
        }

        if (discount > bestDiscount) {
          bestDiscount = discount;
          bestOffer = offer;
        }
      });

      if (bestDiscount > 0) {
        return {
          name: product.name,
          originalPrice: product.price,
          discountedPrice: Math.max(0, product.price - bestDiscount),
          discountAmount: bestDiscount,
          discountPercentage: bestOffer.discountType === 'percentage' ? bestOffer.discountValue : Math.round((bestDiscount / product.price) * 100)
        };
      } else {
        return {
          name: product.name,
          price: product.price
        };
      }
    });

    console.log('Products with discounts:', productsWithDiscounts);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

test();
