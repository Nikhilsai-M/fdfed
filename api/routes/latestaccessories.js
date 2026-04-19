import express from 'express';
import { getLatestAccessories } from '../controllers/accessories.controller.js';
import { cacheResponse } from "../middleware/cache.middleware.js";

const router = express.Router();
const inventoryCacheTtl = parseInt(process.env.INVENTORY_CACHE_TTL_SECONDS || "120", 10);

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
router.get(
  '/latest-accessories',
  cacheResponse({
    keyBuilder: () => "inventory:accessories:latest",
    ttlSeconds: inventoryCacheTtl,
  }),
  getLatestAccessories
);

export default router;
