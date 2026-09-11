import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  key: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  isFreeDeliveryActive: boolean;
  minOrderAmount: number;
  expressDeliveryMins: string;
  deliveryNotice?: string;
  googleRating: number;
  googleReviewsCount: string;
  googleReviewUrl: string;
  showGoogleRatingPill: boolean;
  googleReviewsHeading: string;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      default: "store_delivery_settings",
      unique: true,
      index: true,
    },
    deliveryFee: {
      type: Number,
      default: 30,
      min: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 199,
      min: 0,
    },
    isFreeDeliveryActive: {
      type: Boolean,
      default: false,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expressDeliveryMins: {
      type: String,
      default: "15-45 Mins",
    },
    deliveryNotice: {
      type: String,
      default: "",
    },
    googleRating: {
      type: Number,
      default: 4.9,
    },
    googleReviewsCount: {
      type: String,
      default: "50+ Google Reviews",
    },
    googleReviewUrl: {
      type: String,
      default: "https://share.google/YAXXJGqvygILNyVNr",
    },
    showGoogleRatingPill: {
      type: Boolean,
      default: true,
    },
    googleReviewsHeading: {
      type: String,
      default: "Customer Reviews on Google",
    },
  },
  {
    timestamps: true,
  }
);

const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
