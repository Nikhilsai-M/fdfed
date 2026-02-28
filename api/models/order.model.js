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

  product_id: {
    type: String,
    required: true
  },

  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },

  quantity: {
    type: Number,
    default: 1
  },

  total_amount: {
    type: Number,
    required: true
  },

  payment_method: {
    type: String,
    required: true
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

const Order = mongoose.model("Order", orderSchema);

export default Order;