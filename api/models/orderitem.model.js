import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({

  order_id: {
    type: String,
    required: true
  },

  item_type: {
    type: String,
    required: true
  },

  item_id: {
    type: String,
    required: true
  },

  seller_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Seller",
  default: null
},

  quantity: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  accessory: {
    type: Object,
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;   