const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] }
});

module.exports = mongoose.model('Category', categorySchema);
