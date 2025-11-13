import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  getOrdersByUserId,
  createOrder
} from "../crud/orders.js";

import { getPhoneById } from "../crud/phones.js";
import { getLaptopById } from "../crud/laptops.js";
import { getChargerById } from "../crud/chargers.js";
import { getEarphoneById } from "../crud/earphones.js";
import { getMouseById } from "../crud/mouses.js";
import { getSmartwatchById } from "../crud/smartwatches.js";

const router = Router();

/* ----------------------------------------------------
   CREATE ORDER
---------------------------------------------------- */
router.post("/orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { totalAmount, paymentMethod, items } = req.body;

    if (!totalAmount || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount || !item.accessory) {
        return res.status(400).json({ success: false, message: "Invalid item data" });
      }
    }

    const result = await createOrder(userId, totalAmount, paymentMethod, items);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      orderId: result.orderId,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ----------------------------------------------------
   GET ALL ORDERS FOR LOGGED USER
---------------------------------------------------- */
router.get("/myorders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const orders = await getOrdersByUserId(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching myorders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ----------------------------------------------------
   GET SINGLE ORDER
---------------------------------------------------- */
router.get("/orders/:orderId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const orderId = req.params.orderId;

    const orders = await getOrdersByUserId(userId);
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ----------------------------------------------------
   BUY NOW (PHONE + LAPTOP + ACCESSORIES)
---------------------------------------------------- */
router.get("/buy/:type/:id", verifyToken, async (req, res) => {
  try {
    const type = req.params.type.toLowerCase();
    const id = req.params.id;

    const fetchMap = {
      phone: getPhoneById,
      laptop: getLaptopById,
      charger: getChargerById,
      earphone: getEarphoneById,
      mouse: getMouseById,
      smartwatch: getSmartwatchById,
    };

    if (!fetchMap[type]) {
      return res.status(400).json({ success: false, error: "Invalid product type" });
    }

    const product = await fetchMap[type](id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `${type} with ID ${id} not found`,
      });
    }

    const basePrice = product.pricing.originalPrice || product.pricing.basePrice;
    const discount = parseFloat(product.pricing.discount || 0);
    const finalPrice = basePrice - (basePrice * discount / 100);

    return res.json({
      success: true,
      paymentData: {
        price: finalPrice,
        type,
        id,
        accessory: product,
        userId: req.user.user_id
      }
    });

  } catch (error) {
    console.error("BUY NOW error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process Buy Now request"
    });
  }
});

export default router;
