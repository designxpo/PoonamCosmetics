/**
 * Create Collections in Database
 * Adds Featured Collections and Product Sections
 * 
 * Usage: node scripts/create-collections.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

async function createCollections() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all products to use in collections
    console.log('📦 Fetching products...');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found. Please run seed-database.js first.');
      return;
    }

    // Get product IDs by category
    const lipstickProducts = products.filter(p => p.category === 'lipstick').map(p => p._id);
    const foundationProducts = products.filter(p => p.category === 'foundation').map(p => p._id);
    const eyeProducts = products.filter(p => p.category === 'eye-shadow' || p.category === 'mascara' || p.category === 'eyeliner').map(p => p._id);
    const skincareProducts = products.filter(p => p.category === 'serum' || p.category === 'moisturizer').map(p => p._id);
    const featuredProducts = products.filter(p => p.featured).map(p => p._id);

    // Clear existing collections
    console.log('🗑️  Clearing existing collections...');
    await db.collection('featuredcollections').deleteMany({});
    await db.collection('productsections').deleteMany({});
    console.log('✅ Existing collections cleared\n');

    // Featured Collections
    const featuredCollections = [
      {
        name: 'Best Sellers',
        description: 'Our most popular products',
        products: featuredProducts.slice(0, 8),
        isActive: true,
        order: 1
      },
      {
        name: 'New Arrivals',
        description: 'Just launched this season',
        products: products.slice(0, 6).map(p => p._id),
        isActive: true,
        order: 2
      },
      {
        name: 'Lipstick Collection',
        description: 'Beautiful lip colors for every occasion',
        products: lipstickProducts,
        isActive: true,
        order: 3
      },
      {
        name: 'Foundation Favorites',
        description: 'Perfect base makeup for your skin',
        products: foundationProducts,
        isActive: true,
        order: 4
      },
      {
        name: 'Eye Makeup Essentials',
        description: 'Complete eye makeup collection',
        products: eyeProducts,
        isActive: true,
        order: 5
      },
      {
        name: 'Skincare Bundle',
        description: 'Complete skincare routine',
        products: skincareProducts,
        isActive: true,
        order: 6
      }
    ];

    // Product Sections (for homepage)
    const productSections = [
      {
        title: 'Featured Products',
        description: 'Handpicked favorites just for you',
        products: featuredProducts,
        isActive: true,
        order: 1,
        displayType: 'grid'
      },
      {
        title: 'Trending Now',
        description: 'What everyone is buying',
        products: products.slice(0, 8).map(p => p._id),
        isActive: true,
        order: 2,
        displayType: 'slider'
      },
      {
        title: 'Lip Makeup',
        description: 'Bold and beautiful lip colors',
        products: lipstickProducts,
        isActive: true,
        order: 3,
        displayType: 'grid'
      },
      {
        title: 'Face Makeup',
        description: 'Flawless foundation and more',
        products: foundationProducts,
        isActive: true,
        order: 4,
        displayType: 'grid'
      },
      {
        title: 'Skincare',
        description: 'Nourish and protect your skin',
        products: skincareProducts,
        isActive: true,
        order: 5,
        displayType: 'grid'
      }
    ];

    // Insert Featured Collections
    console.log('⭐ Creating Featured Collections...');
    const collectionsResult = await db.collection('featuredcollections').insertMany(featuredCollections);
    console.log(`✅ ${collectionsResult.insertedCount} featured collections created\n`);

    // Insert Product Sections
    console.log('📦 Creating Product Sections...');
    const sectionsResult = await db.collection('productsections').insertMany(productSections);
    console.log(`✅ ${sectionsResult.insertedCount} product sections created\n`);

    // Display created collections with IDs
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⭐ FEATURED COLLECTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const collections = await db.collection('featuredcollections').find({}).toArray();
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name}`);
      console.log(`   ID: ${col._id}`);
      console.log(`   Products: ${col.products.length} items`);
      console.log(`   Active: ${col.isActive}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 PRODUCT SECTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const sections = await db.collection('productsections').find({}).toArray();
    sections.forEach((sec, index) => {
      console.log(`${index + 1}. ${sec.title}`);
      console.log(`   ID: ${sec._id}`);
      console.log(`   Products: ${sec.products.length} items`);
      console.log(`   Display: ${sec.displayType || 'grid'}`);
      console.log(`   Active: ${sec.isActive}`);
      console.log('');
    });

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Featured Collections: ${collectionsResult.insertedCount}`);
    console.log(`Product Sections: ${sectionsResult.insertedCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ Collections created successfully!\n');
    console.log('🎯 You can now:');
    console.log('   1. Fetch collections via API:');
    console.log('      - GET /api/featured-collections');
    console.log('      - GET /api/product-sections');
    console.log('   2. Display on homepage or collection pages');
    console.log('   3. Manage via admin panel\n');

    console.log('💡 Usage Example:');
    console.log('   const result = await api.featuredCollections.getAll();');
    console.log('   const collections = result.data.collections;\n');

  } catch (error) {
    console.error('❌ Error creating collections:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createCollections()
  .then(() => {
    console.log('✨ Collection creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Collection creation failed:', error);
    process.exit(1);
  });
