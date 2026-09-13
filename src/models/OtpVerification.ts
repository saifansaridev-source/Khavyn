import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpVerification extends Document {
  email: string;
  phone: string;
  emailOtpHashed: string;
  phoneOtpHashed: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const OtpVerificationSchema = new Schema<IOtpVerification>(
  {
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    emailOtpHashed: { type: String, required: true },
    phoneOtpHashed: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      index: { expires: "10m" },
    },
  },
  { timestamps: true }
);

export const OtpVerification: Model<IOtpVerification> =
  mongoose.models.OtpVerification ||
  mongoose.model<IOtpVerification>("OtpVerification", OtpVerificationSchema);
