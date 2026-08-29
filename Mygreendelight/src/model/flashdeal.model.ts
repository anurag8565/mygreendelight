import mongoose from "mongoose";

const flashDealSchema = new mongoose.Schema(
  {
    endTime: {
      type: Date,
      default: () => new Date(Date.now() + 6 * 60 * 60 * 1000),
    },
    badgeText: {
      type: String,
      default: "FLAT 25% - 40% OFF",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FlashDealSetting =
  mongoose.models.FlashDealSetting ||
  mongoose.model("FlashDealSetting", flashDealSchema);

export default FlashDealSetting;
