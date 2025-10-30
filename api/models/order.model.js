import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

export default Order;