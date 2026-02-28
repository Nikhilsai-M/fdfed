import express from "express";
import {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct
} from "../controllers/sellerproduct.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/products", verifyToken, addProduct);
router.get("/products", verifyToken, getSellerProducts);
router.put("/products/:id", verifyToken, updateProduct);
router.delete("/products/:id", verifyToken, deleteProduct);

export default router;