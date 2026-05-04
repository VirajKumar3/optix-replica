const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --------------------------------------------------------------------------
//                            🔐 AUTHENTICATION ROUTES
// --------------------------------------------------------------------------

// 📝 SIGNUP: POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    
    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 🔑 LOGIN: POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user & include password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --------------------------------------------------------------------------
//                            ⚙️ PRODUCT API ROUTES
// --------------------------------------------------------------------------

// Multer Config for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/api/products', upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    const productData = { ...req.body, images: imageUrls, image: imageUrls[0] };
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, gender, sort, page = 1, limit = 50 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (gender) query.gender = { $in: [gender, 'unisex'] };

    const products = await Product.find(query).sort({ createdAt: -1 });
    const total = await Product.countDocuments(query);
    res.json({ success: true, count: products.length, total, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    console.log(`--- Product Update Start (${req.params.id}) ---`);
    console.log('Update Data received:', req.body);
    
    let updateData = { ...req.body };
    
    // Convert numeric fields to ensure they are stored correctly
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.rating) updateData.rating = Number(updateData.rating);

    if (req.files && req.files.length > 0) {
      console.log('New files uploaded:', req.files.length);
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = imageUrls;
      updateData.image = imageUrls[0];
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { 
      new: true,
      runValidators: true 
    });

    if (!product) {
      console.error('Product not found for update');
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('Update successful. New price:', product.price);
    console.log('--- Product Update End ---');
    res.json({ success: true, product });
  } catch (error) {
    console.error('Update failed:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --------------------------------------------------------------------------
//                            👤 USER PROFILE ROUTES
// --------------------------------------------------------------------------

app.put('/api/auth/profile/image', upload.single('avatar'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(decoded.id, { avatar: imageUrl }, { new: true });
    
    res.json({ success: true, avatar: imageUrl, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// --------------------------------------------------------------------------
//                            🚀 SERVER START
// --------------------------------------------------------------------------

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('DB Connection Error:', err));
