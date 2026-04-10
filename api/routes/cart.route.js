import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Authenticated user cart APIs
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Clear the logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getCart);
router.delete("/", verifyToken, clearCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add a product to the logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productType
 *               - productId
 *             properties:
 *               productType:
 *                 type: string
 *                 enum: [phone, laptop, charger, earphone, mouse, smartwatch]
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *             example:
 *               productType: phone
 *               productId: "1"
 *               quantity: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid request or out of stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/items", verifyToken, addCartItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update quantity for a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *             example:
 *               quantity: 2
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid request or out of stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
router.put("/items/:itemId", verifyToken, updateCartItem);
router.delete("/items/:itemId", verifyToken, removeCartItem);

export default router;
