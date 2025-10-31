import Counter from "../models/counter.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderitem.model.js";
import User from "../models/user.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";
//import Phone from "../models/phone.model.js";
//import Laptop from "../models/laptop.model.js";
export async function createOrder(userId, totalAmount, paymentMethod, items) {
  try {
    // Validate inputs
    if (!userId || !totalAmount || !paymentMethod || !items || !Array.isArray(items)) {
      console.error('Invalid order data:', { userId, totalAmount, paymentMethod, items });
      return { success: false, message: 'Invalid order data' };
    }

    // Generate order ID
    const counter = await Counter.findOneAndUpdate(
      { _id: 'order_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `order_${counter.seq}`;

    // Create order items
    const orderItems = [];
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount) {
        console.error('Invalid item data:', item);
        return { success: false, message: 'Invalid item data' };
      }

      // Normalize ID to string
      const itemId = String(item.id);

      // Verify item exists in inventory
      let product;
      switch (item.type.toLowerCase()) {
       /* case 'phone':
          product = await Phone.findOne({ id: itemId });
          break;
        case 'laptop':
          product = await Laptop.findOne({ id: itemId });
          break;*/
        case 'charger':
          product = await Charger.findOne({ id: itemId });
          break;
        case 'earphone':
          product = await Earphone.findOne({ id: itemId });
          break;
        case 'mouse':
          product = await Mouse.findOne({ id: itemId });
          break;
        case 'smartwatch':
          product = await Smartwatch.findOne({ id: itemId });
          break;
        default:
          console.error('Invalid item type:', item.type);
          return { success: false, message: `Invalid item type: ${item.type}` };
      }

      if (!product) {
        console.error(`Item not found: type=${item.type}, id=${itemId}`);
        return { success: false, message: `${item.type} with ID ${itemId} not found` };
      }

      orderItems.push({
        order_id: orderId,
        item_type: item.type,
        item_id: itemId,
        quantity: item.quantity,
        amount: item.amount,
        accessory: item.accessory,
      });
    }

    // Save order
    const order = new Order({
      order_id: orderId,
      user_id: userId,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: 'pending',
      created_at: new Date(),
    });
    await order.save();
    console.log(`Order saved: ${orderId}`);

    // Save order items
    await OrderItem.insertMany(orderItems);
    console.log(`Order items saved for order: ${orderId}`);

    // Delete items from inventory
    for (const item of items) {
      const itemId = String(item.id);
      console.log(`Attempting to delete item: type=${item.type}, id=${itemId}`);
      let deleteResult;
      switch (item.type.toLowerCase()) {
        /*case 'phone':
          deleteResult = await Phone.deleteOne({ id: itemId });
          break;
        case 'laptop':
          deleteResult = await Laptop.deleteOne({ id: itemId });
          break;*/
        case 'charger':
          deleteResult = await Charger.deleteOne({ id: itemId });
          break;
        case 'earphone':
          deleteResult = await Earphone.deleteOne({ id: itemId });
          break;
        case 'mouse':
          deleteResult = await Mouse.deleteOne({ id: itemId });
          break;
        case 'smartwatch':
          deleteResult = await Smartwatch.deleteOne({ id: itemId });
          break;
      }
      console.log(`Deletion result for ${item.type} id=${itemId}:`, deleteResult);
      if (deleteResult.deletedCount === 0) {
        console.warn(`No item deleted: type=${item.type}, id=${itemId}`);
      }
    }

    // Update User's order count
    await User.updateOne(
      { user_id: userId },
      { $inc: { orders_count: 1 } }
    );

    return { success: true, orderId };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Failed to create order: ' + error.message };
  }
}
export async function getOrdersByUserId(userId) {
  try {
    const orders = await Order.find({ user_id: userId })
      .sort({ createdAt: -1 }) // Use createdAt (Mongoose default)
      .lean();
    
    const orderIds = orders.map(order => order.order_id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();
    
    return orders.map(order => ({
      orderId: order.order_id,          // Rename to orderId
      totalAmount: order.total_amount,  // Rename to totalAmount
      paymentMethod: order.payment_method, // Rename to paymentMethod
      timestamp: order.createdAt,       // Rename createdAt to timestamp
      items: orderItems
        .filter(item => item.order_id === order.order_id)
        .map(item => ({
          type: item.item_type,           // Rename to type
          id: item.item_id,               // Rename to id
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory
        }))
    }));
  } catch (error) {
    console.error('Error getting orders by user ID:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function getAllOrders() {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();
    
    const orderIds = orders.map(order => order.order_id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();
    
    return orders.map(order => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      timestamp: order.createdAt,
      items: orderItems
        .filter(item => item.order_id === order.order_id)
        .map(item => ({
          type: item.item_type,
          id: item.item_id,
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory
        }))
    }));
  } catch (error) {
    console.error('Error getting all orders:', error);
    return [];
  }
}