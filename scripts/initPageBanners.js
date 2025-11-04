const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const MONGODB_URI = envVars.MONGODB_URI;

const pageBannerSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['products', 'about', 'contact'],
    unique: true,
  },
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  backgroundImage: String,
  gradientFrom: {
    type: String,
    default: 'slate-900',
  },
  gradientVia: {
    type: String,
    default: 'slate-800',
  },
  gradientTo: {
    type: String,
    default: 'slate-900',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const PageBanner = mongoose.models.PageBanner || mongoose.model('PageBanner', pageBannerSchema);

const defaultBanners = [
  {
    page: 'products',
    eyebrow: 'Collections',
    title: 'Explore The Various Collection of Poonam',
    description: 'Discover our curated selection of premium beauty products designed for everyone. Find your perfect match from our extensive collection.',
    gradientFrom: 'slate-900',
    gradientVia: 'slate-800',
    gradientTo: 'slate-900',
    isActive: true,
  },
  {
    page: 'about',
    eyebrow: 'The Brand',
    title: 'Crafting Luxurious Beauty Rituals',
    description: 'We exist to empower every individual to feel runway-ready, every single day. Discover what makes Poonam Cosmetics the preferred choice for beauty enthusiasts.',
    gradientFrom: 'slate-900',
    gradientVia: 'slate-800',
    gradientTo: 'slate-900',
    isActive: true,
  },
  {
    page: 'contact',
    eyebrow: 'Contact',
    title: "Let's Create Beauty Moments Together",
    description: 'Reach out to our concierge team for personalized recommendations, order support, or brand collaborations.',
    gradientFrom: 'slate-900',
    gradientVia: 'slate-800',
    gradientTo: 'slate-900',
    isActive: true,
  },
];

async function initializePageBanners() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\nInitializing page banners...');
    
    for (const bannerData of defaultBanners) {
      const existing = await PageBanner.findOne({ page: bannerData.page });
      
      if (existing) {
        console.log(`✓ Banner for ${bannerData.page} page already exists`);
      } else {
        await PageBanner.create(bannerData);
        console.log(`✓ Created banner for ${bannerData.page} page`);
      }
    }

    console.log('\n=== Summary ===');
    const allBanners = await PageBanner.find({});
    console.log(`Total page banners: ${allBanners.length}`);
    
    allBanners.forEach(banner => {
      console.log(`- ${banner.page}: "${banner.title}" (${banner.isActive ? 'Active' : 'Inactive'})`);
    });

    console.log('\n✅ Page banners initialized successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

initializePageBanners();
