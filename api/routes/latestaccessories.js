import express from 'express';
import { getLatestAccessories } from '../controllers/accessories.controller.js';

const router = express.Router();

router.get('/latest-accessories', getLatestAccessories);

export default router;