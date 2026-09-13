import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserAddress {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface ISizeProfile {
  category: string;
  size: string;
}

export interface ICommPreferences {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  image?: string;
  passwordHash?: string;
  role: "customer" | "staff" | "admin";
  addresses: IUserAddress[];
  sizeProfile?: ISizeProfile[];
  commPreferences?: ICommPreferences;
  isRestrictedFromCOD: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  googleId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserAddressSchema = new Schema<IUserAddress>({
  label: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  addressLine1: { type: String },
  addressLine2: { type: String },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const SizeProfileSchema = new Schema<ISizeProfile>(
  {
    category: { type: String, required: true },
    size: { type: String, required: true },
  },
  { _id: false }
);

const CommPreferencesSchema = new Schema<ICommPreferences>(
  {
    whatsapp: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    image: { type: String },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },
    addresses: [UserAddressSchema],
    sizeProfile: { type: [SizeProfileSchema], default: [] },
    commPreferences: {
      type: CommPreferencesSchema,
      default: () => ({ whatsapp: true, email: true, sms: true }),
    },
    isRestrictedFromCOD: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
