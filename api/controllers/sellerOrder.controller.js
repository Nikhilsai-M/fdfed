import Order from "../models/order.model.js";
import OrderItem from "../models/orderitem.model.js";

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id; // from verifySellerToken

    // 1️⃣ Get all order items belonging to this seller
    const sellerItems = await OrderItem.find({
      seller_id: sellerId
    }).lean();

    if (!sellerItems.length) {
      return res.json({
        success: true,
        orders: []
      });
    }

    // 2️⃣ Get unique order IDs
    const orderIds = [
      ...new Set(sellerItems.map(item => item.order_id))
    ];

    // 3️⃣ Fetch main orders
    const orders = await Order.find({
      order_id: { $in: orderIds }
    })
      .sort({ created_at: -1 })
      .lean();

    // 4️⃣ Attach only this seller's items to each order
    const formattedOrders = orders.map(order => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      orderStatus: order.order_status,
      date: order.created_at,
      items: sellerItems
        .filter(item => item.order_id === order.order_id)
        .map(item => ({
          type: item.item_type,
          id: item.item_id,
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory
        }))
    }));

    return res.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error("❌ Error fetching seller orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};