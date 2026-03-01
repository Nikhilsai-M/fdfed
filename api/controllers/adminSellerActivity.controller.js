import OrderItem from "../models/orderitem.model.js";
import Seller from "../models/seller.model.js";

const getStartDate = (range) => {
  const days = Number(range || 30);
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
};

/*
====================================================
TOP SELLERS (SHOW ALL SELLERS EVEN WITH 0 SALES)
====================================================
*/
export const getTopSellerActivity = async (req, res) => {
  try {
    const { range = 30, limit = 10 } = req.query;
    const startDate = getStartDate(range);

    const data = await Seller.aggregate([
      {
        $lookup: {
          from: "orderitems",
          let: { sellerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$seller_id", "$$sellerId"] },
                created_at: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: "$seller_id",
                itemsSold: { $sum: "$quantity" },
                revenue: { $sum: "$amount" },
              },
            },
          ],
          as: "sales",
        },
      },

      // ✅ step 1: sales array -> single object (or null)
      {
        $addFields: {
          sales: { $arrayElemAt: ["$sales", 0] },
        },
      },

      // ✅ step 2: create numeric values
      {
        $addFields: {
          itemsSold: { $ifNull: ["$sales.itemsSold", 0] },
          revenue: { $ifNull: ["$sales.revenue", 0] },
        },
      },

      // ✅ step 3: force to number types (prevents array/type sort issue)
      {
        $addFields: {
          itemsSold: { $toInt: "$itemsSold" },
          revenue: { $toDouble: "$revenue" },
        },
      },

      {
        $project: {
          _id: 1,
          sellerName: "$name",
          itemsSold: 1,
          revenue: 1,
        },
      },

      { $sort: { itemsSold: -1, revenue: -1 } },
      { $limit: Number(limit) },
    ]);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Top Seller Activity Error:", err);
    return res.status(500).json({ success: false, message: "Failed to load top sellers" });
  }
};

/*
====================================================
SELLER SALES TREND (TOP SELLERS ONLY)
====================================================
*/
export const getSellerTrend = async (req, res) => {
  try {
    const { range = 30, top = 3 } = req.query;
    const startDate = getStartDate(range);

    const topSellers = await OrderItem.aggregate([
      {
        $match: {
          seller_id: { $ne: null },
          created_at: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$seller_id",
          itemsSold: { $sum: "$quantity" },
        },
      },
      { $sort: { itemsSold: -1 } },
      { $limit: Number(top) },
    ]);

    const sellerIds = topSellers.map((s) => s._id);

    const trend = await OrderItem.aggregate([
      {
        $match: {
          seller_id: { $in: sellerIds },
          created_at: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
            },
            seller: "$seller_id",
          },
          items: { $sum: "$quantity" },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.date": 1 } },
      {
        $lookup: {
          from: "sellers",
          localField: "_id.seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $addFields: { seller: { $arrayElemAt: ["$seller", 0] } } },
      {
        $project: {
          _id: 1,
          items: 1,
          revenue: 1,
          sellerName: "$seller.storeName",
        },
      },
    ]);

    return res.json({ success: true, trend });
  } catch (err) {
    console.error("Trend Error:", err);
    return res.status(500).json({ success: false, message: "Failed to load trend" });
  }
};