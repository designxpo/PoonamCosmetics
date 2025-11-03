import mongoose from 'mongoose';

export interface IBanner extends mongoose.Document {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  textPosition: 'left' | 'center' | 'right';
  textColor: 'light' | 'dark';
  overlay: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    ctaText: {
      type: String,
      trim: true,
    },
    ctaLink: {
      type: String,
      trim: true,
    },
    textPosition: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left',
    },
    textColor: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bannerSchema.index({ isActive: 1, order: 1 });

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);
