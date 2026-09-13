import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReturnRequest extends Document {
  orderId: string;
  productId: string;
  productName?: string;
  productImage?: string;
  productSize?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  type: "return" | "exchange";
  reason:
    | "Incorrect size"
    | "Incorrect product"
    | "Manufacturing defect"
    | "Damaged in transit"
    | "Other"
    | string;
  exchangeSize?: string;
  images: string[]; // Cloudinary URLs
  evidenceUrls?: string[]; // Backward-compatible alias
  status: "pending" | "under_review" | "approved" | "rejected";
  adminNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnRequestSchema = new Schema<IReturnRequest>(
  {
    orderId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String },
    productImage: { type: String },
    productSize: { type: String },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    type: {
      type: String,
      enum: ["return", "exchange"],
      required: true,
      default: "return",
    },
    reason: {
      type: String,
      required: true,
    },
    exchangeSize: { type: String },
    images: { type: [String], default: [] },
    evidenceUrls: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String, default: "" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);



export const ReturnRequest: Model<IReturnRequest> =
  mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequest>("ReturnRequest", ReturnRequestSchema);

// Backward compatibility alias
export const Return = ReturnRequest;
