/**
 * Interactive script to configure PDP features for a specific product
 * Run with: node scripts/configure-product-pdp.js
 */

const mongoose = require('mongoose');
const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function configureProduct() {
  try {
    console.log('='.repeat(60));
    console.log('   Product PDP Features Configuration Tool');
    console.log('='.repeat(60));
    console.log('\n');

    const MONGODB_URI = getMongoURI();
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Step 1: Find product
    const productSlug = await question(
      'Enter product slug (or "list" to see all products): '
    );

    if (productSlug.toLowerCase() === 'list') {
      const products = await Product.find({}).select('name slug category');
      console.log('\n=== Available Products ===');
      products.forEach((p) => {
        console.log(`  • ${p.name} (slug: ${p.slug})`);
      });
      console.log('\n');
      const newSlug = await question('Enter product slug to configure: ');
      return await configureProductBySlug(newSlug);
    }

    await configureProductBySlug(productSlug);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

async function configureProductBySlug(slug) {
  const product = await Product.findOne({ slug });

  if (!product) {
    console.log(`\n❌ Product with slug "${slug}" not found`);
    return;
  }

  console.log('\n=== Product Found ===');
  console.log(`Name: ${product.name}`);
  console.log(`Price: ₹${product.price}`);
  console.log(`Stock: ${product.stock}`);
  console.log('\n');

  // Show current configuration
  if (product.pdpFeatures) {
    console.log('Current PDP Features:');
    console.log(JSON.stringify(product.pdpFeatures, null, 2));
    console.log('\n');
  } else {
    console.log('⚠️  This product has no PDP features configured yet.\n');
  }

  const pdpFeatures = {};

  // Configure Color Selector
  const showColors = await question(
    'Enable color selector? (yes/no) [default: no]: '
  );
  pdpFeatures.showColorSelector = showColors.toLowerCase() === 'yes';

  if (pdpFeatures.showColorSelector) {
    console.log(
      '\nAvailable colors: Black, White, Red, Blue, Green, Brown, Pink, Purple, Orange, Yellow'
    );
    const colors = await question(
      'Enter colors (comma-separated, e.g., Red, Blue, Black): '
    );
    pdpFeatures.availableColors = colors
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c);
  } else {
    pdpFeatures.availableColors = [];
  }

  // Configure Size Selector
  const showSizes = await question(
    '\nEnable size selector? (yes/no) [default: no]: '
  );
  pdpFeatures.showSizeSelector = showSizes.toLowerCase() === 'yes';

  if (pdpFeatures.showSizeSelector) {
    console.log('\nExamples:');
    console.log('  Clothing: S, M, L, XL, XXL');
    console.log('  Liquids: 30ml, 50ml, 100ml, 200ml');
    console.log('  Shoes: 6, 7, 8, 9, 10, 11');
    const sizes = await question('Enter sizes (comma-separated): ');
    pdpFeatures.availableSizes = sizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
  } else {
    pdpFeatures.availableSizes = [];
  }

  // Configure Reviews
  const showReviews = await question(
    '\nShow reviews section? (yes/no) [default: yes]: '
  );
  pdpFeatures.showReviews = showReviews.toLowerCase() !== 'no';

  // Configure Social Share
  const showSocial = await question(
    'Show social sharing buttons? (yes/no) [default: yes]: '
  );
  pdpFeatures.showSocialShare = showSocial.toLowerCase() !== 'no';

  // Configure Additional Info
  const showAdditional = await question(
    'Show additional information tab? (yes/no) [default: yes]: '
  );
  pdpFeatures.showAdditionalInfo = showAdditional.toLowerCase() !== 'no';

  // Configure Custom Features
  pdpFeatures.customFeatures = [];
  const addCustom = await question(
    '\nAdd custom features (for additional info tab)? (yes/no): '
  );

  if (addCustom.toLowerCase() === 'yes') {
    console.log('\nEnter custom features (press Enter with empty label to finish):');
    while (true) {
      const label = await question('  Label: ');
      if (!label.trim()) break;

      const value = await question('  Value: ');
      pdpFeatures.customFeatures.push({ label, value });
      console.log('  ✅ Added\n');
    }
  }

  // Show summary
  console.log('\n' + '='.repeat(60));
  console.log('   Configuration Summary');
  console.log('='.repeat(60));
  console.log(JSON.stringify(pdpFeatures, null, 2));
  console.log('\n');

  const confirm = await question('Save this configuration? (yes/no): ');

  if (confirm.toLowerCase() === 'yes') {
    product.pdpFeatures = pdpFeatures;
    await product.save();
    console.log('\n✅ PDP features saved successfully!');
    console.log(`\nView product at: /products/${product.slug}`);
  } else {
    console.log('\n❌ Configuration cancelled');
  }
}

// Run the script
configureProduct();
