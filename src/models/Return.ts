import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReturnRequest extends Document {
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  type: "return" | "exchange";
  reason: string;
  exchangeSize?: string;
  evidenceUrls: string[];
  status: "Pending" | "Inspection Approved" | "Rejected" | "Completed";
  inspectionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnRequestSchema = new Schema<IReturnRequest>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    type: { type: String, enum: ["return", "exchange"], required: true },
    reason: { type: String, required: true },
    exchangeSize: { type: String },
    evidenceUrls: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Pending", "Inspection Approved", "Rejected", "Completed"],
      default: "Pending",
    },
    inspectionNotes: { type: String },
  },
  { timestamps: true }
);

export const ReturnRequest: Model<IReturnRequest> =
  mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequest>("ReturnRequest", ReturnRequestSchema);
