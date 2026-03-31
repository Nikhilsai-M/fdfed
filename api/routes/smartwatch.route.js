import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';
import {
  getAllSmartwatches,
  getSmartwatchById,
  addSmartwatch,
  updateSmartwatch,
  deleteSmartwatch,
} from '../crud/smartwatches.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Smartwatches
 *   description: Smartwatch management APIs
 */

/**
 * @swagger
 * /api/Accessories/smartwatches:
 *   get:
 *     summary: Get all smartwatches
 *     tags: [Smartwatches]
 *     responses:
 *       200:
 *         description: List of smartwatches
 */
router.get('/', async (req, res) => {
  try {
    const smartwatches = await getAllSmartwatches();
    res.json(smartwatches);
  } catch {
    res.status(500).json({ message: 'Server error while fetching smartwatches' });
  }
});

/**
 * @swagger
 * /api/Accessories/smartwatches/{id}:
 *   get:
 *     summary: Get smartwatch by ID
 *     tags: [Smartwatches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Smartwatch found
 *       404:
 *         description: Smartwatch not found
 */
router.get('/:id', async (req, res) => {
  try {
    const smartwatch = await getSmartwatchById(req.params.id);
    if (!smartwatch)
      return res.status(404).json({ message: 'Smartwatch not found' });
    res.json(smartwatch);
  } catch {
    res.status(500).json({ message: 'Server error while fetching smartwatch' });
  }
});

/**
 * @swagger
 * /api/Accessories/smartwatches:
 *   post:
 *     summary: Add a new smartwatch
 *     tags: [Smartwatches]
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
 *               - displaySize
 *               - displayType
 *               - batteryRuntime
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
 *               displaySize:
 *                 type: string
 *               displayType:
 *                 type: string
 *               batteryRuntime:
 *                 type: string
 *               sellerId:
 *                 type: string
 *               stock:
 *                 type: integer
 *           example:
 *             id: sw101
 *             title: Apple Watch
 *             brand: Apple
 *             originalPrice: 29999
 *             discount: 5
 *             displaySize: "41"
 *             displayType: Retina Display
 *             batteryRuntime: 18 hours
 *             sellerId: 67f123abc456def789012345
 *             stock: 6
 *     responses:
 *       201:
 *         description: Smartwatch created
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

    const result = await addSmartwatch(payload);
    if (result.success) {
      res.status(201).json({ message: 'Smartwatch created', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /api/Accessories/smartwatches/{id}:
 *   put:
 *     summary: Update smartwatch
 *     tags: [Smartwatches]
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
 *               displaySize:
 *                 type: string
 *               displayType:
 *                 type: string
 *               batteryRuntime:
 *                 type: string
 *               stock:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Smartwatch updated
 *       400:
 *         description: Invalid input
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await updateSmartwatch(req.params.id, req.body);
    if (result.success) {
      res.json({ message: 'Smartwatch updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error while updating smartwatch' });
  }
});

/**
 * @swagger
 * /api/Accessories/smartwatches/{id}:
 *   delete:
 *     summary: Delete smartwatch
 *     tags: [Smartwatches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Smartwatch deleted
 *       404:
 *         description: Smartwatch not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteSmartwatch(req.params.id);
    if (result.success) {
      res.json({ message: 'Smartwatch deleted successfully' });
    } else {
      res.status(404).json({ message: 'Smartwatch not found' });
    }
  } catch {
    res.status(500).json({ message: 'Server error while deleting smartwatch' });
  }
});

export default router;

