import express from 'express';
import { getStatistics } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/admin.middleware.js';
const router = express.Router();

router.get('/statistics', verifyAdmin, getStatistics);

export default router;