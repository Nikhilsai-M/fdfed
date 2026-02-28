import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import Charger from "../models/charger.model.js";
import Earphone from "../models/earphone.model.js";
import Mouse from "../models/mouse.model.js";
import Smartwatch from "../models/smartwatch.model.js";

const modelMap = {
  phones: Phone,
  laptops: Laptop,
  chargers: Charger,
  earphones: Earphone,
  mouses: Mouse,
  smartwatches: Smartwatch,
};

export const getProductTotals = async (req, res) => {
  try {
    const [
      phones,
      laptops,
      chargers,
      earphones,
      mouses,
      smartwatches,
    ] = await Promise.all([
      Phone.countDocuments(),
      Laptop.countDocuments(),
      Charger.countDocuments(),
      Earphone.countDocuments(),
      Mouse.countDocuments(),
      Smartwatch.countDocuments(),
    ]);

    return res.json({
      success: true,
      data: { phones, laptops, chargers, earphones, mouses, smartwatches },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBrandWiseByCategory = async (req, res) => {
  try {
    const category = String(req.params.category || "").toLowerCase();
    const Model = modelMap[category];

    if (!Model) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const rows = await Model.aggregate([
      { $match: { brand: { $exists: true, $ne: "" } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, brand: "$_id", count: 1 } },
    ]);

    return res.json({ success: true, data: rows });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};