import mongoose from "mongoose";


interface iUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryboy";
  image?: string;

  location?: {
    type: "Point";
    coordinates: [number, number];
  },
  deliveryStats?: {
    totalDeliveries: number
    totalEarnings: number
  }

  socketid: string | null,
  isonline: Boolean,
  wishlist?: mongoose.Types.ObjectId[],
  walletBalance?: number;
  walletHistory?: {
    amount: number;
    type: "credit" | "debit";
    description: string;
    date: Date;
  }[];
  vipPass?: {
    isActive: boolean;
    planName: string;
    price: number;
    startDate: Date;
    endDate: Date;
    totalSavings?: number;
  };
}

const userSchema = new mongoose.Schema<iUser>(
  {
    name: {
      type: String,
      required: true,
    },



    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: "",
    },


    mobile: String,

    role: {
      type: String,
      enum: ["user", "admin", "deliveryboy"],
      default: "user",
    },

    image: String,

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    socketid: {
      type: String,
      default: null,
    },

    isonline: {
      type: Boolean,
      default: false,
    },
    deliveryStats: {
      totalDeliveries: {
        type: Number,
        default: 0
      },

      totalEarnings: {
        type: Number,
        default: 0
      }
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grocery",
      }
    ],
    walletBalance: {
      type: Number,
      default: 0,
    },
    walletHistory: [
      {
        amount: Number,
        type: { type: String, enum: ["credit", "debit"] },
        description: String,
        date: { type: Date, default: Date.now },
      }
    ],
    vipPass: {
      isActive: { type: Boolean, default: false },
      planName: { type: String, default: "Farm Club VIP Pass" },
      price: { type: Number, default: 49 },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      totalSavings: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },



);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model<iUser>("User", userSchema);
export default User;






