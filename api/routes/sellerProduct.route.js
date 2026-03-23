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
 *             properties:
 *               category:
 *                 type: string
 *                 example: earphone
 *               title:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
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
 *             properties:
 *               category:
 *                 type: string
 *               title:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
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
 *             example:
 *               category: earphone
 */
router.delete(
  "/products/:id",
  verifyToken,
  deleteProduct
);

export default router;
