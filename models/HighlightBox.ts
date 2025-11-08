import mongoose from 'mongoose';

const HighlightBoxSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      default: 'from-pink-100 to-rose-100',
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

const HighlightBox = mongoose.models.HighlightBox || mongoose.model('HighlightBox', HighlightBoxSchema);

export default HighlightBox;
