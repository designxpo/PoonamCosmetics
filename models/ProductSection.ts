import mongoose from 'mongoose';

export interface IProductSection extends mongoose.Document {
  name: string; // 'best-sellers', 'new-arrivals', 'sale'
  title: string;
  description?: string;
  productIds: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSectionSchema = new mongoose.Schema<IProductSection>(
  {
    name: {
      type: String,
      required: [true, 'Section name is required'],
      unique: true,
      enum: ['best-sellers', 'new-arrivals', 'sale', 'featured'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    productIds: [{
      type: String,
      trim: true,
    }],
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
productSectionSchema.index({ isActive: 1, order: 1 });
productSectionSchema.index({ name: 1 });

export default mongoose.models.ProductSection || 
  mongoose.model<IProductSection>('ProductSection', productSectionSchema);
