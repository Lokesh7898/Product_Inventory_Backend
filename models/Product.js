
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }],
  addedOn: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ name: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;