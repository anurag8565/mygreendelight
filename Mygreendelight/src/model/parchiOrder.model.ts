import mongoose from "mongoose";

export interface IParchiOrder {
  customerName: string;
  mobile: string;
  address: string;
  locality?: string;
  pincode?: string;
  parchiImageUrl?: string;
  listText?: string;
  voiceNoteUrl?: string;
  status: "pending" | "reviewed" | "confirmed" | "completed" | "cancelled";
  estimatedAmount?: number;
  finalAmount?: number;
  adminNotes?: string;
  assignedDeliveryBoy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const parchiOrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    locality: {
      type: String,
      default: "Bhopal",
      trim: true,
    },
    pincode: {
      type: String,
      default: "462001",
      trim: true,
    },
    parchiImageUrl: {
      type: String,
      default: "",
    },
    listText: {
      type: String,
      default: "",
    },
    voiceNoteUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    estimatedAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    adminNotes: {
      type: String,
      default: "",
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const ParchiOrder =
  mongoose.models.ParchiOrder ||
  mongoose.model("ParchiOrder", parchiOrderSchema);

export default ParchiOrder;
