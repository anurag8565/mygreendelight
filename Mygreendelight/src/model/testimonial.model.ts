import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
  tag?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const TestimonialSchema: Schema<ITestimonial> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true },
    location: { type: String, required: true, default: "Bhopal, MP" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    image: { type: String, required: false },
    tag: { type: String, default: "Verified Customer" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" }
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;