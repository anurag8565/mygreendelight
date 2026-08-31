import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComboItem {
  groceryId?: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unit: string;
  image: string;
}

export interface IComboBundle extends Document {
  title: string;
  subtitle: string;
  badge: string;
  items: IComboItem[];
  originalPrice: number;
  comboPrice: number;
  discountPercentage: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ComboBundleSchema = new Schema<IComboBundle>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    badge: { type: String, default: "Save 20%" },
    items: [
      {
        groceryId: { type: Schema.Types.ObjectId, ref: "Grocery", required: false },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: "unit" },
        image: { type: String, required: true },
      },
    ],
    originalPrice: { type: Number, required: true },
    comboPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 15 },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ComboBundle: Model<IComboBundle> =
  mongoose.models.ComboBundle ||
  mongoose.model<IComboBundle>("ComboBundle", ComboBundleSchema);

export default ComboBundle;
