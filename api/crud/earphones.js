import Earphone from "../models/earphone.model.js";
import { Seller } from "../models/seller.model.js";



const prefix = "/images/earphones/";

export async function initEarphones() {
  try {
    const earphoneCount = await Earphone.countDocuments();

    if (earphoneCount === 0) {
      const seller = await Seller.findOne({ role: "seller" });
      await Earphone.insertMany([
        {
          id: "boat_airdopes_456",
          title:
            "boAt Airdopes 181 Pro w/ 100 HRS Playback, 4 Mics ENx Technology & ASAP Charge Bluetooth (Frosted Mint, True Wireless)",
          image: prefix + "boat_airdopes.webp",
          brand: "Boat",
          originalPrice: 4990,
          discount: 81,
          design: "Earbuds",
          batteryLife: "100",

          // NEW SCHEMA FIELDS
          sellerId: seller._id,
          stock: 20,
          isActive: true,
        },
        {
          id: "boult_y1_789",
          title:
            "Boult Y1 with Zen ENC Mic, 50H Battery, Fast Charging, Pro+ Calling, Knurled Design Bluetooth (Black, True Wireless)",
          image: prefix + "boult_y1.webp",
          brand: "Boult",
          originalPrice: 5499,
          discount: 85,
          design: "Earbuds",
          batteryLife: "50",

          sellerId: seller._id,
          stock: 20,
          isActive: true,
        },
        {
          id: "oneplus_bullet_404",
          title:
            "OnePlus Bullets Wireless Z2 Bluetooth 5.0 in Ear Earphones",
          image: prefix + "oneplus_bullet.webp",
          brand: "OnePlus",
          originalPrice: 2999,
          discount: 10,
          design: "behind the neck",
          batteryLife: "50",

          sellerId: seller._id,
          stock: 20,
          isActive: true,
        }
      ]);

      console.log("✅ Earphones initialized");
    } else {
      console.log("✅ Earphones already exist");
    }
  } catch (err) {
    console.error("❌ Error initializing earphones:", err);
  }
}

export async function getAllEarphones() {
  try {
    const earphones = await Earphone.find({ isActive: true }).lean();

    return earphones.map((earphone) => ({
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      originalPrice: earphone.originalPrice,
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.batteryLife,

      // NEW FIELDS
      stock: earphone.stock,
      sellerId: earphone.sellerId,
      isActive: earphone.isActive,
      created_at: earphone.created_at,
    }));
  } catch (error) {
    console.error("Error getting earphones:", error);
    throw error;
  }
}

export async function getEarphoneById(id) {
  try {
    const earphone = await Earphone.findOne({ id }).lean();

    if (!earphone) return null;

    return {
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      originalPrice: earphone.originalPrice,
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.batteryLife,

      // NEW FIELDS
      stock: earphone.stock,
      sellerId: earphone.sellerId,
      isActive: earphone.isActive,
      created_at: earphone.created_at,
    };
  } catch (error) {
    console.error("Error getting earphone:", error);
    throw error;
  }
}

export async function addEarphone(earphoneData) {
  try {
    const {
      id,
      title,
      image,
      brand,
      originalPrice,
      discount,
      design,
      batteryLife,
      sellerId,
      stock,
    } = earphoneData;

    await Earphone.create({
      id,
      title,
      image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
      brand,
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      design,
      batteryLife,
      sellerId,
      stock: stock ?? 0,
      isActive: true,
    });

    return { success: true, id };
  } catch (error) {
    console.error("Error adding earphone:", error);
    return { success: false, message: error.message };
  }
}

export async function updateEarphone(id, earphoneData) {
  try {
    const {
      title,
      image,
      brand,
      originalPrice,
      discount,
      design,
      batteryLife,
      stock,
      sellerId,
      isActive,
    } = earphoneData;

    await Earphone.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
          brand,
          originalPrice,
          discount,
          design,
          batteryLife,
          stock,
          sellerId,
          isActive,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating earphone:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteEarphone(id) {
  try {
    const result = await Earphone.deleteOne({ id });

    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error("Error deleting earphone:", error);
    return { success: false, message: error.message };
  }
}