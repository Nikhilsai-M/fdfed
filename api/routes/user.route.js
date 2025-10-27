// routes/user.route.js
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);

router.put('/profile', verifyToken, updateUserProfile);

export default router;