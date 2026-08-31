import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscriptionItem {
  groceryId?: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  planName: string;
  items: ISubscriptionItem[];
  frequency: "daily" | "alternate_days" | "weekdays" | "weekends";
  deliveryTimeSlot: string;
  deliveryAddress: {
    fullname: string;
    mobile: string;
    city: string;
    fulladress: string;
    pincode: string;
  };
  paymentMethod: "wallet" | "cod";
  status: "active" | "paused" | "cancelled";
  startDate: Date;
  nextDeliveryDate: Date;
  totalPerDelivery: number;
  deliveriesCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionItemSchema = new Schema<ISubscriptionItem>(
  {
    groceryId: { type: String, required: false },
    name: { type: String, required: true },
    unit: { type: String, default: "1 Unit" },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    image: { type: String, required: false },
  },
  { _id: false }
);

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String, required: true },
    items: [SubscriptionItemSchema],
    frequency: {
      type: String,
      enum: ["daily", "alternate_days", "weekdays", "weekends"],
      default: "daily",
    },
    deliveryTimeSlot: {
      type: String,
      default: "6:30 AM - 7:30 AM (Early Morning Express)",
    },
    deliveryAddress: {
      fullname: { type: String, required: true },
      mobile: { type: String, required: true },
      city: { type: String, default: "Bhopal" },
      fulladress: { type: String, required: true },
      pincode: { type: String, default: "462001" },
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "cod"],
      default: "wallet",
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    startDate: { type: Date, default: Date.now },
    nextDeliveryDate: { type: Date, default: () => new Date(Date.now() + 86400000) },
    totalPerDelivery: { type: Number, required: true },
    deliveriesCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
