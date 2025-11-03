import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISettings extends Document {
  whatsappNumber: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  banners: {
    image: string;
    title?: string;
    subtitle?: string;
    link?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    whatsappNumber: {
      type: String,
      required: true,
      default: '919999999999',
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      required: true,
      default: 999,
      min: 0,
    },
    banners: [
      {
        image: { type: String, required: true },
        title: String,
        subtitle: String,
        link: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
