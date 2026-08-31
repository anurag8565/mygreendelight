import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRewardConfig extends Document {
  isActive: boolean;
  dailyLimitPerUser: number;
  availableRewards: {
    title: string;
    discountType: "fixed" | "percent" | "free_delivery";
    discountValue: number;
    couponPrefix: string;
    minOrderValue: number;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const RewardConfigSchema = new Schema<IRewardConfig>(
  {
    isActive: { type: Boolean, default: true },
    dailyLimitPerUser: { type: Number, default: 1 },
    availableRewards: [
      {
        title: { type: String, required: true },
        discountType: {
          type: String,
          enum: ["fixed", "percent", "free_delivery"],
          default: "fixed",
        },
        discountValue: { type: Number, required: true },
        couponPrefix: { type: String, default: "LUCKY" },
        minOrderValue: { type: Number, default: 299 },
        description: { type: String, default: "Special Daily Farm Discount" },
      },
    ],
  },
  { timestamps: true }
);

export interface IScratchReward extends Document {
  user?: mongoose.Types.ObjectId;
  guestId?: string;
  order?: mongoose.Types.ObjectId;
  rewardTitle?: string;
  couponCode: string;
  discountType?: "fixed" | "percent" | "free_delivery";
  discountValue?: number;
  discountAmount?: number;
  minOrderValue?: number;
  minOrderAmount?: number;
  isUsed?: boolean;
  isScratched?: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScratchRewardSchema = new Schema<IScratchReward>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    guestId: { type: String, required: false },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: false },
    rewardTitle: { type: String, default: "Farm Scratch Reward" },
    couponCode: { type: String, required: true, uppercase: true },
    discountType: {
      type: String,
      enum: ["fixed", "percent", "free_delivery"],
      default: "fixed",
    },
    discountValue: { type: Number, default: 20 },
    discountAmount: { type: Number, default: 20 },
    minOrderValue: { type: Number, default: 199 },
    minOrderAmount: { type: Number, default: 199 },
    isUsed: { type: Boolean, default: false },
    isScratched: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const RewardConfig: Model<IRewardConfig> =
  mongoose.models.RewardConfig ||
  mongoose.model<IRewardConfig>("RewardConfig", RewardConfigSchema);

export const ScratchReward: Model<IScratchReward> =
  mongoose.models.ScratchReward ||
  mongoose.model<IScratchReward>("ScratchReward", ScratchRewardSchema);

export default ScratchReward;
