import mongoose from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  cartItemId?: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
  stock: number;
  category: string;
  variation?: { weight: string; price: number; stock: number };
}

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string | null;
  discountAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CartItemSchema = new mongoose.Schema<ICartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grocery",
      required: true,
    },
    cartItemId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    image: { type: String, default: "" },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    stock: { type: Number, default: 50 },
    category: { type: String, default: "Vegetables" },
    variation: {
      weight: String,
      price: Number,
      stock: Number,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    couponCode: {
      type: String,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;