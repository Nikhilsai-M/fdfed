import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productType: {
      type: String,
      required: true,
      enum: ["phone", "laptop", "charger", "earphone", "mouse", "smartwatch"],
    },
    productId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: null,
    },
    available: {
      type: Boolean,
      default: true,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
