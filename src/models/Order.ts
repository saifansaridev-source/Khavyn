import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  styleCode: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  hsnCode?: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  /** Sum of (price × qty) for all items — does NOT include shippingCharge */
  subtotal: number;
  /** Flat shipping charge applied to the order (e.g. ₹70) */
  shippingCharge: number;
  /** subtotal + shippingCharge = the total amount charged to the customer */
  totalAmount: number;
  /** "prepaid" = 100% paid upfront via Razorpay; "partial_cod" = 50% advance via Razorpay + 50% cash on delivery.
   *  Legacy DB documents may have paymentType="full" — treat as equivalent to "prepaid" when reading. */
  paymentType: "prepaid" | "partial_cod";
  /** Amount charged via Razorpay at order time */
  advancePaid: number;
  /** Amount to be collected at delivery (0 for full prepaid) */
  balanceDue: number;
  /** Whether the COD balance has been collected by the delivery agent */
  balancePaymentStatus: "pending" | "collected";
  /** Backward compatible flag: true when balancePaymentStatus === 'collected' */
  balanceCollected?: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Return Requested"
    | "Returned";
  shippingAddress: IShippingAddress;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  styleCode: { type: String, required: true },
  colour: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  hsnCode: { type: String, default: "6205" },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, required: true, default: 70 },
    totalAmount: { type: Number, required: true },
    // "full" is kept in the enum only for backward-compatibility with existing DB documents (treat as "prepaid")
    paymentType: { type: String, enum: ["prepaid", "partial_cod", "full"], required: true },
    advancePaid: { type: Number, required: true },
    balanceDue: { type: Number, required: true },
    balancePaymentStatus: {
      type: String,
      enum: ["pending", "collected"],
      default: "pending",
    },
    balanceCollected: { type: Boolean, default: false },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Returned",
      ],
      default: "Pending",
    },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
