const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  originalPrice: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['eyewear', 'sunglasses', 'contact-lens'],
      message: '{VALUE} is not a valid category',
    },
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'kids', 'unisex'],
      message: '{VALUE} is not a valid gender',
    },
  },
  frameType: {
    type: String,
    enum: ['full-rim', 'half-rim', 'rimless'],
  },
  shape: {
    type: String,
    enum: ['aviator', 'round', 'square', 'rectangle', 'wayfarer'],
  },
  color: {
    type: String,
  },
  image: {
    type: String, // Keeping singular for compatibility with current frontend, or use images array
    required: true,
  },
  images: [String],
  description: {
    type: String,
  },
  brand: {
    type: String, // Kept for frontend brand display
  },
  stock: {
    type: Number,
    default: 10,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optimization: MongoDB Indexes
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model('Product', productSchema);
