import { z } from "zod";

// 📦 Order Placement Schema
export const createOrderSchema = z.object({
  userid: z.string().min(1, "User ID is required"),
  items: z
    .array(
      z.object({
        grocery: z.string().min(1, "Grocery ID is required"),
        name: z.string().optional(),
        price: z.number().nonnegative("Price must be non-negative").optional(),
        unit: z.string().optional(),
        variationWeight: z.string().optional(),
        quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
        image: z.string().optional(),
      })
    )
    .min(1, "Cart must contain at least 1 item"),
  paymentmethod: z.enum(["cod", "upi"], {
    message: "Payment method must be either 'cod' or 'upi'",
  }),
  totalamount: z.number().nonnegative("Total amount must be non-negative"),
  address: z.object({
    fullname: z.string().min(2, "Full name must be at least 2 characters").max(100),
    mobile: z
      .string()
      .regex(/^[0-9]{10}$/, "Mobile number must be a valid 10-digit number"),
    city: z.string().default("Bhopal"),
    state: z.string().default("Madhya Pradesh"),
    pincode: z
      .string()
      .regex(/^462[0-9]{3}$/, "Delivery is available exclusively across Bhopal city (462xxx)"),
    fulladress: z.string().min(5, "Full address must be at least 5 characters"),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
  }),
  couponCode: z.string().max(30).optional().nullable(),
  discount: z.number().nonnegative().optional().default(0),
  walletDiscount: z.number().nonnegative().optional().default(0),
  farmerTip: z.number().min(0).max(500).optional().default(0),
  isSilentDelivery: z.boolean().optional().default(false),
  deliveryInstructions: z.string().max(300).optional().default(""),
  deliverySlot: z.string().max(100).optional().default("Instant Express (30-45 Mins)"),
  paymentId: z.string().max(100).optional().nullable(),
  paymentProofImage: z.string().optional().nullable(),
});

// 📍 Driver Live GPS Location Schema
export const updateLocationSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),
});

// 🚚 Driver Assignment Schema
export const assignDriverSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Order ObjectId"),
  driverId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Driver ObjectId"),
});

// 🔄 Order Status Update Schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "out of delivery", "delivered", "completed", "cancelled"]).optional(),
  ispaid: z.boolean().optional(),
  paymentStatus: z.enum(["pending", "completed", "failed"]).optional().nullable(),
  reason: z.string().max(300).optional(),
});
