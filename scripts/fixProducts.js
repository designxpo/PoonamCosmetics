const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/poonam-cosmetics';

async function fixProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Product = mongoose.connection.collection('products');
    
    // Update all products that don't have isActive field
    const result = await Product.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products to set isActive: true`);

    // Also log total product count
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    
    console.log(`\n📊 Database Status:`);
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   Active Products: ${activeProducts}`);
    console.log(`   Inactive Products: ${totalProducts - activeProducts}`);

    await mongoose.connection.close();
    console.log('\n✅ Done! Products should now be visible on the frontend.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProducts();
