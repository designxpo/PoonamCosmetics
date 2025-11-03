import mongoose from 'mongoose';

export interface IFeaturedCollection extends mongoose.Document {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  backgroundColor?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const featuredCollectionSchema = new mongoose.Schema<IFeaturedCollection>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    link: {
      type: String,
      required: [true, 'Link is required'],
      trim: true,
    },
    backgroundColor: {
      type: String,
      default: 'slate-200',
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
featuredCollectionSchema.index({ isActive: 1, order: 1 });

export default mongoose.models.FeaturedCollection || 
  mongoose.model<IFeaturedCollection>('FeaturedCollection', featuredCollectionSchema);
