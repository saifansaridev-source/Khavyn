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

export interface ICollectionCard {
  slug: string;
  title: string;
  sub: string;
  image: string;
}

export interface IStoreSettings extends Document {
  announcementText: string;
  heroHeadline: string;
  heroSubline: string;
  heroImage: string;
  collectionImages: ICollectionCard[];
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

const CollectionCardSchema = new Schema<ICollectionCard>(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    sub: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const DEFAULT_COLLECTION_IMAGES: ICollectionCard[] = [
  {
    slug: "formal-shirts",
    title: "Formal Shirts",
    sub: "Contemporary Tailored Slim Fit",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "polo-t-shirts",
    title: "Polo T-Shirts",
    sub: "230 GSM Pique Combed Knit",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "oversized-t-shirts",
    title: "Oversized T-Shirts",
    sub: "230 GSM Streetwear Silhouette",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "round-neck-t-shirts",
    title: "Round Neck T-Shirts",
    sub: "210 GSM Everyday Essentials",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
  },
];

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
    heroSubline: {
      type: String,
      default: "Architectural precision meets long-staple bio-washed combed cotton. Elevated essentials designed in Europe, tailored in India for the modern gentleman.",
    },
    heroImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
    },
    collectionImages: {
      type: [CollectionCardSchema],
      default: () => DEFAULT_COLLECTION_IMAGES,
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