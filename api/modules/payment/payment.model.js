import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    default: null,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  razorpay_order_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  razorpay_payment_id: {
    type: String,
    default: null,
    index: true,
  },
  razorpay_signature: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
    index: true,
  },
  paymentMethod: {
    type: String,
    default: "razorpay",
  },
  checkoutPayload: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  logs: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
