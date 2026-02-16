const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String }, // Added subcategory field
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // Reference to seller
  image: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }, // Reference to branch
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'active', 'inactive'] },
  stock: { type: Number, default: 0 },
  description: { type: String },
  type: { type: String }, // Added type field for medicines
  addedBy: { type: String, enum: ['self', 'earner'], default: 'self' }, // Who added the product
  earnerName: { type: String }, // Name of the earner if added by earner
  earnerEmail: { type: String }, // Email of the earner if added by earner
  addedDate: { type: Date, default: Date.now } // Date when product was added
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Product', productSchema);
