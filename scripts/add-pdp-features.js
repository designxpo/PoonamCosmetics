/**
 * Script to add PDP features to existing products
 * Run with: node scripts/add-pdp-features.js
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

// Configuration for different product types
const configurations = {
  // Cosmetics: Colors but no sizes
  cosmetics: {
    showColorSelector: true,
    availableColors: ['Red', 'Pink', 'Purple', 'Orange', 'Brown'],
    showSizeSelector: false,
    availableSizes: [],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: 'Type', value: 'Cosmetic' },
      { label: 'Net Quantity', value: '3.5 g' },
      { label: 'Shelf Life', value: '24 Months' },
    ],
  },

  // Skincare: No colors or sizes
  skincare: {
    showColorSelector: false,
    availableColors: [],
    showSizeSelector: false,
    availableSizes: [],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: 'Skin Type', value: 'All Skin Types' },
      { label: 'Net Quantity', value: '30 ml' },
      { label: 'Shelf Life', value: '12 Months' },
    ],
  },

  // Haircare: Sometimes with sizes (volumes)
  haircare: {
    showColorSelector: false,
    availableColors: [],
    showSizeSelector: true,
    availableSizes: ['100ml', '200ml', '500ml'],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: 'Hair Type', value: 'All Hair Types' },
      { label: 'Usage', value: 'Daily Use' },
    ],
  },

  // Fragrance: No colors or sizes (or size variants like 30ml, 50ml, 100ml)
  fragrance: {
    showColorSelector: false,
    availableColors: [],
    showSizeSelector: true,
    availableSizes: ['30ml', '50ml', '100ml'],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: 'Fragrance Type', value: 'Eau de Parfum' },
      { label: 'Shelf Life', value: '36 Months' },
    ],
  },

  // Clothing: Both colors and sizes
  clothing: {
    showColorSelector: true,
    availableColors: ['Black', 'White', 'Red', 'Blue', 'Green'],
    showSizeSelector: true,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: 'Material', value: '100% Cotton' },
      { label: 'Fit', value: 'Regular Fit' },
      { label: 'Care Instructions', value: 'Machine wash cold' },
    ],
  },
};

async function addPDPFeatures() {
  try {
    console.log('Connecting to MongoDB...');
    const MONGODB_URI = getMongoURI();
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Get category IDs - Update these with your actual category IDs
    const categories = {
      cosmetics: '690b1bf1013ede022f8ac2cc',
      skincare: '690b1bf1013ede022f8ac2ce',
      haircare: '690b1bf1013ede022f8ac2d0',
      fragrance: '690b1bf1013ede022f8ac2d3',
    };

    // Update products by category
    for (const [type, categoryId] of Object.entries(categories)) {
      console.log(`\n=== Updating ${type.toUpperCase()} products ===`);

      const products = await Product.find({ category: categoryId });
      console.log(`Found ${products.length} products in ${type} category`);

      if (products.length === 0) {
        console.log(`No products found for ${type}`);
        continue;
      }

      for (const product of products) {
        // Check if product already has pdpFeatures
        if (product.pdpFeatures) {
          console.log(`  ⚠️  ${product.name} already has PDP features - skipping`);
          continue;
        }

        // Add PDP features
        product.pdpFeatures = configurations[type];

        await product.save();
        console.log(`  ✅ Updated: ${product.name}`);
      }
    }

    console.log('\n=== Summary ===');
    const totalProducts = await Product.countDocuments();
    const productsWithFeatures = await Product.countDocuments({
      pdpFeatures: { $exists: true },
    });

    console.log(`Total products: ${totalProducts}`);
    console.log(`Products with PDP features: ${productsWithFeatures}`);
    console.log(
      `Products without PDP features: ${totalProducts - productsWithFeatures}`
    );

    console.log('\n✅ PDP features added successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
addPDPFeatures();
