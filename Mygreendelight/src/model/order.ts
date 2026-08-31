import mongoose from "mongoose";
import "./user.model";
import "./Deliveryassigment.model";
import "./groseri.model";

export interface iorder {
    _id?: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    items: [
        {
            grocery: mongoose.Types.ObjectId
            name: string;
            price: number;
            unit: string;
            variationWeight?: string;
            image: string;
            quantity: number
        }
    ],


    ispaid: boolean,
    totalamount: number
    paymentmethod: "cod" | "online"
    address: {
        fullname: string
        mobile: string
        city: string
        state: string
        pincode: string
        fulladress: string
        latitude: number
        longitude: number

    }
    assigment?: mongoose.Types.ObjectId,
    assigneddelliveryboy?: mongoose.Types.ObjectId,
    status: "pending" | "out of delivery" | "delivered" | "cancelled"
    couponCode?: string
    discount?: number
    walletDiscount?: number
    cancellationReason?: string
    deliverySlot?: string
    paymentId?: string
    paymentStatus?: "pending" | "completed" | "failed" | null
    createdAt?: Date,
    updatedAt?: Date,
    deliveryOtp?: {
        code: string | null
        expiresAt: Date | null
        verified: boolean
    }

}


const orderSchema = new mongoose.Schema<iorder>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deliveryOtp: {
            code: {
                type: String,
                default: null,
            },
            expiresAt: {
                type: Date,
                default: null,
            },
            verified: {
                type: Boolean,
                default: false,
            },
        },

        items: [
            {
                grocery: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Grocery",
                    required: true,
                },
                name: String,
                price: Number,
                unit: String,
                variationWeight: String,
                image: String,
                quantity: Number,
            },
        ],

        ispaid: {
            type: Boolean,
            default: false,

        },

        totalamount: {
            type: Number,
            required: true,
        },

        paymentmethod: {
            type: String,
            enum: ["cod", "online"],
            default: "cod",
        },

        address: {
            fullname: String,
            mobile: String,
            city: String,
            state: String,
            pincode: String,
            fulladress: String,
            latitude: Number,
            longitude: Number,
        },
        assigment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryAssignment",
            default: null
        },
        assigneddelliveryboy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        status: {
            type: String,
            enum: ["pending", "out of delivery", "delivered", "cancelled"],
            default: "pending",
        },
        cancellationReason: {
            type: String,
            default: null,
        },
        couponCode: {
            type: String,
            default: null,
        },
        discount: {
            type: Number,
            default: 0,
        },
        walletDiscount: {
            type: Number,
            default: 0,
        },
        deliverySlot: {
            type: String,
            default: "Instant Express (30-45 Mins)",
        },
        paymentId: {
            type: String,
            default: null,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", null],
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;