import express from 'express';
import { getSearchCacheKey, searchProducts } from '../controllers/search.controller.js';
import { cacheResponse } from '../middleware/cache.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Product search APIs
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search across phones, laptops, and accessories
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword or product category
 *     responses:
 *       200:
 *         description: Search results fetched successfully
 */
router.get(
  '/',
  cacheResponse({
    keyBuilder: (req) => getSearchCacheKey(req.query.q),
    ttlSeconds: parseInt(process.env.SEARCH_CACHE_TTL_SECONDS || "120", 10),
  }),
  searchProducts
);

export default router;
