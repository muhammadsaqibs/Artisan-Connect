import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

async function fixAllUsers() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database:`);
    
    for (const user of users) {
      console.log(`- ${user.email} (${user.name})`);
    }

    // Fix each user
    for (const user of users) {
      console.log(`\n🔧 Fixing user: ${user.email}`);
      
      // Reset password to a standard one
      const newPassword = 'TestPass123!';
      user.password = newPassword; // pre-save hook will hash this
      user.email = user.email.toLowerCase().trim(); // normalize email
      
      await user.save();
      console.log(`✅ Fixed ${user.email} - New password: ${newPassword}`);
    }

    console.log('\n🎉 All users fixed!');
    console.log('All users now have password: TestPass123!');
    console.log('You can change passwords later from the dashboard.');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(2);
  }
}

fixAllUsers();





