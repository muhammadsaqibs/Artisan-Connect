import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

async function testNewUser() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');

    // Test data
    const testEmail = 'newuser@test.com';
    const testPassword = 'NewPass123!';
    const testName = 'New User';

    // Delete existing test user if exists
    await User.deleteOne({ email: testEmail });
    console.log('🧹 Cleaned up existing test user');

    // Create new user
    const newUser = new User({
      name: testName,
      email: testEmail,
      password: testPassword,
      isAdmin: false
    });

    await newUser.save();
    console.log('✅ New user created');

    // Test login
    const foundUser = await User.findOne({ email: testEmail });
    console.log('User found:', foundUser ? 'YES' : 'NO');
    
    if (foundUser) {
      console.log('User email:', foundUser.email);
      console.log('User password hash:', foundUser.password.substring(0, 20) + '...');
      
      // Test password comparison
      const isMatch = await bcrypt.compare(testPassword, foundUser.password);
      console.log('Password match:', isMatch);
      
      // Test the matchPassword method
      const methodMatch = await foundUser.matchPassword(testPassword);
      console.log('Method match:', methodMatch);
    }

    // Clean up
    await User.deleteOne({ email: testEmail });
    console.log('🧹 Cleaned up test user');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(2);
  }
}

testNewUser();






