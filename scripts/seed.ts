// Sample data seeding script
// Run this after setting up the database to populate with sample data

import dbConnect from '../lib/mongodb';
import Category from '../models/Category';
import Product from '../models/Product';
import Settings from '../models/Settings';

const sampleCategories = [
  {
    name: 'Lipsticks',
    slug: 'lipsticks',
    description: 'Beautiful lipsticks in various shades',
  },
  {
    name: 'Face Creams',
    slug: 'face-creams',
    description: 'Nourishing face creams for all skin types',
  },
  {
    name: 'Eye Makeup',
    slug: 'eye-makeup',
    description: 'Complete eye makeup collection',
  },
  {
    name: 'Nail Polish',
    slug: 'nail-polish',
    description: 'Long-lasting nail polish',
  },
];

const sampleProducts = [
  {
    name: 'Matte Red Lipstick',
    slug: 'matte-red-lipstick',
    description: 'Long-lasting matte red lipstick with moisturizing formula. Perfect for all occasions.',
    price: 299,
    images: ['/placeholder.jpg'],
    stock: 50,
    featured: true,
  },
  {
    name: 'Hydrating Face Cream',
    slug: 'hydrating-face-cream',
    description: '24-hour hydrating face cream with SPF 30 protection. Suitable for all skin types.',
    price: 599,
    images: ['/placeholder.jpg'],
    stock: 30,
    featured: true,
  },
  {
    name: 'Waterproof Mascara',
    slug: 'waterproof-mascara',
    description: 'Volumizing waterproof mascara for beautiful lashes that last all day.',
    price: 399,
    images: ['/placeholder.jpg'],
    stock: 40,
    featured: false,
  },
  {
    name: 'Glossy Pink Nail Polish',
    slug: 'glossy-pink-nail-polish',
    description: 'Quick-dry glossy pink nail polish with long-lasting shine.',
    price: 149,
    images: ['/placeholder.jpg'],
    stock: 100,
    featured: false,
  },
];

async function seedDatabase() {
  try {
    await dbConnect();
    console.log('✅ Connected to database');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${categories.length} categories`);

    // Create products with category references
    const productsWithCategories = sampleProducts.map((product, index) => ({
      ...product,
      category: categories[index % categories.length]._id,
    }));

    const products = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${products.length} products`);

    // Create default settings
    await Settings.create({
      whatsappNumber: '919999999999',
      deliveryCharge: 50,
      freeDeliveryThreshold: 999,
      banners: [],
    });
    console.log('✅ Created default settings');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 You can now:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Login to admin panel: http://localhost:3000/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
