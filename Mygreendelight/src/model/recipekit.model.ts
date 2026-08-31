import mongoose from "mongoose";

export interface IRecipeIngredient {
  name: string;
  qty: string;
  price: number;
  image?: string;
  groceryId?: mongoose.Types.ObjectId;
}

export interface IRecipeKit {
  _id?: mongoose.Types.ObjectId;
  name: string;
  hindiName: string;
  serves: string;
  cookTime: string;
  badge: string;
  price: number;
  mrp: number;
  image: string;
  isActive: boolean;
  ingredients: IRecipeIngredient[];
  createdAt?: Date;
  updatedAt?: Date;
}

const RecipeIngredientSchema = new mongoose.Schema<IRecipeIngredient>({
  name: { type: String, required: true },
  qty: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "/categories/vegetables.jpg" },
  groceryId: { type: mongoose.Schema.Types.ObjectId, ref: "Grocery" },
});

const RecipeKitSchema = new mongoose.Schema<IRecipeKit>(
  {
    name: { type: String, required: true },
    hindiName: { type: String, default: "" },
    serves: { type: String, default: "3-4 Persons" },
    cookTime: { type: String, default: "25 Mins" },
    badge: { type: String, default: "⭐ Chef Special" },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    image: { type: String, default: "/categories/vegetables.jpg" },
    isActive: { type: Boolean, default: true },
    ingredients: [RecipeIngredientSchema],
  },
  { timestamps: true }
);

const RecipeKit =
  mongoose.models.RecipeKit ||
  mongoose.model<IRecipeKit>("RecipeKit", RecipeKitSchema);

export default RecipeKit;
