import express from 'express';
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
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Fast Charger
 *               price: 999
 *     responses:
 *       201:
 *         description: Charger created
 */
router.post('/', async (req, res) => {
  try {
    const result = await addCharger(req.body);
    if (result.success) {
      res.status(201).json({ message: 'Charger added', id: result.id });
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