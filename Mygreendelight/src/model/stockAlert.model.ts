import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStockAlert extends Document {
  user?: mongoose.Types.ObjectId;
  email?: string;
  mobile: string;
  grocery: mongoose.Types.ObjectId;
  groceryName: string;
  status: "pending" | "notified";
  notifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StockAlertSchema = new Schema<IStockAlert>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    email: { type: String, required: false },
    mobile: { type: String, required: true },
    grocery: { type: Schema.Types.ObjectId, ref: "Grocery", required: true },
    groceryName: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "notified"],
      default: "pending",
    },
    notifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const StockAlert: Model<IStockAlert> =
  mongoose.models.StockAlert ||
  mongoose.model<IStockAlert>("StockAlert", StockAlertSchema);

export default StockAlert;
