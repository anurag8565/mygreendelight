import mongoose from "mongoose";

export interface ISociety {
  name: string;
  slug: string;
  locality: string;
  landmark?: string;
  pincode: string;
  targetOrders: number;
  discountPercent: number;
  keywords: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      default: "",
      trim: true,
    },
    pincode: {
      type: String,
      default: "462001",
      trim: true,
    },
    targetOrders: {
      type: Number,
      default: 3,
      min: 1,
    },
    discountPercent: {
      type: Number,
      default: 5,
      min: 0,
      max: 50,
    },
    keywords: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Society =
  mongoose.models.Society || mongoose.model("Society", societySchema);

export default Society;
