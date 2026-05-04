const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@optix.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'Optix Admin',
      email: 'admin@optix.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    console.log('Admin User Created Successfully!');
    console.log('Email: admin@optix.com');
    console.log('Password: adminpassword123');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
