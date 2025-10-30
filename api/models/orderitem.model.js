import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  item_type: { type: String, required: true },
  item_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  accessory: { type: Object, required: true },
});
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;   