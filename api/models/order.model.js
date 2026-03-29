import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  order_id: {
    type: String,
    required: true,
    unique: true
  },

  user_id: {
    type: String,
    required: true
  },

  total_amount: {
    type: Number,
    required: true
  },

  payment_method: {
    type: String,
    required: true
  },

  payment_status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  payment_id: {
    type: String,
    default: null
  },

  razorpay_order_id: {
    type: String,
    default: null
  },

  order_status: {
    type: String,
    default: "Pending"
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
