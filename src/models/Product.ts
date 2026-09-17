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
  S?: number;
  M?: number;
  L?: number;
  XL?: number;
  XS?: number;
  XXL?: number;
  [key: string]: number | undefined;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  collectionName: string;
  styleCode: string;
  /** GST HSN code for garment classification (e.g., 6205 for shirts, 6109 for t-shirts) */
  hsnCode?: string;
  colour: string;
  colourHex: string;
  colourRgb?: string;
  sizes: string[];
  stock: IProductStock;
  price: number;
  compareAtPrice?: number;
  images: IProductImages;
  videoUrl?: string;
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
  customBadge?: string;
  returnPolicyApplicable?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImagesSchema = new Schema<IProductImages>({
  front: { type: String, required: true },
  side: { type: String, default: "" },
  back: { type: String, default: "" },
  angle45: { type: String, default: "" },
  fabricTexture: { type: String, default: "" },
  embroidery: { type: String, default: "" },
  collarLabel: { type: String, default: "" },
  modelFront: { type: String, default: "" },
  modelSide: { type: String, default: "" },
  modelBack: { type: String, default: "" },
  model45: { type: String, default: "" },
});

const ProductStockSchema = new Schema<IProductStock>(
  {
    S: { type: Number, default: 15 },
    M: { type: Number, default: 25 },
    L: { type: Number, default: 20 },
    XL: { type: Number, default: 10 },
    XS: { type: Number, default: 0 },
    XXL: { type: Number, default: 0 },
  },
  { strict: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    collectionName: {
      type: String,
      required: true,
      index: true,
    },
    styleCode: { type: String, required: true, unique: true },
    hsnCode: { type: String, default: "6205" },
    colour: { type: String, required: true },
    colourHex: { type: String, required: true },
    colourRgb: { type: String, default: "" },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    stock: { type: ProductStockSchema, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: { type: ProductImagesSchema, required: true },
    videoUrl: { type: String, default: "" },
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
    customBadge: { type: String },
    returnPolicyApplicable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
