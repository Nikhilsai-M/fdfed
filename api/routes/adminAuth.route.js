import express from 'express';
import { adminSignin, adminSignout } from '../controllers/adminAuth.controller.js';
import { verifyAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/admin-signin', adminSignin);
router.post('/admin-signout', verifyAdmin, adminSignout);

export default router;