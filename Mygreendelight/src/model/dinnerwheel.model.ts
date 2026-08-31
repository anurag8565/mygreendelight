import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDinnerIngredient {
  name: string;
  qty: string;
  price: number;
  groceryId?: string;
  image?: string;
}

export interface IDinnerRecipe extends Document {
  title: string;
  description: string;
  prepTime: string;
  servings: string;
  image: string;
  comboPrice: number;
  mrp: number;
  sliceColor: string;
  isActive: boolean;
  ingredients: IDinnerIngredient[];
  createdAt: Date;
  updatedAt: Date;
}

const DinnerIngredientSchema = new Schema<IDinnerIngredient>(
  {
    name: { type: String, required: true },
    qty: { type: String, required: true },
    price: { type: Number, required: true },
    groceryId: { type: String, required: false },
    image: { type: String, required: false },
  },
  { _id: false }
);

const DinnerRecipeSchema = new Schema<IDinnerRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    prepTime: { type: String, default: "15 mins" },
    servings: { type: String, default: "2-3 Persons" },
    image: { type: String, required: true },
    comboPrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    sliceColor: { type: String, default: "#0f8646" },
    isActive: { type: Boolean, default: true },
    ingredients: [DinnerIngredientSchema],
  },
  { timestamps: true }
);

const DinnerRecipe: Model<IDinnerRecipe> =
  mongoose.models.DinnerRecipe ||
  mongoose.model<IDinnerRecipe>("DinnerRecipe", DinnerRecipeSchema);

export default DinnerRecipe;
