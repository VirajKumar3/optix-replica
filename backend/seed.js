const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const seedProducts = [
  // --- EYEWEAR (EYEGLASSES) ---
  {
    name: 'Rayban Aviator Classic',
    brand: 'Rayban',
    price: 5453,
    originalPrice: 7790,
    discount: 30,
    category: 'eyewear',
    gender: 'unisex',
    image: 'glasses-aviator.png',
    stock: 20,
    rating: 4.5
  },
  {
    name: 'CR7 Round Vision',
    brand: 'CR7',
    price: 11289,
    originalPrice: 18816,
    discount: 40,
    category: 'eyewear',
    gender: 'male',
    image: 'glasses-round.png',
    stock: 15,
    rating: 4.2
  },
  {
    name: 'CR7 Square Edge',
    brand: 'CR7',
    price: 11289,
    originalPrice: 18816,
    discount: 40,
    category: 'eyewear',
    gender: 'unisex',
    image: 'glasses-square.png',
    stock: 12,
    rating: 4.3
  },
  {
    name: 'Oakley Sport Optical',
    brand: 'Oakley',
    price: 8500,
    originalPrice: 12000,
    discount: 29,
    category: 'eyewear',
    gender: 'male',
    image: 'sunglass-1.png',
    stock: 10,
    rating: 4.7
  },
  // --- SUNGLASSES ---
  {
    name: 'Gucci Urban Sun',
    brand: 'Gucci',
    price: 25000,
    originalPrice: 35000,
    discount: 28,
    category: 'sunglasses',
    gender: 'female',
    image: 'sunglass-2.png',
    stock: 5,
    rating: 4.9
  },
  {
    name: 'Prada Luxury Shade',
    brand: 'Prada',
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    category: 'sunglasses',
    gender: 'unisex',
    image: 'sunglass-3.png',
    stock: 8,
    rating: 4.8
  },
  {
    name: 'Vogue Chic Round',
    brand: 'Vogue',
    price: 4500,
    originalPrice: 6500,
    discount: 31,
    category: 'sunglasses',
    gender: 'female',
    image: 'sunglass-4.png',
    stock: 25,
    rating: 4.1
  },
  {
    name: 'Police Racer X',
    brand: 'Police',
    price: 6500,
    originalPrice: 9000,
    discount: 27,
    category: 'sunglasses',
    gender: 'male',
    image: 'sunglass-2.png',
    stock: 30,
    rating: 4.0
  },
  {
    name: 'Fastrack Active',
    brand: 'Fastrack',
    price: 2500,
    originalPrice: 3500,
    discount: 28,
    category: 'sunglasses',
    gender: 'kids',
    image: 'sunglass-3.png',
    stock: 50,
    rating: 4.4
  },
  // --- CONTACT LENSES ---
  {
    name: 'Acuvue Moist Daily',
    brand: 'Acuvue',
    price: 2500,
    originalPrice: 3200,
    discount: 22,
    category: 'contact-lens',
    gender: 'unisex',
    image: 'contacts-cat.png',
    stock: 100,
    rating: 4.7
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected for seeding...');
    await Product.deleteMany();
    await Product.insertMany(seedProducts);
    console.log('Database Seeded Successfully with Advanced Schema!');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding Error:', err);
    process.exit(1);
  });
