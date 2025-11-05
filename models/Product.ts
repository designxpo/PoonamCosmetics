import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  featured: boolean;
  isActive: boolean;
  // Review statistics
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  // PDP Feature Controls
  pdpFeatures?: {
    showColorSelector?: boolean;
    availableColors?: string[];
    showSizeSelector?: boolean;
    availableSizes?: string[];
    showReviews?: boolean;
    showSocialShare?: boolean;
    showAdditionalInfo?: boolean;
    customFeatures?: {
      label: string;
      value: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Review statistics (updated by review creation/update)
    reviewStats: {
      type: {
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        totalReviews: {
          type: Number,
          default: 0,
          min: 0,
        },
        distribution: {
          type: {
            5: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            1: { type: Number, default: 0 },
          },
          default: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
      default: {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    },
    // PDP Feature Controls
    pdpFeatures: {
      type: {
        showColorSelector: {
          type: Boolean,
          default: false,
        },
        availableColors: {
          type: [String],
          default: [],
        },
        showSizeSelector: {
          type: Boolean,
          default: false,
        },
        availableSizes: {
          type: [String],
          default: [],
        },
        showReviews: {
          type: Boolean,
          default: true,
        },
        showSocialShare: {
          type: Boolean,
          default: true,
        },
        showAdditionalInfo: {
          type: Boolean,
          default: true,
        },
        customFeatures: {
          type: [
            {
              label: String,
              value: String,
            },
          ],
          default: [],
        },
      },
      default: {
        showColorSelector: false,
        availableColors: [],
        showSizeSelector: false,
        availableSizes: [],
        showReviews: true,
        showSocialShare: true,
        showAdditionalInfo: true,
        customFeatures: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
