import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduceGuide extends Document {
  category: string;
  icon: string;
  idealStorage: string;
  temperature: string;
  shelfLifeDays: number;
  ripenessTips: string;
  kitchenHacks: string;
  washingAdvice: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProduceGuideSchema = new Schema<IProduceGuide>(
  {
    category: { type: String, required: true, unique: true },
    icon: { type: String, default: "🥬" },
    idealStorage: { type: String, required: true },
    temperature: { type: String, required: true },
    shelfLifeDays: { type: Number, required: true, default: 5 },
    ripenessTips: { type: String, required: true },
    kitchenHacks: { type: String, required: true },
    washingAdvice: {
      type: String,
      default: "100% Ozone washed before delivery. Rinse gently under cold running water before cooking.",
    },
  },
  { timestamps: true }
);

const ProduceGuide: Model<IProduceGuide> =
  mongoose.models.ProduceGuide ||
  mongoose.model<IProduceGuide>("ProduceGuide", ProduceGuideSchema);

export default ProduceGuide;
