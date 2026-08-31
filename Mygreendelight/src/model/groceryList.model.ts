import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroceryListInquiry extends Document {
  user?: mongoose.Types.ObjectId;
  guestId?: string;
  rawText: string;
  matchedItems: {
    groceryId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalEstimatedAmount: number;
  status: "matched" | "converted_to_cart" | "reviewed";
  createdAt: Date;
  updatedAt: Date;
}

const GroceryListInquirySchema = new Schema<IGroceryListInquiry>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    guestId: { type: String, required: false },
    rawText: { type: String, required: true },
    matchedItems: [
      {
        groceryId: { type: Schema.Types.ObjectId, ref: "Grocery", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalEstimatedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["matched", "converted_to_cart", "reviewed"],
      default: "matched",
    },
  },
  { timestamps: true }
);

const GroceryListInquiry: Model<IGroceryListInquiry> =
  mongoose.models.GroceryListInquiry ||
  mongoose.model<IGroceryListInquiry>(
    "GroceryListInquiry",
    GroceryListInquirySchema
  );

export default GroceryListInquiry;
