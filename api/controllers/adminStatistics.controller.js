import PhoneApplication from "../models/phoneApplication.model.js";
import LaptopApplication from "../models/laptopApplication.model.js";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";

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

   
    
    const phoneAppsToSync = await PhoneApplication.find({ 
      status: 'added_to_inventory' 
    }).lean();
    
    const laptopAppsToSync = await LaptopApplication.find({ 
      status: 'added_to_inventory' 
    }).lean();

    console.log(`🔄 Found ${phoneAppsToSync.length} phone apps and ${laptopAppsToSync.length} laptop apps to sync`);
    console.log(`🔄 Phone IDs to sync:`, phoneAppsToSync.map(p => ({ id: p.id, status: p.status })));
    console.log(`🔄 Laptop IDs to sync:`, laptopAppsToSync.map(l => ({ id: l.id, status: l.status })));

    let phonesSynced = 0;
    for (const app of phoneAppsToSync) {
      const existingPhone = await Phone.findOne({ id: app.id });
      if (!existingPhone) {
        try {
          const basePrice = app.price || 10000;
          await Phone.create({
            id: app.id,
            brand: app.brand,
            model: app.model,
            color: 'Black',
            image: app.image_path || '/uploads/default-phone.jpg',
            processor: app.processor,
            display: app.size || '6.1 inches',
            battery: parseInt(app.battery) || 4000,
            camera: app.camera,
            os: app.os,
            network: app.network,
            weight: app.weight || '180g',
            ram: app.ram,
            rom: app.rom,
            base_price: Math.round(basePrice * 1.2),
            discount: 0,
            condition: 'Good',
          });
          phonesSynced++;
          console.log(`✅ Synced phone #${app.id} to inventory`);
        } catch (error) {
          if (error.code !== 11000) { 
            console.error(`❌ Error syncing phone #${app.id}:`, error.message);
          }
        }
      }
    }

    
    let laptopsSynced = 0;
    for (const app of laptopAppsToSync) {
      const existingLaptop = await Laptop.findOne({ id: app.id });
      if (!existingLaptop) {
        try {
          const basePrice = app.price || 50000;
          const storageMatch = (app.storage || '256GB SSD').match(/(\d+)\s*(GB|TB)\s*(SSD|HDD|NVMe)/i);
          const storageCapacity = storageMatch ? `${storageMatch[1]}${storageMatch[2]}` : '256GB';
          const storageType = storageMatch ? storageMatch[3] : 'SSD';

          await Laptop.create({
            id: app.id,
            brand: app.brand,
            series: app.model,
            processor_name: app.processor,
            processor_generation: app.generation || '',
            base_price: Math.round(basePrice * 1.2),
            discount: 0,
            ram: app.ram,
            storage_type: storageType,
            storage_capacity: storageCapacity,
            display_size: parseFloat(app.display_size) || 15.6,
            weight: parseFloat(app.weight) || 2.0,
            condition: 'Good',
            os: app.os || 'Windows 11',
            image: app.image_path || '/uploads/default-laptop.jpg',
          });
          laptopsSynced++;
          console.log(`✅ Synced laptop #${app.id} to inventory`);
        } catch (error) {
          if (error.code !== 11000) { 
            console.error(`❌ Error syncing laptop #${app.id}:`, error.message);
          }
        }
      }
    }

    if (phonesSynced > 0 || laptopsSynced > 0) {
      console.log(`✅ Sync complete: ${phonesSynced} phones and ${laptopsSynced} laptops synced`);
    }


    
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


    const response = {
      success: true,
      statistics: {
        totalSales,
        totalListings,
        approvedListings,
        totalSalesRevenue,
        trends,
        applicationStatus,
      },
    };

    res.status(200).json(response);

  } catch (err) {
    console.error("Admin statistics error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getSupervisorListings = async (req, res) => {
  try {
    
    const rangeDays = Math.max(1, Math.min(180, parseInt(req.query.range || "7", 10)));
    const now = new Date();
    const startThis = new Date(now); 
    startThis.setDate(now.getDate() - rangeDays);
    const startPrev = new Date(startThis); 
    startPrev.setDate(startThis.getDate() - rangeDays);

    const phoneApps = await PhoneApplication.find().sort({ created_at: -1 }).lean();
    const laptopApps = await LaptopApplication.find().sort({ created_at: -1 }).lean();

    const applications = [
      ...phoneApps.map(app => ({ ...app, type: 'phone' })),
      ...laptopApps.map(app => ({ ...app, type: 'laptop' }))
    ];

  
    const statusCounts = {
      phone: { pending: 0, approved: 0, addedToInventory: 0, rejected: 0 },
      laptop: { pending: 0, approved: 0, addedToInventory: 0, rejected: 0 },
    };

    applications.forEach((app) => {
      const type = app.type;
      const status = app.status || "pending";
      
      if (type === "phone" || type === "laptop") {
        if (status === "pending") {
          statusCounts[type].pending++;
        } else if (status === "approved") {
          statusCounts[type].approved++;
        } else if (status === "added_to_inventory") {
          statusCounts[type].addedToInventory++;
        } else if (status === "rejected") {
          statusCounts[type].rejected++;
        }
      }
    });

    
    const totalAddedToInventory = statusCounts.phone.addedToInventory + statusCounts.laptop.addedToInventory;

    
    const [currPhoneAdded, currLaptopAdded] = await Promise.all([
      PhoneApplication.countDocuments({ 
        status: "added_to_inventory",
        created_at: { $gte: startThis, $lte: now }
      }),
      LaptopApplication.countDocuments({ 
        status: "added_to_inventory",
        created_at: { $gte: startThis, $lte: now }
      })
    ]);

    const [prevPhoneAdded, prevLaptopAdded] = await Promise.all([
      PhoneApplication.countDocuments({ 
        status: "added_to_inventory",
        created_at: { $gte: startPrev, $lt: startThis }
      }),
      LaptopApplication.countDocuments({ 
        status: "added_to_inventory",
        created_at: { $gte: startPrev, $lt: startThis }
      })
    ]);

    const currTotalAdded = currPhoneAdded + currLaptopAdded;
    const prevTotalAdded = prevPhoneAdded + prevLaptopAdded;

    
    const trendAddedToInventory = pct(currTotalAdded, prevTotalAdded);

    res.status(200).json({
      success: true,
      applications,
      statusCounts,
      totalAddedToInventory,
      trendAddedToInventory
    });
  } catch (err) {
    console.error("Error fetching supervisor listings:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const range = req.query.range;
    const now = new Date();
    let startDate = null;

    if (range === "7d") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    } else if (range === "90d") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 90);
    }

    const match = startDate
      ? { created_at: { $gte: startDate, $lte: now } }
      : {};

    const totalRevenueAgg = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" }
        }
      }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    res.status(200).json({
      totalRevenue,
      revenueByCategory: [] // your Order model doesn't have category
    });

  } catch (error) {
    console.error("Revenue error:", error);
    res.status(500).json({ message: "Revenue fetch failed" });
  }
};

export const getCategoryRevenueAnalytics = async (req, res) => {
  try {
    const range = req.query.range || "90d";
    const now = new Date();
    let startDate = new Date();

    if (range === "7d") startDate.setDate(now.getDate() - 7);
    else if (range === "30d") startDate.setDate(now.getDate() - 30);
    else startDate.setDate(now.getDate() - 90);

    /* =========================
       CATEGORY REVENUE
    ========================== */
    const categoryRevenue = await OrderItem.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: now }
        }
      },
      {
        $addFields: {
          normalizedType: {
            $toLower: { $ifNull: ["$item_type", "other"] }
          }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ["$normalizedType", "phone"] }, then: "PHONE" },
                { case: { $eq: ["$normalizedType", "laptop"] }, then: "LAPTOP" },
                { case: { $eq: ["$normalizedType", "charger"] }, then: "CHARGER" },
                { case: { $eq: ["$normalizedType", "earphone"] }, then: "EARPHONE" },
                { case: { $eq: ["$normalizedType", "mouse"] }, then: "MOUSE" },
                { case: { $eq: ["$normalizedType", "smartwatch"] }, then: "SMARTWATCH" }
              ],
              default: "OTHER"
            }
          },
          revenue: {
            $sum: { $multiply: ["$quantity", "$amount"] }
          }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    /* =========================
       BRAND REVENUE (SAFE)
    ========================== */
    const brandRevenue = await OrderItem.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: now }
        }
      },
      {
        $addFields: {
          safeBrand: {
            $ifNull: [
              { $ifNull: ["$accessory.brand", null] },
              "Unknown"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$safeBrand",
          revenue: {
            $sum: { $multiply: ["$quantity", "$amount"] }
          }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    return res.json({
      success: true,
      categoryRevenue,
      brandRevenue
    });

  } catch (error) {
    console.error("Revenue Category Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const debugOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.find().limit(5);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import { Supervisor } from "../models/supervisor.model.js";

export const getSupervisorAnalytics = async (req, res) => {
  try {
    const supervisors = await Supervisor.find().lean();

    const result = [];

    for (const sup of supervisors) {
      let approved = 0;
      let rejected = 0;
      let pending = 0;

      if (sup.type === "phone") {
        approved = await PhoneApplication.countDocuments({
          status: { $in: ["approved", "added_to_inventory"] }
        });

        rejected = await PhoneApplication.countDocuments({
          status: "rejected"
        });

        pending = await PhoneApplication.countDocuments({
          status: "pending"
        });

      } else if (sup.type === "laptop") {
        approved = await LaptopApplication.countDocuments({
          status: { $in: ["approved", "added_to_inventory"] }
        });

        rejected = await LaptopApplication.countDocuments({
          status: "rejected"
        });

        pending = await LaptopApplication.countDocuments({
          status: "pending"
        });
      }

      result.push({
        name: `${sup.first_name} ${sup.last_name}`,
        approved,
        rejected,
        pending,
        total: approved + rejected + pending
      });
    }

    res.json({
      success: true,
      data: {
        supervisors: result
      }
    });

  } catch (err) {
    console.error("Supervisor analytics error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch supervisor analytics"
    });
  }
};