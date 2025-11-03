const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/poonam-cosmetics';

// Schemas
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  stock: Number,
  featured: Boolean,
}, { timestamps: true });

const settingsSchema = new mongoose.Schema({
  whatsappNumber: String,
  deliveryCharge: Number,
  freeDeliveryThreshold: Number,
  banners: [{
    image: String,
    link: String,
    alt: String,
  }],
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Lipsticks',
        slug: 'lipsticks',
        description: 'Bold and beautiful lipsticks in various shades',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
      },
      {
        name: 'Face Creams',
        slug: 'face-creams',
        description: 'Nourishing face creams for radiant skin',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
      },
      {
        name: 'Eye Makeup',
        slug: 'eye-makeup',
        description: 'Eye shadows, liners, and mascaras',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop',
      },
      {
        name: 'Foundation',
        slug: 'foundation',
        description: 'Perfect base for flawless makeup',
        image: 'https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=400&h=300&fit=crop',
      },
      {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Complete skincare solutions',
        image: 'https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=400&h=300&fit=crop',
      },
      {
        name: 'Nail Polish',
        slug: 'nail-polish',
        description: 'Vibrant colors for beautiful nails',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Products
    const products = [
      // Lipsticks (8 products)
      {
        name: 'Velvet Matte Lipstick - Ruby Red',
        slug: 'velvet-matte-lipstick-ruby-red',
        description: 'Luxurious velvet matte finish in classic ruby red. Long-lasting formula enriched with vitamin E for soft, supple lips. Perfect for evening glamour and special occasions.',
        price: 399,
        category: categories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop'
        ],
        stock: 50,
        featured: true,
      },
      {
        name: 'Nude Pink Lipstick - Soft Blush',
        slug: 'nude-pink-lipstick-soft-blush',
        description: 'Everyday nude pink shade with satin finish. Lightweight formula that glides on smoothly. Ideal for office and casual outings.',
        price: 349,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 65,
        featured: true,
      },
      {
        name: 'Berry Wine Lipstick - Deep Plum',
        slug: 'berry-wine-lipstick-deep-plum',
        description: 'Rich berry wine shade with intense color payoff. Moisturizing formula that lasts up to 8 hours. Perfect for bold, statement looks.',
        price: 379,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop'],
        stock: 30,
        featured: false,
      },
      {
        name: 'Coral Breeze Lipstick',
        slug: 'coral-breeze-lipstick',
        description: 'Beautiful coral shade with creamy texture. Infused with shea butter for all-day hydration. Great for summer and spring looks.',
        price: 329,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 40,
        featured: false,
      },
      {
        name: 'Mauve Dream Lipstick',
        slug: 'mauve-dream-lipstick',
        description: 'Trendy mauve shade with semi-matte finish. Long-wearing and comfortable formula. Perfect for modern, chic makeup looks.',
        price: 359,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop'],
        stock: 45,
        featured: true,
      },
      {
        name: 'Peach Glow Lipstick',
        slug: 'peach-glow-lipstick',
        description: 'Soft peach shade with luminous finish. Vitamin-enriched formula that nourishes lips. Ideal for fresh, natural makeup.',
        price: 339,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'Crimson Kiss Liquid Lipstick',
        slug: 'crimson-kiss-liquid-lipstick',
        description: 'Ultra-pigmented liquid lipstick in stunning crimson. Transfer-proof and smudge-resistant. Lasts through meals and drinks.',
        price: 449,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop'],
        stock: 35,
        featured: true,
      },
      {
        name: 'Rose Petal Lipstick',
        slug: 'rose-petal-lipstick',
        description: 'Delicate rose shade with glossy finish. Hydrating formula with rose oil. Perfect for romantic and feminine looks.',
        price: 369,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 48,
        featured: false,
      },

      // Face Creams (7 products)
      {
        name: 'Radiance Hydrating Day Cream SPF 30',
        slug: 'radiance-hydrating-day-cream-spf30',
        description: 'Premium day cream with SPF 30 protection and intense hydration. Enriched with hyaluronic acid and vitamin E. Keeps skin plump, moisturized and protected all day.',
        price: 699,
        category: categories[1]._id,
        images: [
          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'
        ],
        stock: 35,
        featured: true,
      },
      {
        name: 'Overnight Repair Night Cream',
        slug: 'overnight-repair-night-cream',
        description: 'Intensive repair cream that works while you sleep. Contains retinol and peptides for skin renewal. Wake up to smoother, firmer skin.',
        price: 799,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 28,
        featured: true,
      },
      {
        name: 'Anti-Aging Collagen Boost Cream',
        slug: 'anti-aging-collagen-boost-cream',
        description: 'Advanced anti-aging formula with marine collagen. Reduces fine lines, wrinkles and age spots. For youthful, radiant skin.',
        price: 999,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'],
        stock: 20,
        featured: true,
      },
      {
        name: 'Brightening Vitamin C Cream',
        slug: 'brightening-vitamin-c-cream',
        description: 'Powerful vitamin C formula for even skin tone. Fades dark spots and brightens complexion. Suitable for all skin types.',
        price: 749,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 42,
        featured: false,
      },
      {
        name: 'Soothing Aloe Gel Cream',
        slug: 'soothing-aloe-gel-cream',
        description: 'Light gel cream with 95% pure aloe vera. Calms irritated skin and provides instant hydration. Perfect for sensitive skin.',
        price: 549,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'],
        stock: 60,
        featured: false,
      },
      {
        name: 'Niacinamide Pore Refining Cream',
        slug: 'niacinamide-pore-refining-cream',
        description: 'Oil-control cream with niacinamide. Minimizes pores and controls sebum. Ideal for oily and combination skin.',
        price: 649,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 38,
        featured: false,
      },
      {
        name: 'Ceramide Barrier Repair Cream',
        slug: 'ceramide-barrier-repair-cream',
        description: 'Strengthens skin barrier with ceramide complex. Locks in moisture and protects from environmental damage. For dry, damaged skin.',
        price: 849,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'],
        stock: 25,
        featured: false,
      },

      // Eye Makeup (6 products)
      {
        name: 'Luxe Eye Shadow Palette - Smokey Nights',
        slug: 'luxe-eye-shadow-palette-smokey-nights',
        description: '16-shade professional palette with mix of matte and shimmer finishes. Highly pigmented and blendable. Perfect for creating stunning smokey eye looks.',
        price: 999,
        category: categories[2]._id,
        images: [
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1583241800698-2d9e9328d6e7?w=600&h=600&fit=crop'
        ],
        stock: 25,
        featured: true,
      },
      {
        name: 'Volume Boost Waterproof Mascara',
        slug: 'volume-boost-waterproof-mascara',
        description: 'Ultra-black waterproof mascara for dramatic volume and length. Smudge-proof formula that lasts all day. Volumizing brush for clump-free lashes.',
        price: 449,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 70,
        featured: true,
      },
      {
        name: 'Precision Gel Eyeliner - Jet Black',
        slug: 'precision-gel-eyeliner-jet-black',
        description: 'Creamy gel eyeliner with precision brush. Long-lasting, waterproof formula. Creates sharp wings and perfect lines effortlessly.',
        price: 399,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1583241800698-2d9e9328d6e7?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'Nude Glow Eye Shadow Palette',
        slug: 'nude-glow-eye-shadow-palette',
        description: '10 neutral shades for everyday looks. Buttery-soft texture that blends seamlessly. From office to evening wear.',
        price: 799,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 40,
        featured: false,
      },
      {
        name: 'Curl & Define Mascara',
        slug: 'curl-define-mascara',
        description: 'Lengthening mascara with curved brush. Lifts and curls lashes naturally. Buildable formula for customizable look.',
        price: 399,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1583241800698-2d9e9328d6e7?w=600&h=600&fit=crop'],
        stock: 65,
        featured: false,
      },
      {
        name: 'Eyebrow Sculpting Pencil',
        slug: 'eyebrow-sculpting-pencil',
        description: 'Define and fill brows with this dual-ended pencil. Spoolie brush for natural finish. Long-wearing, smudge-resistant formula.',
        price: 299,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 80,
        featured: false,
      },

      // Foundation (6 products)
      {
        name: 'Flawless Finish Liquid Foundation - Porcelain',
        slug: 'flawless-finish-liquid-foundation-porcelain',
        description: 'Full coverage liquid foundation for porcelain skin tones. Buildable, natural finish that lasts 12+ hours. SPF 15 protection included.',
        price: 749,
        category: categories[3]._id,
        images: [
          'https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&h=600&fit=crop'
        ],
        stock: 30,
        featured: true,
      },
      {
        name: 'Flawless Finish Liquid Foundation - Beige',
        slug: 'flawless-finish-liquid-foundation-beige',
        description: 'Medium coverage foundation for beige skin tones. Oil-free, lightweight formula. Perfect for everyday wear.',
        price: 749,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 45,
        featured: true,
      },
      {
        name: 'Flawless Finish Liquid Foundation - Honey',
        slug: 'flawless-finish-liquid-foundation-honey',
        description: 'Radiant coverage for honey skin tones. Hydrating formula with a natural glow. Won\'t cake or oxidize.',
        price: 749,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&h=600&fit=crop'],
        stock: 42,
        featured: false,
      },
      {
        name: 'Silk Touch Compact Powder',
        slug: 'silk-touch-compact-powder',
        description: 'Silky-smooth pressed powder for touch-ups. Controls shine and sets makeup. Comes with mirror and applicator puff.',
        price: 499,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'HD Airbrush Foundation Stick',
        slug: 'hd-airbrush-foundation-stick',
        description: 'Cream-to-powder stick foundation. Full coverage with weightless feel. Blend with sponge for airbrushed finish.',
        price: 649,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&h=600&fit=crop'],
        stock: 38,
        featured: false,
      },
      {
        name: 'Mineral Loose Powder Foundation',
        slug: 'mineral-loose-powder-foundation',
        description: 'Lightweight mineral powder foundation. Buildable coverage that looks natural. Suitable for sensitive skin.',
        price: 599,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 32,
        featured: false,
      },

      // Skincare (8 products)
      {
        name: 'Pure Glow Vitamin C Serum',
        slug: 'pure-glow-vitamin-c-serum',
        description: '20% pure vitamin C serum for radiant, youthful skin. Brightens dark spots and evens skin tone. Antioxidant-rich formula fights free radicals.',
        price: 1099,
        category: categories[4]._id,
        images: [
          'https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'
        ],
        stock: 30,
        featured: true,
      },
      {
        name: 'Deep Hydration Hyaluronic Serum',
        slug: 'deep-hydration-hyaluronic-serum',
        description: 'Multi-molecular hyaluronic acid for deep hydration. Plumps skin and reduces fine lines. Lightweight, fast-absorbing formula.',
        price: 899,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 40,
        featured: true,
      },
      {
        name: 'Gentle Foam Face Cleanser',
        slug: 'gentle-foam-face-cleanser',
        description: 'pH-balanced cleansing foam for all skin types. Removes makeup and impurities without stripping. Leaves skin soft and refreshed.',
        price: 449,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'],
        stock: 70,
        featured: false,
      },
      {
        name: 'Rose Water Toner Mist',
        slug: 'rose-water-toner-mist',
        description: 'Refreshing rose water toner spray. Balances skin pH and tightens pores. Use after cleansing or as a makeup setting spray.',
        price: 399,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'Exfoliating AHA BHA Toner',
        slug: 'exfoliating-aha-bha-toner',
        description: 'Chemical exfoliant with AHA and BHA. Unclogs pores and smooths skin texture. Use 2-3 times weekly for best results.',
        price: 649,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'],
        stock: 35,
        featured: true,
      },
      {
        name: 'Retinol Night Serum',
        slug: 'retinol-night-serum',
        description: '0.5% retinol serum for anti-aging benefits. Reduces wrinkles and improves skin texture. Start with 2x per week.',
        price: 1299,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 25,
        featured: true,
      },
      {
        name: 'Niacinamide Pore Treatment Serum',
        slug: 'niacinamide-pore-treatment-serum',
        description: '10% niacinamide serum for pore minimizing. Controls oil production and improves skin clarity. Great for acne-prone skin.',
        price: 749,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'],
        stock: 45,
        featured: false,
      },
      {
        name: 'Hydrating Sheet Mask Set (5 Pack)',
        slug: 'hydrating-sheet-mask-set-5-pack',
        description: 'Pack of 5 essence-soaked sheet masks. Intensive hydration and nourishment. Use weekly for spa-like treatment at home.',
        price: 599,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 60,
        featured: false,
      },

      // Nail Polish (6 products)
      {
        name: 'Classic Ruby Red Nail Lacquer',
        slug: 'classic-ruby-red-nail-lacquer',
        description: 'Timeless ruby red shade with high-shine finish. Chip-resistant formula lasts up to 7 days. One-coat coverage.',
        price: 249,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 80,
        featured: false,
      },
      {
        name: 'French Manicure Duo Kit',
        slug: 'french-manicure-duo-kit',
        description: 'Complete kit for classic French manicure. Includes nude base and white tip polish. Precision brush for perfect application.',
        price: 499,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 40,
        featured: true,
      },
      {
        name: 'Rose Gold Glitter Polish',
        slug: 'rose-gold-glitter-polish',
        description: 'Dazzling rose gold glitter for special occasions. Layer over any color for sparkly finish. Party-perfect nails.',
        price: 299,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'Nude Pink Nail Polish',
        slug: 'nude-pink-nail-polish',
        description: 'Elegant nude pink for professional look. Creamy formula with glossy finish. Perfect for office wear.',
        price: 229,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 70,
        featured: false,
      },
      {
        name: 'Midnight Blue Nail Lacquer',
        slug: 'midnight-blue-nail-lacquer',
        description: 'Deep midnight blue with subtle shimmer. Rich, luxurious color for evening wear. Long-lasting formula.',
        price: 269,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 45,
        featured: false,
      },
      {
        name: 'Top Coat & Base Coat Set',
        slug: 'top-coat-base-coat-set',
        description: 'Essential duo for long-lasting manicure. Base coat protects nails, top coat adds shine and prevents chips. Must-have combo.',
        price: 449,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 60,
        featured: true,
      },

      // Additional Lipsticks (5 more)
      {
        name: 'Classic Red Matte Lipstick',
        slug: 'classic-red-matte-lipstick',
        description: 'Iconic red shade with velvety matte finish. Bold and timeless color that suits every skin tone. Transfer-proof formula.',
        price: 429,
        category: categories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1631214524020-7e18db7a8f0c?w=600&h=600&fit=crop'
        ],
        stock: 55,
        featured: true,
      },
      {
        name: 'Berry Bliss Liquid Lipstick',
        slug: 'berry-bliss-liquid-lipstick',
        description: 'Rich berry shade with intense color payoff. Lightweight liquid formula that doesn\'t dry lips. Lasts up to 12 hours.',
        price: 459,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 40,
        featured: false,
      },
      {
        name: 'Nude Beige Satin Lipstick',
        slug: 'nude-beige-satin-lipstick',
        description: 'Perfect everyday nude with satin finish. Natural-looking shade that enhances your lips. Moisturizing formula with shea butter.',
        price: 379,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 65,
        featured: false,
      },
      {
        name: 'Pink Champagne Shimmer Lipstick',
        slug: 'pink-champagne-shimmer-lipstick',
        description: 'Delicate pink with golden shimmer. Perfect for romantic occasions and parties. Creamy formula with vitamin E.',
        price: 419,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 50,
        featured: true,
      },
      {
        name: 'Chocolate Brown Matte Lipstick',
        slug: 'chocolate-brown-matte-lipstick',
        description: 'Deep chocolate brown for sophisticated look. Warm undertones complement medium to deep skin tones. Long-wearing matte finish.',
        price: 389,
        category: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
        stock: 35,
        featured: false,
      },

      // Additional Face Creams (4 more)
      {
        name: 'Snail Mucin Recovery Cream',
        slug: 'snail-mucin-recovery-cream',
        description: 'Intensive recovery cream with 92% snail mucin. Repairs damaged skin and reduces fine lines. Korean beauty innovation.',
        price: 899,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 30,
        featured: true,
      },
      {
        name: 'Rose Water Gel Moisturizer',
        slug: 'rose-water-gel-moisturizer',
        description: 'Lightweight gel cream infused with real rose water. Instantly hydrates without greasiness. Perfect for oily to combination skin.',
        price: 599,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'Peptide Complex Anti-Wrinkle Cream',
        slug: 'peptide-complex-anti-wrinkle-cream',
        description: 'Advanced peptide formula targets deep wrinkles. Firms and lifts skin while improving texture. Dermatologist recommended.',
        price: 1099,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 25,
        featured: true,
      },
      {
        name: 'Tea Tree Oil Control Cream',
        slug: 'tea-tree-oil-control-cream',
        description: 'Controls excess oil with tea tree extract. Minimizes pores and prevents breakouts. Mattifying effect lasts all day.',
        price: 649,
        category: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
        stock: 45,
        featured: false,
      },

      // Additional Eye Makeup (5 more)
      {
        name: 'Waterproof Liquid Eyeliner - Jet Black',
        slug: 'waterproof-liquid-eyeliner-jet-black',
        description: 'Ultra-precise felt tip for perfect winged liner. Smudge-proof and waterproof formula lasts 24 hours. Deep black pigment.',
        price: 349,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 70,
        featured: false,
      },
      {
        name: 'Lengthening Fiber Mascara',
        slug: 'lengthening-fiber-mascara',
        description: 'Dramatic length with nylon fibers. Buildable formula for custom volume. Ophthalmologist tested, safe for contacts.',
        price: 489,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 60,
        featured: true,
      },
      {
        name: 'Sunset Glow Eyeshadow Palette',
        slug: 'sunset-glow-eyeshadow-palette',
        description: '12 warm-toned shades from peachy nudes to burnt oranges. Buttery texture blends seamlessly. Mix of matte and shimmer finishes.',
        price: 899,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 35,
        featured: true,
      },
      {
        name: 'Chocolate Bar Eyeshadow Palette',
        slug: 'chocolate-bar-eyeshadow-palette',
        description: '16 cocoa-inspired shades from cream to espresso. Delicious cocoa scent. Highly pigmented and blendable.',
        price: 1099,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 28,
        featured: true,
      },
      {
        name: 'Waterproof Eyebrow Pomade',
        slug: 'waterproof-eyebrow-pomade',
        description: 'Creamy pomade for defined brows. Available in 5 shades. Includes dual-ended brush. Stays put all day.',
        price: 429,
        category: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },

      // Additional Foundation (5 more)
      {
        name: 'Dewy Finish Liquid Foundation - Fair',
        slug: 'dewy-finish-liquid-foundation-fair',
        description: 'Luminous finish for glowing skin. Light to medium coverage. Hydrating formula with hyaluronic acid. SPF 15 protection.',
        price: 729,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 40,
        featured: false,
      },
      {
        name: 'Full Coverage Cream Foundation - Medium',
        slug: 'full-coverage-cream-foundation-medium',
        description: 'Professional grade full coverage. Conceals imperfections perfectly. Long-lasting 16-hour wear. Transfer-resistant.',
        price: 849,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 35,
        featured: true,
      },
      {
        name: 'BB Cream SPF 30 - Light',
        slug: 'bb-cream-spf-30-light',
        description: 'All-in-one beauty balm with skincare benefits. Evens skin tone, hydrates, and protects. Perfect for daily wear.',
        price: 599,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 65,
        featured: false,
      },
      {
        name: 'Cushion Foundation - Natural Beige',
        slug: 'cushion-foundation-natural-beige',
        description: 'Korean cushion foundation with air cushion puff. Fresh dewy finish. Portable and easy to apply. SPF 50+ PA+++.',
        price: 949,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 30,
        featured: true,
      },
      {
        name: 'Matte Mousse Foundation - Tan',
        slug: 'matte-mousse-foundation-tan',
        description: 'Whipped mousse texture for airbrushed finish. Controls oil for up to 12 hours. Buildable medium to full coverage.',
        price: 679,
        category: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1590393782899-63f5e2d3d053?w=600&h=600&fit=crop'],
        stock: 45,
        featured: false,
      },

      // Additional Skincare (6 more)
      {
        name: 'Salicylic Acid BHA Exfoliant 2%',
        slug: 'salicylic-acid-bha-exfoliant-2-percent',
        description: 'Unclogs pores and reduces blackheads. Gentle exfoliation for clearer skin. Perfect for acne-prone skin.',
        price: 799,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 50,
        featured: true,
      },
      {
        name: 'Centella Asiatica Soothing Ampoule',
        slug: 'centella-asiatica-soothing-ampoule',
        description: 'Calms irritated and sensitive skin. 100% centella extract. Reduces redness and strengthens skin barrier.',
        price: 899,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 35,
        featured: false,
      },
      {
        name: 'Glycolic Acid Night Peel 10%',
        slug: 'glycolic-acid-night-peel-10-percent',
        description: 'Professional strength AHA peel for home use. Reveals brighter, smoother skin overnight. Use 2-3 times weekly.',
        price: 1199,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 25,
        featured: true,
      },
      {
        name: 'Green Tea Antioxidant Essence',
        slug: 'green-tea-antioxidant-essence',
        description: 'Protects skin from environmental damage. Rich in antioxidants. Refreshing and hydrating. Suitable for all skin types.',
        price: 699,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 60,
        featured: false,
      },
      {
        name: 'Collagen Boosting Eye Cream',
        slug: 'collagen-boosting-eye-cream',
        description: 'Targets fine lines and dark circles. Peptide complex firms delicate eye area. Lightweight, fast-absorbing formula.',
        price: 849,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 40,
        featured: true,
      },
      {
        name: 'Charcoal Detox Peel-Off Mask',
        slug: 'charcoal-detox-peel-off-mask',
        description: 'Activated charcoal draws out impurities. Removes blackheads and unclogs pores. Instant purifying effect.',
        price: 549,
        category: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1556228852-80a5f6a6d4d8?w=600&h=600&fit=crop'],
        stock: 70,
        featured: false,
      },

      // Additional Nail Polish (5 more)
      {
        name: 'Coral Sunset Nail Polish',
        slug: 'coral-sunset-nail-polish',
        description: 'Vibrant coral perfect for summer. High-shine finish. Quick-drying formula. Chip-resistant for up to 7 days.',
        price: 249,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 80,
        featured: false,
      },
      {
        name: 'Chrome Silver Metallic Polish',
        slug: 'chrome-silver-metallic-polish',
        description: 'Ultra-shiny chrome effect. Futuristic metallic finish. No UV lamp needed. Long-lasting brilliant shine.',
        price: 329,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 45,
        featured: true,
      },
      {
        name: 'Black Cherry Gel Polish',
        slug: 'black-cherry-gel-polish',
        description: 'Deep vampy shade for dramatic nails. Gel-like shine without UV lamp. Rich, luxurious color. Professional finish.',
        price: 289,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 55,
        featured: false,
      },
      {
        name: 'Pastel Rainbow Nail Set - 6 Colors',
        slug: 'pastel-rainbow-nail-set-6-colors',
        description: 'Collection of 6 dreamy pastel shades. Perfect for mix-and-match nail art. Creamy, opaque formula. Spring/summer essential.',
        price: 599,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 40,
        featured: true,
      },
      {
        name: 'Matte Top Coat',
        slug: 'matte-top-coat',
        description: 'Transform any polish into matte finish. Velvety smooth texture. Quick-drying. Extends wear of regular polish.',
        price: 279,
        category: categories[5]._id,
        images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop'],
        stock: 65,
        featured: false,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    // Create Settings
    await Settings.create({
      whatsappNumber: '919876543210',
      deliveryCharge: 50,
      freeDeliveryThreshold: 999,
      banners: [],
    });
    console.log('✅ Created default settings');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${products.length} products`);
    console.log(`   - 1 settings document`);
    console.log(`\n🌐 Visit http://localhost:3000 to see your products!`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDatabase();
