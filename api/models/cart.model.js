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
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    seller_id: {
      type: String,
      default: null,
    },
    item: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    added_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema({
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
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.index({ user_id: 1, updated_at: -1 });
cartSchema.index({ "items.productType": 1, "items.productId": 1 });

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
