import Order from "../models/order.model.js";

export const getSellerDashboard = async (req, res) => {

  try {

    const sellerId = req.user.id;

    const orders = await Order.find({ seller_id: sellerId });

    const revenue = orders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    res.json({
      success: true,
      stats: {
        totalOrders: orders.length,
        revenue
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};