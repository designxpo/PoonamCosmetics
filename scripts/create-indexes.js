/**
 * Database Indexes Setup Script
 * Run this script to create essential indexes for production performance
 * 
 * Usage: node scripts/create-indexes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

async function createIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Product Indexes
    console.log('\n📦 Creating Product indexes...');
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ featured: 1 });
    await db.collection('products').createIndex({ 'pdpFeatures.availableColors': 1 });
    await db.collection('products').createIndex({ 'pdpFeatures.availableSizes': 1 });
    console.log('✅ Product indexes created');

    // Category Indexes
    console.log('\n📂 Creating Category indexes...');
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('categories').createIndex({ name: 1 });
    console.log('✅ Category indexes created');

    // User Indexes
    console.log('\n👤 Creating User indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    console.log('✅ User indexes created');

    // Order Indexes
    console.log('\n🛒 Creating Order indexes...');
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ 'items.productId': 1 });
    console.log('✅ Order indexes created');

    // List all indexes
    console.log('\n📋 Listing all indexes...');
    
    const collections = ['products', 'categories', 'users', 'orders'];
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`\n${collectionName.toUpperCase()}:`);
      indexes.forEach(index => {
        console.log(`  - ${JSON.stringify(index.key)} ${index.unique ? '(unique)' : ''}`);
      });
    }

    console.log('\n✅ All indexes created successfully!');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
createIndexes()
  .then(() => {
    console.log('✨ Index creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Index creation failed:', error);
    process.exit(1);
  });
