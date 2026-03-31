import Mouse from "../models/mouse.model.js";
import { Seller } from "../models/seller.model.js";




const prefix = "/images/mouses/";

export async function initMouses() {
  try {
    const mouseCount = await Mouse.countDocuments();

    if (mouseCount === 0) {
      const seller = await Seller.findOne({ role: "seller" });
      await Mouse.insertMany([
        {
          id: "logitech_m196_202",
          title: "Logitech M196 Wireless Optical Mouse with Bluetooth",
          image: prefix + "Logitech M196.webp",
          brand: "Logitech",
          originalPrice: 1125,
          discount: 20,
          type: "Wireless",
          connectivity: "Bluetooth & USB",
          resolution: "4600",

          // NEW SCHEMA FIELDS
          stock: 10,
          sellerId: seller._id,
          isActive: true,
        },
        {
          id: "logitech_g502_303",
          title:
            "Logitech G502 Hero / Hero 25K Sensor, RGB, 11 Programmable Buttons Wired Optical Gaming Mouse",
          image: prefix + "Logotech G502 Hero.webp",
          brand: "Logitech",
          originalPrice: 5495,
          discount: 25,
          type: "Wired",
          connectivity: "USB",
          resolution: "5600",

          stock: 10,
          sellerId: seller._id,
          isActive: true,
        },
        {
          id: "arctic_fox_breathing_404",
          title:
            "Arctic Fox Breathing Lights and DPI Upto 3600 Wired Optical Gaming Mouse",
          image: prefix + "Arctic Fox Breathing Lights.webp",
          brand: "Arctic Fox",
          originalPrice: 599,
          discount: 35,
          type: "Wired",
          connectivity: "USB",
          resolution: "3600",

          stock: 10,
          sellerId: seller._id,
          isActive: true,
        },
        {
          id: "zebronics_jaguar_606",
          title: "ZEBRONICS Zeb-Jaguar Wireless Optical Mouse",
          image: prefix + "Zebronics Zeb Jaguar.webp",
          brand: "ZEBRONICS",
          originalPrice: 1190,
          discount: 39,
          type: "Wireless",
          connectivity: "USB",
          resolution: "1700",

          stock: 10,
          sellerId: seller._id,
          isActive: true,
        },
      ]);

      console.log("✅ Mouses initialized with stock");
    } else {
      console.log("✅ Mouses already exist in database");
    }
  } catch (err) {
    console.error("❌ Error initializing mouses:", err);
  }
}

export async function getAllMouses() {
  try {
    const mouses = await Mouse.find({ isActive: true }).lean();

    return mouses.map((mouse) => ({
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      originalPrice: mouse.originalPrice,
      discount: mouse.discount,
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,

      // NEW FIELDS
      stock: mouse.stock,
      sellerId: mouse.sellerId,
      isActive: mouse.isActive,
    }));
  } catch (error) {
    console.error("Error getting mouses:", error);
    throw error;
  }
}

export async function getMouseById(id) {
  try {
    const mouse = await Mouse.findOne({ id }).lean();

    if (!mouse) return null;

    return {
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      originalPrice: Number(mouse.originalPrice),
      discount: mouse.discount,
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,

      // NEW FIELDS
      stock: mouse.stock,
      sellerId: mouse.sellerId,
      isActive: mouse.isActive,
    };
  } catch (error) {
    console.error("Error getting mouse:", error);
    throw error;
  }
}

export async function addMouse(mouseData) {
  try {
    const {
      id,
      title,
      image,
      brand,
      originalPrice,
      discount,
      type,
      connectivity,
      resolution,
      stock,
      sellerId,
    } = mouseData;

    await Mouse.create({
      id,
      title,
      image: image.startsWith("/") || image.startsWith("http") ? image : prefix + image,
      brand,
      originalPrice,
      discount,
      type,
      connectivity,
      resolution,

      stock: stock ?? 10,
      sellerId: sellerId ?? null,
      isActive: true,
    });

    return { success: true, id };
  } catch (error) {
    console.error("Error adding mouse:", error);
    return { success: false, message: error.message };
  }
}

export async function updateMouse(id, mouseData) {
  try {
    await Mouse.updateOne({ id }, { $set: mouseData });

    return { success: true };
  } catch (error) {
    console.error("Error updating mouse:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteMouse(id) {
  try {
    await Mouse.updateOne({ id }, { isActive: false });

    return { success: true };
  } catch (error) {
    console.error("Error deleting mouse:", error);
    return { success: false, message: error.message };
  }
}