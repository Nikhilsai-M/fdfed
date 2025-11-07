import express from 'express';
import { adminSignin, adminSignout } from '../controllers/adminAuth.controller.js';

const router = express.Router();

router.post('/admin-signin', adminSignin);
router.post('/admin-signout', adminSignout);

export default router;