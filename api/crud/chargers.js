import Charger from "../models/charger.model.js";
import { Seller } from "../models/seller.model.js";




const prefix = "/images/chargers/";

export async function initChargers() {
  try {
    const count = await Charger.countDocuments();

    if (count === 0) {
      const seller = await Seller.findOne({ role: "seller" });
      await Charger.insertMany([
        {
          id: "chg001",
          title: "Apple 20W USB-C Power Adapter",
          image: prefix + "apple_20w.webp",
          brand: "Apple",
          wattage: "20",
          type: "USB C",
          originalPrice: 1900,
          discount: 10,
          outputCurrent: "3A",

          sellerId: seller._id,
          stock: 10,
          isActive: true
        },
        {
          id: "chg002",
          title: "Samsung 25W Fast Charger",
          image: prefix + "samsung_25.webp",
          brand: "Samsung",
          wattage: "25",
          type: "USB C",
          originalPrice: 1800,
          discount: 5,
          outputCurrent: "2.5A",

          sellerId: seller._id,
          stock: 10,
          isActive: true
        }
      ]);

      console.log("✅ Chargers initialized");
    } else {
      console.log("✅ Chargers already exist");
    }
  } catch (err) {
    console.error("❌ Error initializing chargers:", err);
  }
}

export async function getAllChargers() {
  try {
    const chargers = await Charger.find().lean();

    return chargers.map(c => ({
      id: c.id,
      title: c.title,
      image: c.image,
      brand: c.brand,
      wattage: c.wattage,
      type: c.type,
      originalPrice: c.originalPrice,
      discount: c.discount,
      outputCurrent: c.outputCurrent,

      stock: c.stock,
      sellerId: c.sellerId,
      isActive: c.isActive
    }));
  } catch (error) {
    console.error("Error getting chargers:", error);
    throw error;
  }
}

export async function getChargerById(id) {
  try {
    const charger = await Charger.findOne({ id }).lean();

    if (!charger) return null;

    return {
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      originalPrice: charger.originalPrice,
      discount: charger.discount,
      outputCurrent: charger.outputCurrent,

      stock: charger.stock,
      sellerId: charger.sellerId,
      isActive: charger.isActive
    };
  } catch (error) {
    console.error("Error getting charger:", error);
    throw error;
  }
}

export async function addCharger(data) {
  try {
    const {
      id,
      title,
      image,
      brand,
      wattage,
      type,
      originalPrice,
      discount,
      outputCurrent,
      sellerId,
      stock
    } = data;

    await Charger.create({
      id,
      title,
      image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
      brand,
      wattage,
      type,
      originalPrice,
      discount,
      outputCurrent,

      sellerId,
      stock,
      isActive: true
    });

    return { success: true, id };
  } catch (error) {
    console.error("Error adding charger:", error);
    return { success: false, message: error.message };
  }
}

export async function updateCharger(id, data) {
  try {
    const {
      title,
      image,
      brand,
      wattage,
      type,
      originalPrice,
      discount,
      outputCurrent,
      stock,
      isActive
    } = data;

    await Charger.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
          brand,
          wattage,
          type,
          originalPrice,
          discount,
          outputCurrent,
          stock,
          isActive
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating charger:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteCharger(id) {
  try {
    const result = await Charger.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error("Error deleting charger:", error);
    return { success: false, message: error.message };
  }
}