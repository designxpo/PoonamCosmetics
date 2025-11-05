const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  images: [String],
  stock: Number,
  featured: Boolean,
  isActive: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ isActive: true });
    const inactive = await Product.countDocuments({ isActive: false });
    const noIsActive = await Product.countDocuments({ isActive: { $exists: false } });

    console.log('\n📊 Product Statistics:');
    console.log('======================');
    console.log(`Total Products: ${total}`);
    console.log(`Active Products (isActive: true): ${active}`);
    console.log(`Inactive Products (isActive: false): ${inactive}`);
    console.log(`Products without isActive field: ${noIsActive}`);

    // Get sample products
    const sampleProducts = await Product.find().limit(5).lean();
    console.log('\n📦 Sample Products:');
    console.log('===================');
    sampleProducts.forEach(p => {
      console.log(`\nName: ${p.name}`);
      console.log(`Slug: ${p.slug}`);
      console.log(`isActive: ${p.isActive}`);
      console.log(`featured: ${p.featured}`);
      console.log(`stock: ${p.stock}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
