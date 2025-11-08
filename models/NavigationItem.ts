import mongoose from 'mongoose';

const NavigationItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
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

const NavigationItem = mongoose.models.NavigationItem || mongoose.model('NavigationItem', NavigationItemSchema);

export default NavigationItem;
