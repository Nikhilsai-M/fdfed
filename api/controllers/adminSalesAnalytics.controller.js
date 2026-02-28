import mongoose from "mongoose";
import OrderItem from "../models/orderitem.model.js";

const getDateRange = (rangeDays) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - Number(rangeDays || 7));
  return { start, end };
};

const normCategory = (s) => {
  const v = String(s || "").toLowerCase().trim();
  if (v === "phone") return "phones";
  if (v === "laptop") return "laptops";
  if (v === "charger") return "chargers";
  if (v === "earphone" || v === "earphones") return "earphones";
  if (v === "mouse" || v === "mouses") return "mouses";
  if (v === "smartwatch" || v === "smartwatches") return "smartwatches";
  return v;
};

// Use created_at if present; otherwise use ObjectId timestamp
const buildDateExpr = () => ({
  $ifNull: ["$created_at", { $toDate: "$_id" }],
});

export const getCategorySalesPercent = async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.range);

    const rows = await OrderItem.aggregate([
      {
        $addFields: {
          __created: buildDateExpr(),
          __category: { $toLower: { $ifNull: ["$item_type", ""] } },
          __qty: { $ifNull: ["$quantity", 1] },
        },
      },
      { $match: { __created: { $gte: start, $lte: end } } },
      { $match: { __category: { $ne: "" } } },
      {
        $group: {
          _id: "$__category",
          sold: { $sum: "$__qty" },
        },
      },
      { $project: { _id: 0, category: "$_id", sold: 1 } },
    ]);

    // normalize + merge
    const map = {};
    for (const r of rows) {
      const c = normCategory(r.category);
      if (!c) continue;
      map[c] = (map[c] || 0) + (r.sold || 0);
    }

    const merged = Object.entries(map)
      .map(([category, sold]) => ({ category, sold }))
      .sort((a, b) => b.sold - a.sold);

    const total = merged.reduce((a, r) => a + r.sold, 0);
    const withPercent = merged.map((r) => ({
      ...r,
      percent: total ? Math.round((r.sold / total) * 100) : 0,
    }));

    return res.json({ success: true, data: withPercent, totalSold: total });
  } catch (e) {
    console.error("Sales categories error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBrandSalesPercentByCategory = async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.range);
    const categoryWanted = normCategory(req.params.category);

    const rows = await OrderItem.aggregate([
      {
        $addFields: {
          __created: buildDateExpr(),
          __category: { $toLower: { $ifNull: ["$item_type", ""] } },
          __qty: { $ifNull: ["$quantity", 1] },
          __brand: {
            $ifNull: [
              "$accessory.brand",
              { $ifNull: ["$accessory.Brand", { $ifNull: ["$accessory.company", "Unknown"] }] },
            ],
          },
        },
      },
      { $match: { __created: { $gte: start, $lte: end } } },
      { $match: { __category: { $ne: "" } } },
      {
        $project: {
          __created: 1,
          category: "$__category",
          brand: "$__brand",
          qty: "$__qty",
        },
      },
    ]);

    // normalize category filter in JS (because we normalize)
    const brandMap = {};
    for (const r of rows) {
      const c = normCategory(r.category);
      if (c !== categoryWanted) continue;
      const b = String(r.brand || "Unknown");
      brandMap[b] = (brandMap[b] || 0) + (Number(r.qty) || 0);
    }

    const merged = Object.entries(brandMap)
      .map(([brand, sold]) => ({ brand, sold }))
      .sort((a, b) => b.sold - a.sold);

    const total = merged.reduce((a, r) => a + r.sold, 0);
    const withPercent = merged.map((r) => ({
      ...r,
      percent: total ? Math.round((r.sold / total) * 100) : 0,
    }));

    return res.json({ success: true, data: withPercent, totalSold: total });
  } catch (e) {
    console.error("Sales brands error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};