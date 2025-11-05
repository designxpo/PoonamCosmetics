const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Review Schema (matching the model)
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminResponse: {
      type: {
        message: String,
        respondedAt: Date,
      },
      default: null,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedReviews() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all products
    const products = await db.collection('products').find({}).toArray();
    console.log(`📦 Found ${products.length} products\n`);

    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      process.exit(1);
    }

    // Create sample users for reviews
    console.log('👥 Creating sample review users...');

    const reviewUsers = [
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      },
      {
        name: 'Anjali Patel',
        email: 'anjali.patel@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      },
      {
        name: 'Riya Gupta',
        email: 'riya.gupta@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      },
      {
        name: 'Kavya Singh',
        email: 'kavya.singh@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      },
    ];

    // Insert users (skip if already exist)
    const insertedUsers = [];
    for (const userData of reviewUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        insertedUsers.push(existingUser);
      } else {
        const newUser = await User.create(userData);
        insertedUsers.push(newUser);
      }
    }
    console.log(`✅ ${insertedUsers.length} review users ready\n`);

    // Delete existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews\n');

    // Sample reviews data
    const reviewTemplates = [
      {
        rating: 5,
        title: 'Absolutely love this product!',
        comment:
          'This product exceeded my expectations. The quality is amazing and it lasts all day. Highly recommend to everyone!',
        verified: true,
      },
      {
        rating: 4,
        title: 'Great product, worth the price',
        comment:
          'Really happy with this purchase. The product quality is good and packaging was excellent. Will buy again.',
        verified: true,
      },
      {
        rating: 5,
        title: 'Perfect for daily use',
        comment:
          'Using this daily and loving it. The texture is smooth and it blends perfectly. Best purchase ever!',
        verified: true,
      },
      {
        rating: 4,
        title: 'Good quality product',
        comment:
          'Nice product overall. The color is exactly as shown in pictures. Delivery was fast too.',
        verified: false,
      },
      {
        rating: 3,
        title: 'Decent but could be better',
        comment:
          'It\'s an okay product. Does the job but I expected a bit more. Still worth trying.',
        verified: true,
      },
      {
        rating: 5,
        title: 'My go-to product now!',
        comment:
          'I have repurchased this multiple times. The staying power is incredible and it doesn\'t feel heavy.',
        verified: true,
      },
      {
        rating: 4,
        title: 'Satisfied with the purchase',
        comment:
          'Good value for money. The product is long-lasting and the shade is beautiful.',
        verified: true,
      },
      {
        rating: 5,
        title: 'Highly recommended!',
        comment:
          'Best product in this price range. The quality matches premium brands. Must try!',
        verified: false,
      },
    ];

    // Create reviews for each product (2-3 reviews per product)
    const reviews = [];
    let reviewCount = 0;

    for (const product of products) {
      // Randomly assign 2-4 reviews per product
      const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews

      for (let i = 0; i < numReviews && reviewCount < reviewTemplates.length * products.length; i++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        const user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];

        // Check if this user already reviewed this product
        const existingReview = reviews.find(
          (r) => r.product.toString() === product._id.toString() && r.user.toString() === user._id.toString()
        );

        if (!existingReview) {
          reviews.push({
            product: product._id,
            user: user._id,
            rating: template.rating,
            title: template.title,
            comment: template.comment,
            verified: template.verified,
            helpful: Math.floor(Math.random() * 15), // 0-14 helpful votes
            status: 'approved', // Auto-approve for demo
            helpfulBy: [],
          });
          reviewCount++;
        }
      }
    }

    // Insert reviews
    const insertedReviews = await Review.insertMany(reviews);
    console.log(`✅ ${insertedReviews.length} reviews created\n`);

    // Update product review stats
    console.log('📊 Updating product review statistics...');
    for (const product of products) {
      const productReviews = insertedReviews.filter(
        (r) => r.product.toString() === product._id.toString()
      );

      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / productReviews.length;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        productReviews.forEach((r) => {
          distribution[r.rating]++;
        });

        await db.collection('products').updateOne(
          { _id: product._id },
          {
            $set: {
              reviewStats: {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: productReviews.length,
                distribution,
              },
            },
          }
        );
      }
    }
    console.log('✅ Product review statistics updated\n');

    // Display summary
    console.log('═══════════════════════════════════════════');
    console.log('📊 REVIEW SEEDING SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`✅ Total Reviews Created: ${insertedReviews.length}`);
    console.log(`👥 Review Users: ${insertedUsers.length}`);
    console.log(`📦 Products Reviewed: ${products.length}`);
    console.log(`⭐ Average Rating: ${(insertedReviews.reduce((sum, r) => sum + r.rating, 0) / insertedReviews.length).toFixed(1)}`);

    const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    insertedReviews.forEach((r) => {
      ratingDist[r.rating]++;
    });
    console.log('\n⭐ Rating Distribution:');
    console.log(`   5 stars: ${ratingDist[5]} reviews`);
    console.log(`   4 stars: ${ratingDist[4]} reviews`);
    console.log(`   3 stars: ${ratingDist[3]} reviews`);
    console.log(`   2 stars: ${ratingDist[2]} reviews`);
    console.log(`   1 star: ${ratingDist[1]} reviews`);

    console.log('\n👥 Sample Review Users:');
    insertedUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    console.log('\n═══════════════════════════════════════════\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    console.log('✅ Review seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedReviews();
