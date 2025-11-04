const mongoose = require('mongoose');

// MongoDB connection  
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/poonam-cosmetics';

async function diagnoseProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Product = mongoose.connection.collection('products');
    const Category = mongoose.connection.collection('categories');
    
    // Get some sample products
    const products = await Product.find({ isActive: true }).limit(5).toArray();
    const categories = await Category.find({}).toArray();
    
    console.log('📊 Categories in database:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug}) [ID: ${cat._id}]`);
    });
    
    console.log('\n📦 Sample Products (first 5):');
    products.forEach(prod => {
      console.log(`\n   Product: ${prod.name}`);
      console.log(`   - Price: ₹${prod.price}`);
      console.log(`   - Stock: ${prod.stock}`);
      console.log(`   - Category ID: ${prod.category}`);
      console.log(`   - Images: ${prod.images?.length || 0}`);
      console.log(`   - Active: ${prod.isActive}`);
      console.log(`   - Featured: ${prod.featured}`);
    });
    
    console.log(`\n📈 Total Stats:`);
    console.log(`   - Total Products: ${await Product.countDocuments()}`);
    console.log(`   - Active Products: ${await Product.countDocuments({ isActive: true })}`);
    console.log(`   - Featured Products: ${await Product.countDocuments({ featured: true })}`);
    console.log(`   - Total Categories: ${categories.length}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

diagnoseProducts();
