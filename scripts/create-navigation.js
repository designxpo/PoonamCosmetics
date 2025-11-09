const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const NavigationItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const NavigationItem = mongoose.models.NavigationItem || mongoose.model('NavigationItem', NavigationItemSchema);

const navigationItems = [
  { label: 'Home', href: '/', order: 1, isActive: true },
  { label: 'Bridal', href: '/collection/bridal', order: 2, isActive: true },
  { label: 'Eye Shadow', href: '/category/eye-shadow', order: 3, isActive: true },
  { label: 'Eyeliner', href: '/category/eyeliner', order: 4, isActive: true },
  { label: 'Face Powder', href: '/category/face-powder', order: 5, isActive: true },
  { label: 'Foundation', href: '/category/foundation', order: 6, isActive: true },
  { label: 'Lipstick', href: '/category/lipstick', order: 7, isActive: true },
  { label: 'Blush', href: '/category/blush', order: 8, isActive: true },
];

async function createNavigation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing navigation items
    await NavigationItem.deleteMany({});
    console.log('🗑️  Cleared existing navigation items');

    // Create new navigation items
    const items = await NavigationItem.insertMany(navigationItems);
    console.log(`✅ Created ${items.length} navigation items:`);
    items.forEach(item => {
      console.log(`   - ${item.label} → ${item.href}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createNavigation();
