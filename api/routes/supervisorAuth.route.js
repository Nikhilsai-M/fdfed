import express from "express";
import { supervisorSignin, checkSupervisorExists } from "../controllers/supervisorAuth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signin", supervisorSignin);
router.get("/check", checkSupervisorExists);
// router.get("/profile", verifyToken, getS);

export default router;