import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  productSlug: string;
  productName: string;
  userEmail: string;
  userName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  storeResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productSlug: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    isVerifiedPurchase: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    storeResponse: { type: String },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
