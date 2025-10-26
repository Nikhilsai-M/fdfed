import express from "express";
import { test } from "../controllers/user.controller.js";
// import { getUserProfile, updateUserProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
// router.get('/profile', verifyToken, getUserProfile);
// router.put('/profile', verifyToken, updateUserProfile);

export default router;