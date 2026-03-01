import { Router } from "express";
import { getSellerOrders} from "../controllers/sellerOrder.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/orders", verifyToken, getSellerOrders);

export default router;