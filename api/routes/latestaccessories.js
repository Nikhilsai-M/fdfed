import express from 'express';
import { getLatestAccessories } from '../controllers/accessories.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Accessories
 *   description: Accessory discovery APIs
 */

/**
 * @swagger
 * /api/latest-accessories:
 *   get:
 *     summary: Get the latest accessories
 *     tags: [Accessories]
 *     responses:
 *       200:
 *         description: Latest accessories fetched successfully
 */
router.get('/latest-accessories', getLatestAccessories);

export default router;
