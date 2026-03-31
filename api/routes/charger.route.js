import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';
import {
  getAllChargers,
  getChargerById,
  addCharger,
  updateCharger,
  deleteCharger,
} from '../crud/chargers.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chargers
 *   description: Charger management APIs
 */

/**
 * @swagger
 * /api/Accessories/chargers:
 *   get:
 *     summary: Get all chargers
 *     tags: [Chargers]
 *     responses:
 *       200:
 *         description: List of chargers
 */
router.get('/', async (req, res) => {
  try {
    const chargers = await getAllChargers();
    res.json(chargers);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching chargers' });
  }
});

/**
 * @swagger
 * /api/Accessories/chargers/{id}:
 *   get:
 *     summary: Get charger by ID
 *     tags: [Chargers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Charger found
 *       404:
 *         description: Charger not found
 */
router.get('/:id', async (req, res) => {
  try {
    const charger = await getChargerById(req.params.id);
    if (!charger) return res.status(404).json({ message: 'Charger not found' });
    res.json(charger);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/Accessories/chargers:
 *   post:
 *     summary: Add a new charger
 *     tags: [Chargers]
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
 *               - wattage
 *               - type
 *               - originalPrice
 *               - discount
 *               - outputCurrent
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
 *               wattage:
 *                 type: string
 *               type:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               outputCurrent:
 *                 type: string
 *               sellerId:
 *                 type: string
 *               stock:
 *                 type: integer
 *           example:
 *             id: chg101
 *             title: Apple 20W USB-C Power Adapter
 *             brand: Apple
 *             wattage: "20"
 *             type: USB C
 *             originalPrice: 1900
 *             discount: 10
 *             outputCurrent: 3A
 *             sellerId: 67f123abc456def789012345
 *             stock: 10
 *     responses:
 *       201:
 *         description: Charger created
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

    const result = await addCharger(payload);
    if (result.success) {
      res.status(201).json({ message: 'Charger created', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /api/Accessories/chargers/{id}:
 *   put:
 *     summary: Update charger
 *     tags: [Chargers]
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
 *               wattage:
 *                 type: string
 *               type:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discount:
 *                 type: number
 *               outputCurrent:
 *                 type: string
 *               stock:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Charger updated successfully
 *       400:
 *         description: Invalid update request
 *       404:
 *         description: Charger not found
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await updateCharger(req.params.id, req.body);
    if (result.success) {
      res.json({ message: 'Updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/Accessories/chargers/{id}:
 *   delete:
 *     summary: Delete charger
 *     tags: [Chargers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Charger deleted successfully
 *       404:
 *         description: Charger not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCharger(req.params.id);
    if (result.success) {
      res.json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

