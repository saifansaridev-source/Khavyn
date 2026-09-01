import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOfferPopupSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  couponCode: string;
  discountText: string;
  ctaText: string;
  ctaLink: string;
  frequency: "once_per_session" | "every_visit";
}

export interface IStoreSettings extends Document {
  announcementText: string;
  heroHeadline: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  partialCodAdvanceAmount: number;
  razorpayKeyId: string;
  razorpayLiveMode: boolean;
  offerPopup: IOfferPopupSettings;
  returnPolicyNotice: string;
  updatedAt: Date;
}

const OfferPopupSchema = new Schema<IOfferPopupSettings>({
  enabled: { type: Boolean, default: true },
  title: { type: String, default: "EXCLUSIVE PRIVATE PRIVILEGE" },
  subtitle: { type: String, default: "Unlock 10% off your inaugural KHAVYN order + complimentary express shipping nationwide." },
  couponCode: { type: String, default: "KHAVYN10" },
  discountText: { type: String, default: "Complimentary shipping above ₹2,499" },
  ctaText: { type: String, default: "EXPLORE THE ATELIER" },
  ctaLink: { type: String, default: "/shop" },
  frequency: { type: String, enum: ["once_per_session", "every_visit"], default: "once_per_session" },
});

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    announcementText: {
      type: String,
      default: "COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹2,499 • 50% ADVANCE PARTIAL COD AVAILABLE",
    },
    heroHeadline: {
      type: String,
      default: "Crafted for Distinction, Tailored for Eternity",
    },
    freeShippingThreshold: { type: Number, default: 2499 },
    standardShippingFee: { type: Number, default: 150 },
    partialCodAdvanceAmount: { type: Number, default: 500 },
    razorpayKeyId: { type: String, default: "rzp_test_placeholder" },
    razorpayLiveMode: { type: Boolean, default: false },
    offerPopup: { type: OfferPopupSchema, default: () => ({}) },
    returnPolicyNotice: {
      type: String,
      default: "Hassle-free 7-day returns & exchanges on all eligible unworn apparel items.",
    },
  },
  { timestamps: true }
);

export const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);
