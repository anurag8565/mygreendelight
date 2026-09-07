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
        "vegetable delivery bhopal, fresh vegetables bhopal, buy vegetables online bhopal, farm fresh vegetables bhopal, subziquick, fruit delivery bhopal, organic veggies bagsewaniya",
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
        "Bagsewaniya",
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
