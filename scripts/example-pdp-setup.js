/**
 * Example script showing how to add PDP features to specific products
 * Modify the examples below and run with: node scripts/example-pdp-setup.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read MongoDB URI from .env.local
function getMongoURI() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) {
      return match[1].trim();
    }
  }
  throw new Error('MONGODB_URI not found in .env.local');
}

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

async function setupExamples() {
  try {
    console.log('Connecting to MongoDB...');
    const MONGODB_URI = getMongoURI();
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ============================================================
    // EXAMPLE 1: Add color selector to a lipstick
    // ============================================================
    console.log('Example 1: Setting up Lipstick with colors...');
    
    const lipstick = await Product.findOne({ slug: 'your-lipstick-slug' });
    
    if (lipstick) {
      lipstick.pdpFeatures = {
        showColorSelector: true,
        availableColors: ['Red', 'Pink', 'Purple', 'Orange', 'Brown'],
        showSizeSelector: false,
        availableSizes: [],
        showReviews: true,
        showSocialShare: true,
        showAdditionalInfo: true,
        customFeatures: [
          { label: 'Type', value: 'Matte Lipstick' },
          { label: 'Finish', value: 'Matte' },
          { label: 'Net Quantity', value: '3.5 g' },
          { label: 'Shelf Life', value: '24 Months' },
        ],
      };
      await lipstick.save();
      console.log('✅ Lipstick configured\n');
    } else {
      console.log('⚠️  Lipstick not found (update the slug in the script)\n');
    }

    // ============================================================
    // EXAMPLE 2: Add size selector to shampoo
    // ============================================================
    console.log('Example 2: Setting up Shampoo with sizes...');
    
    const shampoo = await Product.findOne({ slug: 'your-shampoo-slug' });
    
    if (shampoo) {
      shampoo.pdpFeatures = {
        showColorSelector: false,
        availableColors: [],
        showSizeSelector: true,
        availableSizes: ['100ml', '200ml', '500ml'],
        showReviews: true,
        showSocialShare: true,
        showAdditionalInfo: true,
        customFeatures: [
          { label: 'Hair Type', value: 'All Hair Types' },
          { label: 'Benefits', value: 'Nourishing, Strengthening' },
          { label: 'Usage', value: 'Apply to wet hair, massage, rinse' },
        ],
      };
      await shampoo.save();
      console.log('✅ Shampoo configured\n');
    } else {
      console.log('⚠️  Shampoo not found (update the slug in the script)\n');
    }

    // ============================================================
    // EXAMPLE 3: Simple product (no colors/sizes)
    // ============================================================
    console.log('Example 3: Setting up Face Cream (simple)...');
    
    const cream = await Product.findOne({ slug: 'your-cream-slug' });
    
    if (cream) {
      cream.pdpFeatures = {
        showColorSelector: false,
        availableColors: [],
        showSizeSelector: false,
        availableSizes: [],
        showReviews: true,
        showSocialShare: true,
        showAdditionalInfo: true,
        customFeatures: [
          { label: 'Skin Type', value: 'All Skin Types' },
          { label: 'Concern', value: 'Moisturizing, Anti-aging' },
          { label: 'Net Quantity', value: '50 g' },
        ],
      };
      await cream.save();
      console.log('✅ Face Cream configured\n');
    } else {
      console.log('⚠️  Face Cream not found (update the slug in the script)\n');
    }

    // ============================================================
    // List all products to see their slugs
    // ============================================================
    console.log('\n' + '='.repeat(60));
    console.log('All Products in Database:');
    console.log('='.repeat(60));
    
    const allProducts = await Product.find({}).select('name slug pdpFeatures');
    
    if (allProducts.length === 0) {
      console.log('No products found in database');
    } else {
      allProducts.forEach((p, index) => {
        const hasFeatures = p.pdpFeatures ? '✅' : '❌';
        console.log(`${index + 1}. ${hasFeatures} ${p.name}`);
        console.log(`   Slug: ${p.slug}`);
        if (p.pdpFeatures) {
          console.log(`   Colors: ${p.pdpFeatures.showColorSelector ? 'Yes' : 'No'}`);
          console.log(`   Sizes: ${p.pdpFeatures.showSizeSelector ? 'Yes' : 'No'}`);
        }
        console.log('');
      });
    }

    console.log('\n✅ Done! Update the slugs in this script and run again to configure your products.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the script
setupExamples();
