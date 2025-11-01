import Counter from "../models/counter.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderitem.model.js";
import User from "../models/user.model.js";

import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";
// import Phone from "../models/phone.model.js";
// import Laptop from "../models/laptop.model.js";

export async function createOrder(userId, totalAmount, paymentMethod, items) {
  try {
    // ✅ Basic validation
    if (!userId || !totalAmount || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid order data:", { userId, totalAmount, paymentMethod, items });
      return { success: false, message: "Invalid order data" };
    }

    // ✅ Generate incremental order ID
    const counter = await Counter.findOneAndUpdate(
      { _id: "order_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `order_${counter.seq}`;

    // ✅ Validate and collect order items
    const orderItems = [];
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount) {
        console.error("Invalid item data:", item);
        return { success: false, message: "Invalid item data" };
      }

      const itemId = String(item.id);
      let product;

      switch (item.type.toLowerCase()) {
        // case "phone":
        //   product = await Phone.findOne({ id: itemId });
        //   break;
        // case "laptop":
        //   product = await Laptop.findOne({ id: itemId });
        //   break;
        case "charger":
          product = await Charger.findOne({ id: itemId });
          break;
        case "earphone":
          product = await Earphone.findOne({ id: itemId });
          break;
        case "mouse":
          product = await Mouse.findOne({ id: itemId });
          break;
        case "smartwatch":
          product = await Smartwatch.findOne({ id: itemId });
          break;
        default:
          console.error("Invalid item type:", item.type);
          return { success: false, message: `Invalid item type: ${item.type}` };
      }

      if (!product) {
        console.error(`❌ Item not found: type=${item.type}, id=${itemId}`);
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

    // ✅ Save main order
    const order = new Order({
      order_id: orderId,
      user_id: userId,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: "pending",
      created_at: new Date(),
    });
    await order.save();
    console.log(`✅ Order saved: ${orderId}`);

    // ✅ Save all order items
    await OrderItem.insertMany(orderItems);
    console.log(`🧾 Order items saved for order: ${orderId}`);

    // ✅ Delete only second-hand products (phones, laptops)
    for (const item of items) {
      const type = item.type.toLowerCase();
      const itemId = String(item.id);

      if (type === "phone" || type === "laptop") {
        console.log(`🗑️ Deleting sold second-hand item: type=${type}, id=${itemId}`);
        let deleteResult;
        switch (type) {
          case "phone":
            // deleteResult = await Phone.deleteOne({ id: itemId });
            break;
          case "laptop":
            // deleteResult = await Laptop.deleteOne({ id: itemId });
            break;
        }
        if (deleteResult?.deletedCount > 0) {
          console.log(`✅ Deleted ${type} id=${itemId} from inventory`);
        } else {
          console.warn(`⚠️ No ${type} deleted (may not exist): id=${itemId}`);
        }
      } else {
        console.log(`ℹ️ Keeping accessory in stock: type=${type}, id=${itemId}`);
      }
    }

    // ✅ Increment user's order count
    await User.updateOne({ user_id: userId }, { $inc: { orders_count: 1 } });

    return { success: true, orderId };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return { success: false, message: "Failed to create order: " + error.message };
  }
}

export async function getOrdersByUserId(userId) {
  try {
    const orders = await Order.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = orders.map((order) => order.order_id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();

    return orders.map((order) => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      timestamp: order.createdAt,
      items: orderItems
        .filter((item) => item.order_id === order.order_id)
        .map((item) => ({
          type: item.item_type,
          id: item.item_id,
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory,
        })),
    }));
  } catch (error) {
    console.error("❌ Error getting orders by user ID:", error);
    return [];
  }
}

export async function getAllOrders() {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const orderIds = orders.map((order) => order.order_id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();

    return orders.map((order) => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      timestamp: order.createdAt,
      items: orderItems
        .filter((item) => item.order_id === order.order_id)
        .map((item) => ({
          type: item.item_type,
          id: item.item_id,
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory,
        })),
    }));
  } catch (error) {
    console.error("❌ Error getting all orders:", error);
    return [];
  }
}
