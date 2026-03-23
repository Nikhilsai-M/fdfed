import express from 'express';
import { getLatestPhones } from '../crud/phones.js';
import { getLatestLaptops } from '../crud/laptops.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Combined product discovery APIs
 */

/**
 * @swagger
 * /api/latest-products:
 *   get:
 *     summary: Get the latest phones and laptops combined
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Latest products fetched successfully
 */
router.get('/latest-products', async (req, res) => {
  try {
    const latestPhones = await getLatestPhones();
    const latestLaptops = await getLatestLaptops();

    const allLatestProducts = [...latestPhones, ...latestLaptops];

    allLatestProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(allLatestProducts);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
