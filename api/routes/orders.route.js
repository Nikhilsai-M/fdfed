import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  getOrdersByUserId,
  createOrder
} from "../crud/orders.js";
import { clearCartByUserId } from "../crud/cart.js";

import { getPhoneById } from "../crud/phones.js";
import { getLaptopById } from "../crud/laptops.js";
import { getChargerById } from "../crud/chargers.js";
import { getEarphoneById } from "../crud/earphones.js";
import { getMouseById } from "../crud/mouses.js";
import { getSmartwatchById } from "../crud/smartwatches.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order and buy-now APIs
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               totalAmount: 49999
 *               paymentMethod: cod
 *               items:
 *                 - type: phone
 *                   id: "101"
 *                   quantity: 1
 *                   amount: 49999
 *                   accessory:
 *                     brand: Apple
 *                     model: iPhone 14
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order data
 */
router.post("/orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { totalAmount, paymentMethod, items, source } = req.body;

    if (!totalAmount || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount || !item.accessory) {
        return res.status(400).json({ success: false, message: "Invalid item data" });
      }
    }

    const result = await createOrder(userId, totalAmount, paymentMethod, items);

    if (result.success && source === "cart") {
      await clearCartByUserId(userId);
    }

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

/**
 * @swagger
 * /api/myorders:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
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

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get a single order for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 */
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

/**
 * @swagger
 * /api/buy/{type}/{id}:
 *   get:
 *     summary: Prepare buy-now payment data for a product
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: phone
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Buy-now data prepared successfully
 *       400:
 *         description: Invalid product type
 *       404:
 *         description: Product not found
 */
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

