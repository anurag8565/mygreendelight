import mongoose from "mongoose";

export interface IGrosery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  isTopRated?: boolean;
  unit: string;
  image: string;
  category: string;
  stock: number;
  description?: string;
  sourcing?: string;
  storage?: string;
  // SEO & Google Ranking fields
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  variations?: { weight: string; price: number; stock: number; mrp?: number }[];
  reviews?: { user: mongoose.Types.ObjectId; name: string; rating: number; comment: string; date: Date }[];
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GrocerySchema = new mongoose.Schema<IGrosery>(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    isTopRated: {
      type: Boolean,
      default: false,
    },

    unit: {
      type: String,
      required: true,
      default: "kg",
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    sourcing: {
      type: String,
      default: "",
    },
    storage: {
      type: String,
      default: "",
    },
    // SEO & Google Ranking Schema Fields
    slug: {
      type: String,
      index: true,
      default: "",
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    focusKeyword: {
      type: String,
      default: "",
    },
    canonicalUrl: {
      type: String,
      default: "",
    },
    variations: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now }
      }
    ],
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Grocery =
  mongoose.models.Grocery ||
  mongoose.model<IGrosery>("Grocery", GrocerySchema);

export default Grocery;