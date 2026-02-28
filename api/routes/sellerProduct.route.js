import express from "express";
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct
} from "../controllers/sellerProduct.controller.js"

import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Add product
router.post(
  "/products",
  verifyToken,
  upload.single("image"),
  addProduct
);

// Get seller products
router.get(
  "/products",
  verifyToken,
  getSellerProducts
);

// Update product
router.put(
  "/products/:id",
  verifyToken,
  upload.single("image"),
  updateProduct
);

// Soft delete product
router.delete(
  "/products/:id",
  verifyToken,
  deleteProduct
);

export default router;