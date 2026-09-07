import mongoose from "mongoose";

export interface IBanner {
  _id?: mongoose.Types.ObjectId;
  title: string;
  subtitle: string;
  image: string;
  btnText: string;
  link: string;
  badge?: string;
  offerPill?: string;
  floatingStat?: string;
  bgGradient?: string;
  accentColor?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BannerSchema = new mongoose.Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    btnText: { type: String, default: "Shop Now" },
    link: { type: String, default: "/shop" },
    badge: { type: String, default: "🌿 Farm Fresh • 10-15 Min Express" },
    offerPill: { type: String, default: "" },
    floatingStat: { type: String, default: "🌱 100% Farm Fresh" },
    bgGradient: { type: String, default: "from-[#052e16]/95 via-[#064e3b]/85 to-transparent/30" },
    accentColor: { type: String, default: "#10b981" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;

