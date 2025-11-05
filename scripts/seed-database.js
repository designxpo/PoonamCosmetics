/**
 * Seed Database with Sample Data
 * Populates the database with sample products, categories, and brands
 * 
 * Usage: node scripts/seed-database.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

// Sample data
const categories = [
  { name: 'Lipstick', slug: 'lipstick', description: 'Beautiful lip colors' },
  { name: 'Foundation', slug: 'foundation', description: 'Perfect base makeup' },
  { name: 'Mascara', slug: 'mascara', description: 'Volumizing mascaras' },
  { name: 'Eye Shadow', slug: 'eye-shadow', description: 'Stunning eye colors' },
  { name: 'Blush', slug: 'blush', description: 'Natural cheek colors' },
  { name: 'Nail Polish', slug: 'nail-polish', description: 'Long-lasting nail colors' },
  { name: 'Face Powder', slug: 'face-powder', description: 'Setting powders' },
  { name: 'Eyeliner', slug: 'eyeliner', description: 'Precise eye definition' },
  { name: 'Serum', slug: 'serum', description: 'Skincare serums' },
  { name: 'Moisturizer', slug: 'moisturizer', description: 'Hydrating creams' }
];

const brands = [
  { name: 'Poonam Beauty', slug: 'poonam-beauty', description: 'Our signature line' },
  { name: 'Lakme', slug: 'lakme', description: 'Premium Indian beauty brand' },
  { name: 'Maybelline', slug: 'maybelline', description: 'International beauty brand' },
  { name: 'L\'Oreal', slug: 'loreal', description: 'Professional cosmetics' },
  { name: 'MAC', slug: 'mac', description: 'High-end makeup' }
];

const products = [
  // Lipsticks
  {
    name: 'Matte Red Lipstick',
    slug: 'matte-red-lipstick',
    description: 'Long-lasting matte finish in classic red',
    price: 299,
    category: 'lipstick',
    brand: 'poonam-beauty',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Red', 'Pink', 'Purple', 'Orange', 'Brown'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  {
    name: 'Glossy Pink Lipstick',
    slug: 'glossy-pink-lipstick',
    description: 'Shiny glossy finish in beautiful pink',
    price: 249,
    category: 'lipstick',
    brand: 'lakme',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Pink', 'Rose', 'Coral', 'Nude'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Foundations
  {
    name: 'Liquid Foundation - Fair',
    slug: 'liquid-foundation-fair',
    description: 'Lightweight liquid foundation for fair skin tones',
    price: 599,
    category: 'foundation',
    brand: 'loreal',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  {
    name: 'HD Foundation',
    slug: 'hd-foundation',
    description: 'High definition coverage foundation',
    price: 799,
    category: 'foundation',
    brand: 'mac',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'],
    featured: false,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Mascaras
  {
    name: 'Volume Express Mascara',
    slug: 'volume-express-mascara',
    description: 'Dramatic volume in every stroke',
    price: 349,
    category: 'mascara',
    brand: 'maybelline',
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Black', 'Brown', 'Blue'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Eye Shadows
  {
    name: 'Nude Eye Shadow Palette',
    slug: 'nude-eye-shadow-palette',
    description: '12 shades of neutral nude colors',
    price: 899,
    category: 'eye-shadow',
    brand: 'poonam-beauty',
    images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: false,
      availableColors: [],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Blush
  {
    name: 'Rosy Glow Blush',
    slug: 'rosy-glow-blush',
    description: 'Natural rosy cheek color',
    price: 399,
    category: 'blush',
    brand: 'lakme',
    images: ['https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=500'],
    featured: false,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Rose', 'Peach', 'Pink', 'Coral'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Nail Polish
  {
    name: 'Quick Dry Nail Polish',
    slug: 'quick-dry-nail-polish',
    description: 'Fast-drying nail color',
    price: 149,
    category: 'nail-polish',
    brand: 'maybelline',
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Red', 'Pink', 'Purple', 'Black', 'White', 'Blue'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Face Powder
  {
    name: 'Translucent Setting Powder',
    slug: 'translucent-setting-powder',
    description: 'Light-weight setting powder',
    price: 499,
    category: 'face-powder',
    brand: 'loreal',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'],
    featured: false,
    pdpFeatures: {
      showColorSelector: false,
      availableColors: [],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Eyeliner
  {
    name: 'Waterproof Eyeliner',
    slug: 'waterproof-eyeliner',
    description: 'Smudge-proof, long-lasting eyeliner',
    price: 249,
    category: 'eyeliner',
    brand: 'maybelline',
    images: ['https://images.unsplash.com/photo-1583241800698-c1cf82f2e330?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Black', 'Brown', 'Blue', 'Green'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  },
  // Serum
  {
    name: 'Vitamin C Serum',
    slug: 'vitamin-c-serum',
    description: 'Brightening vitamin C serum',
    price: 899,
    category: 'serum',
    brand: 'poonam-beauty',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: false,
      availableColors: [],
      showSizeSelector: true,
      availableSizes: ['15ml', '30ml', '50ml'],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true,
      customFeatures: [
        { label: 'Skin Type', value: 'All skin types' },
        { label: 'Key Ingredient', value: 'Vitamin C' },
        { label: 'Benefits', value: 'Brightening, Anti-aging' }
      ]
    }
  },
  // Moisturizer
  {
    name: 'Hydrating Day Cream',
    slug: 'hydrating-day-cream',
    description: 'Daily moisturizing cream with SPF',
    price: 699,
    category: 'moisturizer',
    brand: 'loreal',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
    featured: true,
    pdpFeatures: {
      showColorSelector: false,
      availableColors: [],
      showSizeSelector: true,
      availableSizes: ['30g', '50g', '100g'],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true,
      customFeatures: [
        { label: 'Skin Type', value: 'All skin types' },
        { label: 'SPF', value: 'SPF 30' },
        { label: 'Benefits', value: 'Hydrating, Sun protection' }
      ]
    }
  }
];

// Admin user
const adminUser = {
  name: 'Admin',
  email: 'admin@poonamcosmetics.com',
  password: 'admin123', // Will be hashed
  role: 'admin'
};

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('categories').deleteMany({});
    await db.collection('brands').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert Categories
    console.log('📂 Inserting categories...');
    const categoryResult = await db.collection('categories').insertMany(categories);
    console.log(`✅ ${categoryResult.insertedCount} categories inserted\n`);

    // Insert Brands
    console.log('🏷️  Inserting brands...');
    const brandResult = await db.collection('brands').insertMany(brands);
    console.log(`✅ ${brandResult.insertedCount} brands inserted\n`);

    // Insert Products
    console.log('📦 Inserting products...');
    const productResult = await db.collection('products').insertMany(products);
    console.log(`✅ ${productResult.insertedCount} products inserted\n`);

    // Insert Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await db.collection('users').insertOne({
      ...adminUser,
      password: hashedPassword
    });
    console.log('✅ Admin user created\n');
    console.log('   Email: admin@poonamcosmetics.com');
    console.log('   Password: admin123\n');

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SEED SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Categories: ${categoryResult.insertedCount}`);
    console.log(`Brands: ${brandResult.insertedCount}`);
    console.log(`Products: ${productResult.insertedCount}`);
    console.log(`Admin Users: 1`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ Database seeded successfully!\n');
    console.log('🚀 You can now:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Admin login: http://localhost:3000/admin/login');
    console.log('      Email: admin@poonamcosmetics.com');
    console.log('      Password: admin123\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
seedDatabase()
  .then(() => {
    console.log('✨ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
