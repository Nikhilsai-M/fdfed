import OrderItem from "../models/orderitem.model.js";

export function getSellerDashboardCacheKey(sellerId) {
  return `seller-dashboard:${sellerId}`;
}

export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const sellerItems = await OrderItem.find({
      seller_id: sellerId
    });

    const revenue = sellerItems.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalOrders = new Set(
      sellerItems.map(item => item.order_id)
    ).size;

    res.json({
      success: true,
      stats: {
      totalOrders,
        revenue: Number(revenue.toFixed(2))
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
