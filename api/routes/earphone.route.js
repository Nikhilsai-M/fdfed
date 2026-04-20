import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';
import {
  getAllEarphones,
  getEarphoneById,
  addEarphone,
  updateEarphone,
  deleteEarphone,
} from '../crud/earphones.js';
import { cacheResponse } from "../middleware/cache.middleware.js";
import { invalidateCatalogCaches } from "../config/redis.js";
const inventoryCacheTtl ="120";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Earphones
 *   description: Earphone management APIs
 */

/**
 * @swagger
 * /api/Accessories/earphones:
 *   get:
 *     summary: Get all earphones
 *     tags: [Earphones]
 *     responses:
 *       200:
 *         description: List of earphones
 */
router.get(
  '/',
  cacheResponse({
    keyBuilder: () => "inventory:earphones:all",
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
    try {
      const earphones = await getAllEarphones();
      res.json(earphones);
    } catch {
      res.status(500).json({ message: 'Server error while fetching earphones' });
    }
  }
);
/**
 * @swagger
 * /api/Accessories/earphones/{id}:
 *   get:
 *     summary: Get earphone by ID
 *     tags: [Earphones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Earphone found
 *       404:
 *         description: Earphone not found
 */
router.get(
  '/:id',
  cacheResponse({
    keyBuilder: (req) => `inventory:earphone:${req.params.id}`,
    ttlSeconds: inventoryCacheTtl,
  }),
  async (req, res) => {
    try {
      const earphone = await getEarphoneById(req.params.id);
      if (!earphone)
        return res.status(404).json({ message: 'Earphone not found' });
      res.json(earphone);
    } catch {
      res.status(500).json({ message: 'Server error while fetching earphone' });
    }
  }
);

/**
 * @swagger
 * /api/Accessories/earphones:
 *   post:
 *     summary: Add a new earphone
 *     tags: [Earphones]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - title
 *               - image
 *               - brand
 *               - originalPrice
 *               - discount
 *               - design
 *               - batteryLife
 *               - sellerId
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               brand:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               design:
 *                 type: string
 *               batteryLife:
 *                 type: string
 *               sellerId:
 *                 type: string
 *               stock:
 *                 type: integer
 *           example:
 *             id: ear101
 *             title: Bluetooth Earbuds
 *             brand: Boat
 *             originalPrice: 1999
 *             discount: 20
 *             design: Earbuds
 *             batteryLife: 40 hours
 *             sellerId: 67f123abc456def789012345
 *             stock: 15
 *     responses:
 *       201:
 *         description: Earphone created
 *       400:
 *         description: Invalid input
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'accessories');
      payload.image = uploaded.secure_url;
      payload.public_id = uploaded.public_id;
    }

    const result = await addEarphone(payload);
    if (result.success) {
      await invalidateCatalogCaches();
      res.status(201).json({ message: 'Earphone created', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /api/Accessories/earphones/{id}:
 *   put:
 *     summary: Update earphone
 *     tags: [Earphones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               brand:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               design:
 *                 type: string
 *               batteryLife:
 *                 type: string
 *               stock:
 *                 type: integer
 *               sellerId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Earphone updated
 *       400:
 *         description: Invalid input
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await updateEarphone(req.params.id, req.body);
    if (result.success) {
      await invalidateCatalogCaches();
      res.json({ message: 'Earphone updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error while updating earphone' });
  }
});

/**
 * @swagger
 * /api/Accessories/earphones/{id}:
 *   delete:
 *     summary: Delete earphone
 *     tags: [Earphones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Earphone deleted
 *       404:
 *         description: Earphone not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteEarphone(req.params.id);
    if (result.success) {
      await invalidateCatalogCaches();
      res.json({ message: 'Earphone deleted successfully' });
    } else {
      res.status(404).json({ message: 'Earphone not found' });
    }
  } catch {
    res.status(500).json({ message: 'Server error while deleting earphone' });
  }
});

export default router;

