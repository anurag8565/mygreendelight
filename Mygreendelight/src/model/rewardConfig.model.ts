import mongoose from "mongoose";

const rewardConfigSchema = new mongoose.Schema(
  {
    minCashback: {
      type: Number,
      default: 15,
    },
    maxCashback: {
      type: Number,
      default: 50,
    },
    minOrderValue: {
      type: Number,
      default: 199,
    },
    expiryDays: {
      type: Number,
      default: 7,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    couponPrefix: {
      type: String,
      default: "LUCKY",
    },
  },
  { timestamps: true }
);

const RewardConfig =
  mongoose.models.RewardConfig ||
  mongoose.model("RewardConfig", rewardConfigSchema);

export default RewardConfig;
