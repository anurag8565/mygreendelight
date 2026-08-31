import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGiftBasket extends Document {
  title: string;
  occasion: string;
  description: string;
  contents: string[];
  price: number;
  originalPrice: number;
  image: string;
  ribbonColor: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GiftBasketSchema = new Schema<IGiftBasket>(
  {
    title: { type: String, required: true },
    occasion: { type: String, required: true },
    description: { type: String, required: true },
    contents: [{ type: String, required: true }],
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    image: { type: String, required: true },
    ribbonColor: { type: String, default: "Emerald Gold" },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GiftBasket: Model<IGiftBasket> =
  mongoose.models.GiftBasket ||
  mongoose.model<IGiftBasket>("GiftBasket", GiftBasketSchema);

export default GiftBasket;
