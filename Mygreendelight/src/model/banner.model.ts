import mongoose from "mongoose";

interface IBanner {
  _id?: mongoose.Types.ObjectId;
  title: string;
  subtitle: string;
  image: string;
  btnText: string;
  link: string;
  createdAt: Date;
}

const BannerSchema = new mongoose.Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    btnText: { type: String, default: "Shop Now" },
    link: { type: String, default: "/shop" },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
