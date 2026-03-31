import Smartwatch from "../models/smartwatch.model.js";


import { Seller } from "../models/seller.model.js";




const prefix = "/images/smartwatches/";
export async function initSmartwatches() {
  try {
    const smartwatchCount = await Smartwatch.countDocuments();

    if (smartwatchCount === 0) {
      const seller = await Seller.findOne({ role: "seller" });
      await Smartwatch.insertMany([
        {
          id: "sw1",
          title: "Apple Watch Series 8",
          image: prefix + "Apple Watch Series8.webp",
          brand: "Apple",
          originalPrice: 55900,
          discount: 5,
          displaySize: "41",
          displayType: "Retina Display",
          batteryRuntime: "18",

          // NEW FIELDS
          sellerId: seller._id,
          stock: 10,
          isActive: true,
        },
        {
          id: "sw2",
          title: "Apple Watch Series 10",
          image: prefix + "Apple Watch Series10.webp",
          brand: "Apple",
          originalPrice: 49900,
          discount: 5,
          displaySize: "46",
          displayType: "Retina Display",
          batteryRuntime: "18",

          sellerId: seller._id,
          stock: 10,
          isActive: true,
        }
      ]);

      console.log("✅ Smartwatches initialized");
    } else {
      console.log("✅ Smartwatches already exist");
    }
  } catch (err) {
    console.error("❌ Error initializing smartwatches:", err);
  }
}

export async function getAllSmartwatches() {
  try {
    const smartwatches = await Smartwatch.find().lean();

    return smartwatches.map(sw => ({
      id: sw.id,
      title: sw.title,
      image: sw.image,
      brand: sw.brand,
      originalPrice: sw.originalPrice,
      discount: sw.discount,
      displaySize: sw.displaySize,
      displayType: sw.displayType,
      batteryRuntime: sw.batteryRuntime,

      // NEW FIELDS
      stock: sw.stock,
      sellerId: sw.sellerId,
      isActive: sw.isActive
    }));
  } catch (error) {
    console.error("Error getting smartwatches:", error);
    throw error;
  }
}

export async function getSmartwatchById(id) {
  try {
    const sw = await Smartwatch.findOne({ id }).lean();

    if (!sw) return null;

    return {
      id: sw.id,
      title: sw.title,
      image: sw.image,
      brand: sw.brand,
      originalPrice: sw.originalPrice,
      discount: sw.discount,
      displaySize: sw.displaySize,
      displayType: sw.displayType,
      batteryRuntime: sw.batteryRuntime,

      // NEW FIELDS
      stock: sw.stock,
      sellerId: sw.sellerId,
      isActive: sw.isActive
    };
  } catch (error) {
    console.error("Error getting smartwatch:", error);
    throw error;
  }
}

export async function addSmartwatch(data) {
  try {
    const {
      id,
      title,
      image,
      brand,
      originalPrice,
      discount,
      displaySize,
      displayType,
      batteryRuntime,
      sellerId,
      stock
    } = data;

    await Smartwatch.create({
      id,
      title,
      image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
      brand,
      originalPrice,
      discount,
      displaySize,
      displayType,
      batteryRuntime,
      sellerId,
      stock,
      isActive: true
    });

    return { success: true, id };
  } catch (error) {
    console.error("Error adding smartwatch:", error);
    return { success: false, message: error.message };
  }
}

export async function updateSmartwatch(id, data) {
  try {
    const {
      title,
      image,
      brand,
      originalPrice,
      discount,
      displaySize,
      displayType,
      batteryRuntime,
      stock,
      isActive
    } = data;

    await Smartwatch.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
          brand,
          originalPrice,
          discount,
          displaySize,
          displayType,
          batteryRuntime,
          stock,
          isActive
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating smartwatch:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteSmartwatch(id) {
  try {
    const result = await Smartwatch.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error("Error deleting smartwatch:", error);
    return { success: false, message: error.message };
  }
}