import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');

    const email = 'saqib.09651100@gmail.com';
    const password = 'TestPass123!';

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('User email:', user.email);
      console.log('User password hash:', user.password.substring(0, 20) + '...');
      console.log('User isAdmin:', user.isAdmin);
      
      // Test password comparison
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      
      // Test the matchPassword method
      const methodMatch = await user.matchPassword(password);
      console.log('Method match:', methodMatch);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(2);
  }
}

testLogin();






