import mongoose from 'mongoose';

export interface IPageBanner extends mongoose.Document {
  page: 'products' | 'about' | 'contact';
  eyebrow: string; // Small text above title (e.g., "Collections", "The Brand")
  title: string;
  description: string;
  backgroundImage?: string; // Optional: can use image instead of gradient
  gradientFrom: string; // Default: slate-900
  gradientVia: string; // Default: slate-800
  gradientTo: string; // Default: slate-900
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pageBannerSchema = new mongoose.Schema<IPageBanner>(
  {
    page: {
      type: String,
      required: [true, 'Page is required'],
      enum: ['products', 'about', 'contact'],
      unique: true, // Only one banner per page
    },
    eyebrow: {
      type: String,
      required: [true, 'Eyebrow text is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    backgroundImage: {
      type: String,
      trim: true,
    },
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PageBanner || mongoose.model<IPageBanner>('PageBanner', pageBannerSchema);
