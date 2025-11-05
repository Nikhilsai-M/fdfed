import express from "express";
import { 
    getCustomerProfile, 
    updateCustomerProfile, 
    updateCustomerPassword, 
    getCustomerListings
} from "../controllers/customer.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/profile", verifyToken, getCustomerProfile);
router.put("/profile", verifyToken, updateCustomerProfile);
router.post("/password", verifyToken, updateCustomerPassword);
router.get("/listings", verifyToken, getCustomerListings);


export default router;