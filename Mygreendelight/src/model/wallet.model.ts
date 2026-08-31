import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWalletTransaction {
  _id?: mongoose.Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Date;
}

export interface IUserWallet extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  totalCashback: number;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    orderId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const UserWalletSchema = new Schema<IUserWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    totalCashback: { type: Number, default: 0, min: 0 },
    transactions: [WalletTransactionSchema],
  },
  { timestamps: true }
);

const UserWallet: Model<IUserWallet> =
  mongoose.models.UserWallet ||
  mongoose.model<IUserWallet>("UserWallet", UserWalletSchema);

export default UserWallet;
