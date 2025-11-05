/**
 * Configure PDP features for all products automatically
 * Run with: node scripts/auto-configure-pdp.js
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

async function autoConfigurePDP() {
  try {
    console.log('🚀 Starting Auto-Configuration of PDP Features...\n');
    
    const MONGODB_URI = getMongoURI();
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allProducts = await Product.find({});
    
    let configured = 0;
    let skipped = 0;

    for (const product of allProducts) {
      const name = product.name.toLowerCase();
      
      // Skip if already configured
      if (product.pdpFeatures && Object.keys(product.pdpFeatures).length > 0) {
        console.log(`⏭️  Skipped: ${product.name} (already configured)`);
        skipped++;
        continue;
      }

      let config = {
        showReviews: true,
        showSocialShare: true,
        showAdditionalInfo: true,
        customFeatures: [],
      };

      // LIPSTICK - With color options
      if (name.includes('lipstick') || name.includes('lip stick')) {
        config.showColorSelector = true;
        config.availableColors = ['Red', 'Pink', 'Purple', 'Orange', 'Brown'];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Lipstick' },
          { label: 'Finish', value: 'Matte/Satin' },
          { label: 'Net Quantity', value: '3.5 g' },
          { label: 'Shelf Life', value: '24 Months' },
        ];
      }
      
      // FOUNDATION - With shade options
      else if (name.includes('foundation') || name.includes('bb cream') || name.includes('cc cream')) {
        config.showColorSelector = true;
        config.availableColors = ['Fair', 'Light', 'Medium', 'Tan', 'Deep'].map(shade => shade);
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Foundation' },
          { label: 'Coverage', value: 'Full/Medium' },
          { label: 'Net Quantity', value: '30 ml' },
          { label: 'Finish', value: 'Matte/Dewy' },
        ];
      }
      
      // NAIL POLISH - With color options
      else if (name.includes('nail') && (name.includes('polish') || name.includes('lacquer'))) {
        config.showColorSelector = true;
        config.availableColors = ['Red', 'Pink', 'Blue', 'Black', 'White'];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Nail Polish' },
          { label: 'Finish', value: 'Glossy/Matte' },
          { label: 'Net Quantity', value: '15 ml' },
          { label: 'Dry Time', value: '5-10 minutes' },
        ];
      }
      
      // SERUM - No colors/sizes
      else if (name.includes('serum') || name.includes('ampoule') || name.includes('essence')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Serum' },
          { label: 'Skin Type', value: 'All Skin Types' },
          { label: 'Net Quantity', value: '30 ml' },
          { label: 'Application', value: '2-3 drops on clean face' },
        ];
      }
      
      // CREAM/MOISTURIZER - No colors/sizes
      else if (name.includes('cream') || name.includes('moisturizer') || name.includes('gel')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Cream/Moisturizer' },
          { label: 'Skin Type', value: 'All Skin Types' },
          { label: 'Net Quantity', value: '50 g' },
          { label: 'Usage', value: 'Day & Night' },
        ];
      }
      
      // CLEANSER - No colors/sizes
      else if (name.includes('cleanser') || name.includes('face wash')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Cleanser' },
          { label: 'Skin Type', value: 'All Skin Types' },
          { label: 'Net Quantity', value: '150 ml' },
          { label: 'Usage', value: 'Morning & Evening' },
        ];
      }
      
      // TONER - No colors/sizes
      else if (name.includes('toner') || name.includes('mist')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Toner' },
          { label: 'Skin Type', value: 'All Skin Types' },
          { label: 'Net Quantity', value: '200 ml' },
          { label: 'Usage', value: 'After cleansing' },
        ];
      }
      
      // MASK - No colors/sizes
      else if (name.includes('mask')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Face Mask' },
          { label: 'Usage', value: '2-3 times per week' },
          { label: 'Duration', value: '15-20 minutes' },
        ];
      }
      
      // EYESHADOW/PALETTE - With color themes
      else if (name.includes('eyeshadow') || name.includes('palette')) {
        config.showColorSelector = false; // Palettes don't need individual color selection
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Eyeshadow Palette' },
          { label: 'Number of Shades', value: '12 colors' },
          { label: 'Finish', value: 'Matte & Shimmer' },
        ];
      }
      
      // MASCARA/EYELINER - No colors (or just Black)
      else if (name.includes('mascara') || name.includes('eyeliner')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: name.includes('mascara') ? 'Mascara' : 'Eyeliner' },
          { label: 'Color', value: 'Black' },
          { label: 'Waterproof', value: 'Yes' },
        ];
      }
      
      // EYEBROW PRODUCTS - No colors/sizes
      else if (name.includes('eyebrow') || name.includes('brow')) {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Eyebrow Product' },
          { label: 'Application', value: 'Easy to use' },
        ];
      }
      
      // POWDER/COMPACT - With shade options
      else if (name.includes('powder') || name.includes('compact')) {
        config.showColorSelector = true;
        config.availableColors = ['Light', 'Medium', 'Tan'];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Powder' },
          { label: 'Net Quantity', value: '10 g' },
        ];
      }
      
      // Default configuration for unknown types
      else {
        config.showColorSelector = false;
        config.availableColors = [];
        config.showSizeSelector = false;
        config.availableSizes = [];
        config.customFeatures = [
          { label: 'Type', value: 'Cosmetic Product' },
        ];
      }

      // Apply configuration
      product.pdpFeatures = config;
      await product.save();
      
      const features = [];
      if (config.showColorSelector) features.push('Colors');
      if (config.showSizeSelector) features.push('Sizes');
      if (config.customFeatures.length > 0) features.push(`${config.customFeatures.length} custom features`);
      
      console.log(`✅ Configured: ${product.name}`);
      console.log(`   Features: ${features.join(', ') || 'Standard'}`);
      configured++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Configured: ${configured} products`);
    console.log(`⏭️  Skipped: ${skipped} products (already configured)`);
    console.log(`📦 Total: ${allProducts.length} products`);
    console.log('\n🎉 PDP Features Auto-Configuration Complete!');
    console.log('\n💡 View any product page to see the new features in action.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the script
autoConfigurePDP();
