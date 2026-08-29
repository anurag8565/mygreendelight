import mongoose from "mongoose";

const scratchRewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
      default: 199,
    },
    isScratched: {
      type: Boolean,
      default: false,
    },
    scratchedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const ScratchReward =
  mongoose.models.ScratchReward ||
  mongoose.model("ScratchReward", scratchRewardSchema);

export default ScratchReward;
