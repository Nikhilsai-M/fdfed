import PhoneApplication from "../models/phoneApplication.model.js";
import LaptopApplication from "../models/laptopApplication.model.js";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";
import Order from "../models/order.model.js";

const pct = (cur, prev) => {
  if (!prev) return cur ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 100);
};

const coalesceTotalExpr = () => ({
  $ifNull: [
    "$total",
    { $ifNull: ["$totalAmount", { $ifNull: ["$grandTotal", { $ifNull: ["$amount", 0] }]}] }
  ]
});

const PAID_STATES = ["paid", "completed", "delivered", "success", "fulfilled"];

export const getAdminStatistics = async (req, res) => {
  try {
    const rangeDays = Math.max(1, Math.min(180, parseInt(req.query.range || "7", 10)));

    const now = new Date();
    const startThis = new Date(now); startThis.setDate(now.getDate() - rangeDays);
    const startPrev = new Date(startThis); startPrev.setDate(startThis.getDate() - rangeDays);


    const [
        totalPhoneApps, totalLaptopApps,
        phoneApproved, laptopApproved,
        phonePending, laptopPending,
        phoneRejected, laptopRejected
      ] = await Promise.all([
        PhoneApplication.countDocuments(),
        LaptopApplication.countDocuments(),
      

        PhoneApplication.countDocuments({ status: { $in: ["approved", "added_to_inventory"] } }),
        LaptopApplication.countDocuments({ status: { $in: ["approved", "added_to_inventory"] } }),
      
   
        PhoneApplication.countDocuments({ status: "pending" }),
        LaptopApplication.countDocuments({ status: "pending" }),
      

        PhoneApplication.countDocuments({ status: "rejected" }),
        LaptopApplication.countDocuments({ status: "rejected" })
      ]);
      
      

    const totalListings = totalPhoneApps + totalLaptopApps;
    const approvedListings = phoneApproved + laptopApproved;

   
    const [
      phonesCount, laptopsCount, chargersCount,
      earphonesCount, mousesCount, watchesCount
    ] = await Promise.all([
      Phone.countDocuments(),
      Laptop.countDocuments(),
      Charger.countDocuments(),
      Earphone.countDocuments(),
      Mouse.countDocuments(),
      Smartwatch.countDocuments(),
    ]);

    
    const [salesAggThis] = await Order.aggregate([
      { $match: { created_at: { $gte: startThis, $lte: now }, status: { $in: PAID_STATES } } },
      { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: coalesceTotalExpr() } } }
    ]);

    const [salesAggPrev] = await Order.aggregate([
      { $match: { created_at: { $gte: startPrev, $lt: startThis }, status: { $in: PAID_STATES } } },
      { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: coalesceTotalExpr() } } }
    ]);

    const totalSales = salesAggThis?.orders || 0;
    const totalSalesRevenue = salesAggThis?.revenue || 0;
    const prevSales = salesAggPrev?.orders || 0;
    const prevRevenue = salesAggPrev?.revenue || 0;

    const trends = {
      totalSales: pct(totalSales, prevSales),
      totalListings: pct(totalListings, 0),
      approvedListings: pct(approvedListings, 0),
      totalSalesRevenue: pct(totalSalesRevenue, prevRevenue),
    };

    const salesByCategory = {
      phones: phonesCount,
      laptops: laptopsCount,
      chargers: chargersCount,
      earphones: earphonesCount,
      mouses: mousesCount,
      smartwatches: watchesCount,
    };

    
    const applicationStatus = {
      phone: { 
        pending: phonePending, 
        approved: phoneApproved, 
        rejected: phoneRejected 
      },
      laptop: { 
        pending: laptopPending, 
        approved: laptopApproved, 
        rejected: laptopRejected 
      },
    };

    console.log("📊 Admin Analytics Counts:", {
      phone: applicationStatus.phone,
      laptop: applicationStatus.laptop
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalSales,
        totalListings,
        approvedListings,
        totalSalesRevenue,
        trends,
        salesByCategory,
        applicationStatus,
      },
    });

  } catch (err) {
    console.error("Admin statistics error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
