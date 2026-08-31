import mongoose from "mongoose";

export interface IBroadcast {
  _id?: mongoose.Types.ObjectId;
  message: string;
  type: "info" | "warning" | "promo" | "weather";
  isActive: boolean;
  linkText?: string;
  linkUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BroadcastSchema = new mongoose.Schema<IBroadcast>(
  {
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "promo", "weather"],
      default: "promo",
    },
    isActive: { type: Boolean, default: true },
    linkText: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Broadcast =
  mongoose.models.Broadcast ||
  mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);

export default Broadcast;
