import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomBoxIngredient extends Document {
  name: string;
  category: "base" | "veggie" | "protein_crunch" | "dressing";
  price: number;
  calories: number;
  protein: number;
  image: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomBoxIngredientSchema = new Schema<ICustomBoxIngredient>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["base", "veggie", "protein_crunch", "dressing"],
      required: true,
    },
    price: { type: Number, required: true, default: 0 },
    calories: { type: Number, default: 20 },
    protein: { type: Number, default: 1 },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CustomBoxIngredient: Model<ICustomBoxIngredient> =
  mongoose.models.CustomBoxIngredient ||
  mongoose.model<ICustomBoxIngredient>(
    "CustomBoxIngredient",
    CustomBoxIngredientSchema
  );

export default CustomBoxIngredient;
