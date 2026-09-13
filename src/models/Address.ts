import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress extends Document {
  userId?: string;
  userEmail?: string;
  label: "Home" | "Office" | "Other";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: { type: String, index: true },
    userEmail: { type: String, index: true },
    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
      required: true,
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address: Model<IAddress> =
  mongoose.models.Address || mongoose.model<IAddress>("Address", AddressSchema);
