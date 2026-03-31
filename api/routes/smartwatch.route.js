import express from 'express';
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
 *         application/json:
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
 *             example:
 *               id: sw101
 *               title: Apple Watch
 *               image: apple-watch.webp
 *               brand: Apple
 *               originalPrice: 29999
 *               discount: 5
 *               displaySize: "41"
 *               displayType: Retina Display
 *               batteryRuntime: 18 hours
 *               sellerId: 67f123abc456def789012345
 *               stock: 6
 *     responses:
 *       201:
 *         description: Smartwatch created
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  try {
    const result = await addSmartwatch(req.body);
    if (result.success) {
      res.status(201).json({
        message: 'Smartwatch added successfully',
        id: result.id,
      });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch {
    res.status(500).json({ message: 'Server error while adding smartwatch' });
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
 *             example:
 *               title: Apple Watch Series 8
 *               image: apple-watch-series8.webp
 *               brand: Apple
 *               originalPrice: 55900
 *               discount: 8
 *               displaySize: "41"
 *               displayType: Retina Display
 *               batteryRuntime: 18 hours
 *               stock: 9
 *               isActive: true
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
