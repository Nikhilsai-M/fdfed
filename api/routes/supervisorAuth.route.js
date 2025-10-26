import express from "express";
import { supervisorSignin } from "../controllers/supervisorAuth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signin", supervisorSignin);
// router.get("/profile", verifyToken, getS);

export default router;