import express from "express";
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct
} from "../controllers/sellerProduct.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seller Products
 *   description: Seller product management APIs
 */

/**
 * @swagger
 * /api/seller/products:
 *   post:
 *     summary: Add a seller product
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - title
 *               - brand
 *               - originalPrice
 *               - discount
 *             properties:
 *               id:
 *                 type: string
 *                 example: "64f123abc"
 *               category:
 *                 type: string
 *                 enum: [earphone, charger, mouse, smartwatch]
 *               title:
 *                 type: string
 *               brand:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               stock:
 *                 type: integer
 *               design:
 *                 type: string
 *                 description: Required for `earphone`
 *               batteryLife:
 *                 type: string
 *                 description: Required for `earphone`
 *               wattage:
 *                 type: string
 *                 description: Required for `charger`
 *               type:
 *                 type: string
 *                 description: Required for `charger` and `mouse`
 *               outputCurrent:
 *                 type: string
 *                 description: Required for `charger`
 *               connectivity:
 *                 type: string
 *                 description: Required for `mouse`
 *               resolution:
 *                 type: string
 *                 description: Required for `mouse`
 *               displaySize:
 *                 type: string
 *                 description: Required for `smartwatch`
 *               displayType:
 *                 type: string
 *                 description: Required for `smartwatch`
 *               batteryRuntime:
 *                 type: string
 *                 description: Required for `smartwatch`
 *               image:
 *                 type: string
 *                 format: binary
 *           example:
 *             category: earphone
 *             title: boAt Airdopes 181 Pro
 *             brand: Boat
 *             originalPrice: 1999
 *             discount: 20
 *             stock: 10
 *             design: Earbuds
 *             batteryLife: 40 hours
 *     responses:
 *       200:
 *         description: Seller product added successfully
 *       400:
 *         description: Invalid product payload
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/products",
  verifyToken,
  upload.single("image"),
  addProduct
);

/**
 * @swagger
 * /api/seller/products:
 *   get:
 *     summary: Get products for the logged-in seller
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     responses:
 *       200:
 *         description: Seller products fetched successfully
 */
router.get(
  "/products",
  verifyToken,
  getSellerProducts
);

/**
 * @swagger
 * /api/seller/products/{id}:
 *   put:
 *     summary: Update a seller product
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [earphone, charger, mouse, smartwatch]
 *               title:
 *                 type: string
 *               brand:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               stock:
 *                 type: integer
 *               design:
 *                 type: string
 *               batteryLife:
 *                 type: string
 *               wattage:
 *                 type: string
 *               type:
 *                 type: string
 *               outputCurrent:
 *                 type: string
 *               connectivity:
 *                 type: string
 *               resolution:
 *                 type: string
 *               displaySize:
 *                 type: string
 *               displayType:
 *                 type: string
 *               batteryRuntime:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *           example:
 *             category: charger
 *             title: Samsung 25W Fast Charger
 *             brand: Samsung
 *             originalPrice: 1800
 *             discount: 5
 *             stock: 12
 *             wattage: "25"
 *             type: USB C
 *             outputCurrent: 2.5A
 *     responses:
 *       200:
 *         description: Seller product updated successfully
 *       400:
 *         description: Invalid update payload
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Seller product not found
 */
router.put(
  "/products/:id",
  verifyToken,
  upload.single("image"),
  updateProduct
);

/**
 * @swagger
 * /api/seller/products/{id}:
 *   delete:
 *     summary: Delete a seller product
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [earphone, charger, mouse, smartwatch]
 *           example:
 *             category: earphone
 *     responses:
 *       200:
 *         description: Seller product deleted successfully
 *       400:
 *         description: Invalid delete request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Seller product not found
 */
router.delete(
  "/products/:id",
  verifyToken,
  deleteProduct
);

export default router;
