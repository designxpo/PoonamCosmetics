import mongoose from 'mongoose';

const BannerSettingsSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: ['bridal-hero', 'commitment', 'best-deals', 'homepage'],
    },
    textColor: {
      type: String,
      default: '#FFFFFF', // White
    },
    ctaBackgroundColor: {
      type: String,
      default: 'transparent',
    },
    ctaTextColor: {
      type: String,
      default: '#FFFFFF', // White
    },
    ctaBorderColor: {
      type: String,
      default: '#FFFFFF', // White
    },
    ctaHoverBackgroundColor: {
      type: String,
      default: '#FFFFFF', // White
    },
    ctaHoverTextColor: {
      type: String,
      default: '#000000', // Black
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BannerSettings = mongoose.models.BannerSettings || mongoose.model('BannerSettings', BannerSettingsSchema);

export default BannerSettings;
