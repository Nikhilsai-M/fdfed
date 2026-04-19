import express from 'express';
import { getAllLaptops, getLaptopById, getLatestLaptops } from '../crud/laptops.js';
import { cacheResponse } from "../middleware/cache.middleware.js";

const router = express.Router();
const inventoryCacheTtl = parseInt(process.env.INVENTORY_CACHE_TTL_SECONDS || "120", 10);

/**
 * @swagger
 * tags:
 *   name: Laptops
 *   description: Laptop listing APIs
 */

/**
 * @swagger
 * /api/laptops/latest-laptops:
 *   get:
 *     summary: Get the latest laptops
 *     tags: [Laptops]
 *     responses:
 *       200:
 *         description: Latest laptops fetched successfully
 */
router.get(
  '/latest-laptops',
  cacheResponse({
    keyBuilder: () => "inventory:laptops:latest",
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
  try {
    const laptops = await getLatestLaptops(5);
    res.json(laptops);
  } catch (error) {
    console.error('Error fetching latest laptops:', error);
    res.status(500).json({ error: 'Failed to fetch latest laptops' });
  }
});

/**
 * @swagger
 * /api/laptops/{id}:
 *   get:
 *     summary: Get laptop by ID
 *     tags: [Laptops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Laptop found
 *       404:
 *         description: Laptop not found
 */
router.get(
  '/:id',
  cacheResponse({
    keyBuilder: (req) => `inventory:laptop:${req.params.id}`,
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
  try {
    const laptop = await getLaptopById(req.params.id);
    if (!laptop) {
      return res.status(404).json({ error: 'Laptop not found' });
    }
    res.json(laptop);
  } catch (error) {
    console.error('Error fetching laptop:', error);
    res.status(500).json({ error: 'Failed to fetch laptop' });
  }
});

/**
 * @swagger
 * /api/laptops:
 *   get:
 *     summary: Get all laptops
 *     tags: [Laptops]
 *     responses:
 *       200:
 *         description: List of laptops
 */
router.get(
  '/',
  cacheResponse({
    keyBuilder: () => "inventory:laptops:all",
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
  try {
    const laptops = await getAllLaptops();
    res.json(laptops);
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).json({ error: 'Failed to fetch laptops' });
  }
});

export default router;
