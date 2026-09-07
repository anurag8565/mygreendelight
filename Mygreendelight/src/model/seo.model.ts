import mongoose from "mongoose";

export interface IGlobalSEO {
  _id?: mongoose.Types.ObjectId;
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  primaryKeywords: string;
  bhopalDeliveryAreas: string[];
  canonicalBase: string;
  googleSiteVerification: string;
  googleAnalyticsId: string;
  ogImageUrl: string;
  twitterHandle: string;
  structuredDataJson: string;
  updatedAt: Date;
}

const GlobalSEOSchema = new mongoose.Schema<IGlobalSEO>(
  {
    siteName: {
      type: String,
      default: "SubziQuick Bhopal",
    },
    defaultTitle: {
      type: String,
      default: "Online Vegetable & Fruit Delivery in Bhopal | Farm Fresh Produce - SubziQuick",
    },
    titleTemplate: {
      type: String,
      default: "%s | SubziQuick Bhopal",
    },
    defaultDescription: {
      type: String,
      default:
        "Order farm-fresh vegetables, seasonal fruits & groceries online in Bhopal at direct farm wholesale rates. 100% ozone-washed, pesticide-safe with same-day doorstep delivery across Bhopal.",
    },
    primaryKeywords: {
      type: String,
      default:
        "online vegetable delivery in bhopal, buy fresh fruits online bhopal, fresh sabzi online cash on delivery bhopal, today vegetable rate in bhopal, same day fresh vegetable delivery bhopal, online sabzi delivery app bhopal free delivery, fresh farm vegetables home delivery bhopal, no minimum order vegetable delivery bhopal, free vegetable delivery in bhopal, cheap fresh vegetable delivery online bhopal, vegetable delivery in arera colony bhopal, fresh fruit delivery kolar road bhopal, online sabzi delivery mp nagar bhopal, organic vegetables bawadiya kalan bhopal, vegetable home delivery katara hills bhopal, pesticide free vegetables in bhopal, 100 percent ozone washed clean vegetables bhopal, direct kisan wholesale price online sabzi bhopal, zero platform fee vegetable delivery app bhopal",
    },
    bhopalDeliveryAreas: {
      type: [String],
      default: [
        "Bagsewaniya",
        "Amrai",
        "Arera Colony",
        "MP Nagar",
        "Kolar Road",
        "Hoshangabad Road",
        "Bittan Market",
        "Gulmohar",
        "Shahpura",
        "Ayodhya Bypass",
        "Indrapuri",
        "BHEL",
        "Awadhpuri",
        "Katara Hills",
        "Bawadiya Kalan",
        "Chuna Bhatti",
        "Nehru Nagar",
        "TT Nagar",
        "Salaiya",
        "Rohit Nagar",
        "Saket Nagar",
      ],
    },
    canonicalBase: {
      type: String,
      default: "https://subziquick.in",
    },
    googleSiteVerification: {
      type: String,
      default: "",
    },
    googleAnalyticsId: {
      type: String,
      default: "",
    },
    ogImageUrl: {
      type: String,
      default: "https://subziquick.in/og-image.png",
    },
    twitterHandle: {
      type: String,
      default: "@SubziQuick",
    },
    structuredDataJson: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const GlobalSEO =
  mongoose.models.GlobalSEO ||
  mongoose.model<IGlobalSEO>("GlobalSEO", GlobalSEOSchema);

export default GlobalSEO;
