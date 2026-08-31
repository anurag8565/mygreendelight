import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMandiRate extends Document {
  itemName: string;
  currentRate: number;
  unit: string;
  priceChange: "down" | "up" | "stable";
  percentageChange: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MandiRateSchema = new Schema<IMandiRate>(
  {
    itemName: { type: String, required: true },
    currentRate: { type: Number, required: true },
    unit: { type: String, default: "1 kg" },
    priceChange: {
      type: String,
      enum: ["down", "up", "stable"],
      default: "down",
    },
    percentageChange: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MandiRate: Model<IMandiRate> =
  mongoose.models.MandiRate ||
  mongoose.model<IMandiRate>("MandiRate", MandiRateSchema);

export default MandiRate;
