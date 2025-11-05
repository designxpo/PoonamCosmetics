/**
 * Quick script to enable/disable size selector for specific products
 * Run with: node scripts/toggle-size-selector.js
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

// ============================================================
// CONFIGURATION - Edit this section to enable/disable sizes
// ============================================================

const productsWithSizes = [
  // SERUMS - Different volumes
  {
    slug: 'pure-glow-vitamin-c-serum',
    sizes: ['15ml', '30ml', '50ml']
  },
  {
    slug: 'deep-hydration-hyaluronic-serum',
    sizes: ['15ml', '30ml', '50ml']
  },
  {
    slug: 'retinol-night-serum',
    sizes: ['15ml', '30ml']
  },
  {
    slug: 'niacinamide-pore-treatment-serum',
    sizes: ['15ml', '30ml', '50ml']
  },
  {
    slug: 'centella-asiatica-soothing-ampoule',
    sizes: ['15ml', '30ml']
  },
  {
    slug: 'green-tea-antioxidant-essence',
    sizes: ['30ml', '50ml', '100ml']
  },
  
  // CREAMS - Different sizes
  {
    slug: 'radiance-hydrating-day-cream-spf30',
    sizes: ['30g', '50g', '100g']
  },
  {
    slug: 'overnight-repair-night-cream',
    sizes: ['30g', '50g', '100g']
  },
  {
    slug: 'anti-aging-collagen-boost-cream',
    sizes: ['30g', '50g']
  },
  {
    slug: 'brightening-vitamin-c-cream',
    sizes: ['30g', '50g', '100g']
  },
  {
    slug: 'soothing-aloe-gel-cream',
    sizes: ['50g', '100g', '200g']
  },
  {
    slug: 'niacinamide-pore-refining-cream',
    sizes: ['30g', '50g']
  },
  {
    slug: 'ceramide-barrier-repair-cream',
    sizes: ['30g', '50g', '100g']
  },
  {
    slug: 'snail-mucin-recovery-cream',
    sizes: ['50g', '100g']
  },
  {
    slug: 'rose-water-gel-moisturizer',
    sizes: ['50g', '100g']
  },
  {
    slug: 'peptide-complex-anti-wrinkle-cream',
    sizes: ['30g', '50g']
  },
  {
    slug: 'tea-tree-oil-control-cream',
    sizes: ['50g', '100g']
  },
  {
    slug: 'collagen-boosting-eye-cream',
    sizes: ['15g', '30g']
  },
  
  // CLEANSERS - Different volumes
  {
    slug: 'gentle-foam-face-cleanser',
    sizes: ['100ml', '200ml', '300ml']
  },
  
  // TONERS - Different volumes
  {
    slug: 'rose-water-toner-mist',
    sizes: ['100ml', '200ml']
  },
  {
    slug: 'exfoliating-aha-bha-toner',
    sizes: ['100ml', '200ml']
  },
];

const productsWithoutSizes = [
  // Example: Add products that should NOT have size selector
  // Uncomment and modify as needed:
  
  // 'classic-red-matte-lipstick',
  // 'rose-petal-lipstick',
  
  // Add more product slugs here...
];

// ============================================================

async function toggleSizeSelectors() {
  try {
    console.log('🔧 Toggling Size Selectors...\n');
    
    const MONGODB_URI = getMongoURI();
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Enable size selectors
    if (productsWithSizes.length > 0) {
      console.log('📏 Enabling size selectors:');
      console.log('='.repeat(50));
      
      for (const config of productsWithSizes) {
        const product = await Product.findOne({ slug: config.slug });
        
        if (!product) {
          console.log(`❌ Not found: ${config.slug}`);
          continue;
        }
        
        if (!product.pdpFeatures) {
          product.pdpFeatures = {};
        }
        
        product.pdpFeatures.showSizeSelector = true;
        product.pdpFeatures.availableSizes = config.sizes;
        
        await product.save();
        console.log(`✅ ${product.name}`);
        console.log(`   Sizes: ${config.sizes.join(', ')}`);
      }
      console.log('');
    }

    // Disable size selectors
    if (productsWithoutSizes.length > 0) {
      console.log('🚫 Disabling size selectors:');
      console.log('='.repeat(50));
      
      for (const slug of productsWithoutSizes) {
        const product = await Product.findOne({ slug });
        
        if (!product) {
          console.log(`❌ Not found: ${slug}`);
          continue;
        }
        
        if (!product.pdpFeatures) {
          product.pdpFeatures = {};
        }
        
        product.pdpFeatures.showSizeSelector = false;
        product.pdpFeatures.availableSizes = [];
        
        await product.save();
        console.log(`✅ ${product.name}`);
      }
      console.log('');
    }

    if (productsWithSizes.length === 0 && productsWithoutSizes.length === 0) {
      console.log('⚠️  No products configured in the script.');
      console.log('   Edit the script and add products to the arrays.\n');
      
      // Show example products
      console.log('📋 Your Products (first 10):');
      console.log('='.repeat(50));
      const products = await Product.find({}).limit(10).select('name slug pdpFeatures');
      products.forEach((p, i) => {
        const hasSizes = p.pdpFeatures?.showSizeSelector ? '✅' : '❌';
        console.log(`${i + 1}. ${hasSizes} ${p.name}`);
        console.log(`   slug: "${p.slug}"`);
        if (p.pdpFeatures?.showSizeSelector && p.pdpFeatures.availableSizes) {
          console.log(`   sizes: ${p.pdpFeatures.availableSizes.join(', ')}`);
        }
        console.log('');
      });
    }

    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the script
toggleSizeSelectors();
