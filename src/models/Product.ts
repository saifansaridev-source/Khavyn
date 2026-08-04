import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductImages {
  front: string;
  side: string;
  back: string;
  angle45: string;
  fabricTexture: string;
  embroidery: string;
  collarLabel: string;
  modelFront: string;
  modelSide: string;
  modelBack: string;
  model45: string;
}

export interface IProductStock {
  S: number;
  M: number;
  L: number;
  XL: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  collectionName: "Formal Shirts" | "Polo T-Shirts" | "Oversized T-Shirts" | "Round Neck T-Shirts";
  styleCode: string;
  colour: string;
  colourHex: string;
  sizes: string[];
  stock: IProductStock;
  price: number;
  compareAtPrice?: number;
  images: IProductImages;
  material: string;
  fabricWeight: string;
  fit: string;
  collarType: string;
  sleeve: string;
  closure: string;
  occasion: string[];
  description: string;
  whyYoullLoveIt?: string;
  styleRecommendation?: string;
  careInstructions: string[];
  keyFeatures: string[];
  packageContains: string;
  countryOfOrigin: string;
  seoTitle?: string;
  seoDescription?: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImagesSchema = new Schema<IProductImages>({
  front: { type: String, required: true },
  side: { type: String, required: true },
  back: { type: String, required: true },
  angle45: { type: String, required: true },
  fabricTexture: { type: String, required: true },
  embroidery: { type: String, required: true },
  collarLabel: { type: String, required: true },
  modelFront: { type: String, required: true },
  modelSide: { type: String, required: true },
  modelBack: { type: String, required: true },
  model45: { type: String, required: true },
});

const ProductStockSchema = new Schema<IProductStock>({
  S: { type: Number, default: 15 },
  M: { type: Number, default: 25 },
  L: { type: Number, default: 20 },
  XL: { type: Number, default: 10 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    collectionName: {
      type: String,
      required: true,
      enum: ["Formal Shirts", "Polo T-Shirts", "Oversized T-Shirts", "Round Neck T-Shirts"],
      index: true,
    },
    styleCode: { type: String, required: true, unique: true },
    colour: { type: String, required: true },
    colourHex: { type: String, required: true },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    stock: { type: ProductStockSchema, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: { type: ProductImagesSchema, required: true },
    material: { type: String, required: true },
    fabricWeight: { type: String, required: true },
    fit: { type: String, required: true },
    collarType: { type: String, required: true },
    sleeve: { type: String, required: true },
    closure: { type: String, required: true },
    occasion: { type: [String], default: [] },
    description: { type: String, required: true },
    whyYoullLoveIt: { type: String },
    styleRecommendation: { type: String },
    careInstructions: { type: [String], default: [] },
    keyFeatures: { type: [String], default: [] },
    packageContains: { type: String, default: "1 Unit" },
    countryOfOrigin: { type: String, default: "India" },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
