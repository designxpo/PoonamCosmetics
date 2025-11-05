// Quick script to check and create categories if needed
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Categories that should exist based on navigation
const requiredCategories = [
  {
    name: 'Cosmetics',
    slug: 'cosmetics',
    description: 'Makeup and beauty products including lipsticks, foundations, and more',
    isActive: true
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    description: 'Skincare products for face and body',
    isActive: true
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    description: 'Hair care products including shampoos, conditioners, and treatments',
    isActive: true
  },
  {
    name: 'Fragrance',
    slug: 'fragrance',
    description: 'Perfumes, deodorants, and body sprays',
    isActive: true
  }
];

async function setupCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Checking existing categories...\n');
    const existingCategories = await Category.find();
    
    console.log(`Found ${existingCategories.length} existing categories:`);
    existingCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) ${cat.isActive ? '✅ Active' : '❌ Inactive'}`);
    });

    console.log('\n🔧 Setting up required categories...\n');

    for (const categoryData of requiredCategories) {
      const existing = await Category.findOne({ slug: categoryData.slug });
      
      if (existing) {
        console.log(`✓ Category "${categoryData.name}" already exists`);
        
        // Update if inactive
        if (!existing.isActive) {
          existing.isActive = true;
          await existing.save();
          console.log(`  → Activated category "${categoryData.name}"`);
        }
      } else {
        const newCategory = new Category(categoryData);
        await newCategory.save();
        console.log(`✨ Created new category "${categoryData.name}"`);
      }
    }

    console.log('\n✅ Category setup complete!\n');
    console.log('📋 Final category list:');
    
    const allCategories = await Category.find({ isActive: true });
    console.log(`\nActive Categories (${allCategories.length}):`);
    allCategories.forEach(cat => {
      console.log(`  ${cat.name}`);
      console.log(`    - Slug: ${cat.slug}`);
      console.log(`    - URL: /category/${cat.slug}`);
      console.log(`    - ID: ${cat._id}\n`);
    });

    await mongoose.connection.close();
    console.log('✅ Done! You can now add products with these categories.\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupCategories();
