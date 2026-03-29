import Counter from "../models/counter.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderitem.model.js";
import User from "../models/user.model.js";

import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";

export async function createOrder(userId, totalAmount, paymentMethod, items, options = {}) {
  try {
    if (!userId || !totalAmount || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return { success: false, message: "Invalid order data" };
    }

    const {
      orderStatus = "Confirmed",
      paymentStatus = paymentMethod === "cod" ? "pending" : "success",
      paymentId = null,
      razorpayOrderId = null,
    } = options;

    const counter = await Counter.findOneAndUpdate(
      { _id: "order_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const orderId = `order_${counter.seq}`;

    const orderItems = [];

    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount) {
        return { success: false, message: "Invalid item data" };
      }

      const itemId = String(item.id).trim();
      const type = item.type.toLowerCase();

      let product;

      switch (type) {
        case "phone":
          product = await Phone.findOne({ id: itemId });
          break;

        case "laptop":
          product = await Laptop.findOne({ id: itemId });
          break;

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
          return { success: false, message: `Invalid item type: ${item.type}` };
      }

      if (!product) {
        return { success: false, message: `${type} with ID ${itemId} not found` };
      }

      // ⭐ FIX: include seller_id
      orderItems.push({
        order_id: orderId,
        item_type: type,
        item_id: itemId,
        seller_id: product.sellerId || null,
        quantity: item.quantity,
        amount: item.amount,
        accessory: item.accessory || {},
      });
    }

    // Save order
    const order = new Order({
      order_id: orderId,
      user_id: userId,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      payment_id: paymentId,
      razorpay_order_id: razorpayOrderId,
      order_status: orderStatus,
      created_at: new Date(),
    });

    await order.save();

    await OrderItem.insertMany(orderItems);

    // 🔥 Remove second-hand items (phones & laptops) after sale
    for (const item of items) {
      const type = item.type.toLowerCase();
      const itemId = String(item.id);

    if (type === "phone") {
  await Phone.deleteOne({ id: itemId });
}

else if (type === "laptop") {
  await Laptop.deleteOne({ id: itemId });
}

else if (type === "charger") {
  await Charger.updateOne(
    { id: itemId },
    { $inc: { stock: -item.quantity } }
  );
}

else if (type === "earphone") {
  await Earphone.updateOne(
    { id: itemId },
    { $inc: { stock: -item.quantity } }
  );
}

else if (type === "mouse") {
  await Mouse.updateOne(
    { id: itemId },
    { $inc: { stock: -item.quantity } }
  );
}

else if (type === "smartwatch") {
  await Smartwatch.updateOne(
    { id: itemId },
    { $inc: { stock: -item.quantity } }
  );
}
    }

    // increment user's order count
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
      .sort({ created_at: -1 })
      .lean();

    const orderIds = orders.map((order) => order.order_id);

    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();

    return orders.map((order) => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status || "pending",
      orderStatus: order.order_status || "Pending",
      paymentId: order.payment_id || null,
      razorpayOrderId: order.razorpay_order_id || null,
      timestamp: order.created_at,
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
    console.error("❌ Error in getOrdersByUserId:", error);
    return [];
  }
}

export async function getAllOrders() {
  try {
    const orders = await Order.find().sort({ created_at: -1 }).lean();

    const orderIds = orders.map((order) => order.order_id);

    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();

    return orders.map((order) => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status || "pending",
      orderStatus: order.order_status || "Pending",
      paymentId: order.payment_id || null,
      razorpayOrderId: order.razorpay_order_id || null,
      timestamp: order.created_at,
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
    console.error("❌ Error in getAllOrders:", error);
    return [];
  }
}
