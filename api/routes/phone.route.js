import express from 'express';
import { getAllPhones, getPhoneById, getLatestPhones } from '../crud/phones.js';
import { cacheResponse } from "../middleware/cache.middleware.js";

const router = express.Router();
const inventoryCacheTtl = parseInt(process.env.INVENTORY_CACHE_TTL_SECONDS || "120", 10);

/**
 * @swagger
 * tags:
 *   name: Phones
 *   description: Phone listing APIs
 */

/**
 * @swagger
 * /api/phones/latest-phones:
 *   get:
 *     summary: Get the latest phones
 *     tags: [Phones]
 *     responses:
 *       200:
 *         description: Latest phones fetched successfully
 */
router.get(
  '/latest-phones',
  cacheResponse({
    keyBuilder: () => "inventory:phones:latest",
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
  try {
    const phones = await getLatestPhones();
    res.json(phones);
  } catch (error) {
    console.error('Error fetching latest phones:', error);
    res.status(500).json({ error: 'Failed to fetch latest phones' });
  }
});

/**
 * @swagger
 * /api/phones/{id}:
 *   get:
 *     summary: Get phone by ID
 *     tags: [Phones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phone found
 *       404:
 *         description: Phone not found
 */
router.get(
  '/:id',
  cacheResponse({
    keyBuilder: (req) => `inventory:phone:${req.params.id}`,
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
  try {
    const phone = await getPhoneById(req.params.id);
    if (!phone) {
      return res.status(404).json({ error: 'Phone not found' });
    }
    res.json(phone);
  } catch (error) {
    console.error('Error fetching phone:', error);
    res.status(500).json({ error: 'Failed to fetch phone' });
  }
});

/**
 * @swagger
 * /api/phones:
 *   get:
 *     summary: Get all phones
 *     tags: [Phones]
 *     responses:
 *       200:
 *         description: List of phones
 */
router.get(
  '/',
  cacheResponse({
    keyBuilder: () => "inventory:phones:all",
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
  try {
    const phones = await getAllPhones();
    res.json(phones);
  } catch (error) {
    console.error('Error fetching phones:', error);
    res.status(500).json({ error: 'Failed to fetch phones' });
  }
});

export default router;
