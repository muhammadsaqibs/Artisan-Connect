import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');

    // Inspect and fix stale indexes on orders collection
    const collection = mongoose.connection.db.collection('orders');
    const indexes = await collection.indexes();
    console.log('Existing indexes on orders:', indexes.map(i=>i.name));
    // Drop stale unique index on orderNumber if exists
    const orderNumberIdx = indexes.find(i => i.name === 'orderNumber_1');
    if (orderNumberIdx) {
      try {
        await collection.dropIndex('orderNumber_1');
        console.log('🧹 Dropped stale index orderNumber_1');
      } catch (e) {
        console.warn('Could not drop orderNumber_1:', e.message);
      }
    }
    // Ensure unique index on orderToken
    try {
      await collection.createIndex({ orderToken: 1 }, { unique: true, name: 'orderToken_1' });
      console.log('✅ Ensured unique index on orderToken');
    } catch (e) {
      console.warn('Index ensure warning:', e.message);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(2);
  }
}

main();




