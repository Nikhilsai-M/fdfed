import Seller from "../models/seller.model.js";
import OrderItem from "../models/orderitem.model.js";
import Mouse from "../models/mouse.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Smartwatch from "../models/smartwatch.model.js";

export const getSellerProfileAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    /* ---------------- SELLER INFO ---------------- */
    const seller = await Seller.findById(sellerId).select("-password");

    /* ---------------- SELLER PRODUCTS COUNT ---------------- */
    const mouseCount = await Mouse.countDocuments({ sellerId });
    const chargerCount = await Charger.countDocuments({ sellerId });
    const earphoneCount = await Earphone.countDocuments({ sellerId });
    const watchCount = await Smartwatch.countDocuments({ sellerId });

    const totalProducts =
      mouseCount + chargerCount + earphoneCount + watchCount;

    /* ---------------- SELLER ORDERS ---------------- */
    const sellerItems = await OrderItem.find({ seller_id: sellerId });

    const totalOrders = new Set(
      sellerItems.map(item => item.order_id)
    ).size;

    /* ---------------- SELLER BRAND WISE SALES ---------------- */
    const brandWise = {};
    const typeWise = {};
    const revenueTypeWise = {};

    sellerItems.forEach(item => {
      const brand = item.accessory?.brand || "Unknown";
      const type = item.item_type;

      // brand count
      brandWise[brand] = (brandWise[brand] || 0) + item.quantity;

      // type count
      typeWise[type] = (typeWise[type] || 0) + item.quantity;

      // revenue by type
      revenueTypeWise[type] =
        (revenueTypeWise[type] || 0) + Number(item.amount);
    });

  const allItems = await OrderItem.find({
  item_type: { $in: ["earphone", "charger", "mouse", "smartwatch"] }
});

    const siteBrandWise = {};
    const siteTypeWise = {};

allItems.forEach(item => {
  const brand = item.accessory?.brand || "Unknown";
  const type = item.item_type;

  siteBrandWise[brand] = (siteBrandWise[brand] || 0) + item.quantity;
  siteTypeWise[type] = (siteTypeWise[type] || 0) + item.quantity;
});
   const totalRevenue = sellerItems.reduce(
  (sum, item) => sum + Number(item.amount || 0),
  0
);

// NEVER call toFixed on undefined
const formattedRevenue = Number(totalRevenue).toFixed(2);

    res.json({
      success: true,
      data: {
        seller,
        stats: {
          totalProducts,
          totalOrders,
          revenue: formattedRevenue
        },
       
        sellerBrandWise: brandWise,
        sellerTypeWise: typeWise,
        sellerRevenueTypeWise: revenueTypeWise,
        siteBrandWise,
        siteTypeWise
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