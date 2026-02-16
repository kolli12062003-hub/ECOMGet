const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  isMain: { type: Boolean, default: false } // Mark the main branch
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);