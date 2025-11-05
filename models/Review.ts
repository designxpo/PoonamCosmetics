import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  verified: boolean; // Verified purchase
  helpful: number; // Helpful votes count
  helpfulBy: mongoose.Types.ObjectId[]; // Users who marked as helpful
  images?: string[]; // User uploaded images
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    message: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    helpfulBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 5;
        },
        message: 'Maximum 5 images allowed per review',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminResponse: {
      type: {
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: [500, 'Admin response cannot exceed 500 characters'],
        },
        respondedAt: {
          type: Date,
          default: Date.now,
        },
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for one review per user per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for querying approved reviews
ReviewSchema.index({ product: 1, status: 1, createdAt: -1 });

// Virtual for rating stars display
ReviewSchema.virtual('starsDisplay').get(function (this: IReview) {
  return '⭐'.repeat(this.rating);
});

// Static method to calculate product average rating
ReviewSchema.statics.calculateProductRating = async function (
  productId: mongoose.Types.ObjectId
) {
  const stats = await this.aggregate([
    {
      $match: {
        product: productId,
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating',
        },
      },
    },
  ]);

  if (stats.length > 0) {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    stats[0].ratingDistribution.forEach((rating: number) => {
      distribution[rating as keyof typeof distribution]++;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      distribution,
    };
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
};

// Method to mark review as helpful
ReviewSchema.methods.markHelpful = async function (
  userId: mongoose.Types.ObjectId
) {
  if (!this.helpfulBy.includes(userId)) {
    this.helpfulBy.push(userId);
    this.helpful = this.helpfulBy.length;
    await this.save();
  }
};

// Method to unmark review as helpful
ReviewSchema.methods.unmarkHelpful = async function (
  userId: mongoose.Types.ObjectId
) {
  this.helpfulBy = this.helpfulBy.filter(
    (id: mongoose.Types.ObjectId) => !id.equals(userId)
  );
  this.helpful = this.helpfulBy.length;
  await this.save();
};

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
