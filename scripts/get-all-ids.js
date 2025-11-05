/**
 * Get All IDs from Database
 * Displays all document IDs for quick reference
 * 
 * Usage: node scripts/get-all-ids.js
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

async function getAllIds() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Products
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 PRODUCTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const products = await db.collection('products')
      .find({}, { projection: { _id: 1, name: 1, slug: 1, category: 1 } })
      .sort({ name: 1 })
      .toArray();
    console.log(`Total: ${products.length} products\n`);
    
    if (products.length > 0) {
      products.forEach((p, index) => {
        console.log(`${index + 1}. ${p.name}`);
        console.log(`   ID: ${p._id}`);
        console.log(`   Slug: ${p.slug}`);
        console.log(`   Category: ${p.category}`);
        console.log(`   URL: /products/${p.slug}`);
        console.log('');
      });
    }

    // Categories
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📂 CATEGORIES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const categories = await db.collection('categories')
      .find({}, { projection: { _id: 1, name: 1, slug: 1 } })
      .sort({ name: 1 })
      .toArray();
    console.log(`Total: ${categories.length} categories\n`);
    
    if (categories.length > 0) {
      categories.forEach((c, index) => {
        console.log(`${index + 1}. ${c.name}`);
        console.log(`   ID: ${c._id}`);
        console.log(`   Slug: ${c.slug}`);
        console.log(`   URL: /products?category=${c.slug}`);
        console.log('');
      });
    }

    // Brands
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏷️  BRANDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const brands = await db.collection('brands')
      .find({}, { projection: { _id: 1, name: 1, slug: 1 } })
      .sort({ name: 1 })
      .toArray();
    console.log(`Total: ${brands.length} brands\n`);
    
    if (brands.length > 0) {
      brands.forEach((b, index) => {
        console.log(`${index + 1}. ${b.name}`);
        console.log(`   ID: ${b._id}`);
        console.log(`   Slug: ${b.slug || 'N/A'}`);
        console.log('');
      });
    }

    // Orders
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛒 ORDERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const ordersCount = await db.collection('orders').countDocuments();
    const orders = await db.collection('orders')
      .find({}, { projection: { _id: 1, orderNumber: 1, email: 1, status: 1, totalAmount: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    console.log(`Total: ${ordersCount} orders (showing latest 20)\n`);
    
    if (orders.length > 0) {
      orders.forEach((o, index) => {
        console.log(`${index + 1}. Order #${o.orderNumber}`);
        console.log(`   ID: ${o._id}`);
        console.log(`   Email: ${o.email}`);
        console.log(`   Status: ${o.status}`);
        console.log(`   Amount: ₹${o.totalAmount}`);
        console.log(`   Date: ${new Date(o.createdAt).toLocaleDateString()}`);
        console.log('');
      });
    }

    // Users
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 USERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const users = await db.collection('users')
      .find({}, { projection: { _id: 1, name: 1, email: 1, role: 1 } })
      .sort({ name: 1 })
      .toArray();
    console.log(`Total: ${users.length} users\n`);
    
    if (users.length > 0) {
      users.forEach((u, index) => {
        console.log(`${index + 1}. ${u.name}`);
        console.log(`   ID: ${u._id}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role}`);
        console.log('');
      });
    }

    // Banners
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 BANNERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const banners = await db.collection('banners')
      .find({}, { projection: { _id: 1, title: 1, isActive: 1, order: 1 } })
      .toArray();
    console.log(`Total: ${banners.length} banners\n`);
    
    if (banners.length > 0) {
      banners.forEach((b, index) => {
        console.log(`${index + 1}. ${b.title}`);
        console.log(`   ID: ${b._id}`);
        console.log(`   Active: ${b.isActive}`);
        console.log(`   Order: ${b.order}`);
        console.log('');
      });
    }

    // Page Banners
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 PAGE BANNERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const pageBanners = await db.collection('pagebanners')
      .find({}, { projection: { _id: 1, page: 1, title: 1, isActive: 1 } })
      .toArray();
    console.log(`Total: ${pageBanners.length} page banners\n`);
    
    if (pageBanners.length > 0) {
      pageBanners.forEach((pb, index) => {
        console.log(`${index + 1}. ${pb.page.toUpperCase()} - ${pb.title}`);
        console.log(`   ID: ${pb._id}`);
        console.log(`   Page: ${pb.page}`);
        console.log(`   Active: ${pb.isActive}`);
        console.log('');
      });
    }

    // Featured Collections
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⭐ FEATURED COLLECTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const collections = await db.collection('featuredcollections')
      .find({}, { projection: { _id: 1, name: 1, isActive: 1, products: 1 } })
      .toArray();
    console.log(`Total: ${collections.length} featured collections\n`);
    
    if (collections.length > 0) {
      collections.forEach((fc, index) => {
        console.log(`${index + 1}. ${fc.name}`);
        console.log(`   ID: ${fc._id}`);
        console.log(`   Active: ${fc.isActive}`);
        console.log(`   Products: ${fc.products.length} items`);
        console.log('');
      });
    }

    // Product Sections
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 PRODUCT SECTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const sections = await db.collection('productsections')
      .find({}, { projection: { _id: 1, title: 1, isActive: 1, products: 1 } })
      .toArray();
    console.log(`Total: ${sections.length} product sections\n`);
    
    if (sections.length > 0) {
      sections.forEach((ps, index) => {
        console.log(`${index + 1}. ${ps.title}`);
        console.log(`   ID: ${ps._id}`);
        console.log(`   Active: ${ps.isActive}`);
        console.log(`   Products: ${ps.products.length} items`);
        console.log('');
      });
    }

    // Reviews
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⭐ REVIEWS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const reviews = await db.collection('reviews')
      .aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productInfo'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $project: {
            _id: 1,
            rating: 1,
            title: 1,
            status: 1,
            helpful: 1,
            verified: 1,
            'productInfo.name': 1,
            'userInfo.name': 1,
            createdAt: 1
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 20 }
      ])
      .toArray();
    
    const totalReviews = await db.collection('reviews').countDocuments();
    console.log(`Total: ${totalReviews} reviews (showing latest 20)\n`);
    
    if (reviews.length > 0) {
      reviews.forEach((r, index) => {
        const product = r.productInfo[0];
        const user = r.userInfo[0];
        console.log(`${index + 1}. ${r.title}`);
        console.log(`   ID: ${r._id}`);
        console.log(`   Product: ${product ? product.name : 'Unknown'}`);
        console.log(`   User: ${user ? user.name : 'Unknown'}`);
        console.log(`   Rating: ${'⭐'.repeat(r.rating)} (${r.rating}/5)`);
        console.log(`   Status: ${r.status}`);
        console.log(`   Verified: ${r.verified ? '✓' : '✗'}`);
        console.log(`   Helpful: ${r.helpful} votes`);
        console.log('');
      });
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Products: ${products.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Brands: ${brands.length}`);
    console.log(`Orders: ${ordersCount}`);
    console.log(`Users: ${users.length}`);
    console.log(`Reviews: ${totalReviews}`);
    console.log(`Banners: ${banners.length}`);
    console.log(`Page Banners: ${pageBanners.length}`);
    console.log(`Featured Collections: ${collections.length}`);
    console.log(`Product Sections: ${sections.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ Done! All IDs retrieved successfully.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
getAllIds()
  .then(() => {
    console.log('✨ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
