import express from 'express';
import { searchProducts } from '../controllers/search.controller.js';

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
router.get('/', searchProducts);

export default router;
