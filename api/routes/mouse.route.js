import express from 'express';
import {
  getAllMouses,
  getMouseById,
  addMouse,
  updateMouse,
  deleteMouse,
} from '../crud/mouses.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mouses
 *   description: Mouse management APIs
 */

/**
 * @swagger
 * /api/Accessories/mouses:
 *   get:
 *     summary: Get all mouses
 *     tags: [Mouses]
 *     responses:
 *       200:
 *         description: List of mouses
 */
router.get('/', async (req, res) => {
  try {
    const mouses = await getAllMouses();
    res.json(mouses);
  } catch (error) {
    console.error('Error fetching mouses:', error);
    res.status(500).json({ message: 'Server error while fetching mouses' });
  }
});

/**
 * @swagger
 * /api/Accessories/mouses/{id}:
 *   get:
 *     summary: Get mouse by ID
 *     tags: [Mouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mouse found
 *       404:
 *         description: Mouse not found
 */
router.get('/:id', async (req, res) => {
  try {
    const mouse = await getMouseById(req.params.id);
    if (!mouse) {
      return res.status(404).json({ message: 'Mouse not found' });
    }
    res.json(mouse);
  } catch (error) {
    console.error('Error fetching mouse by ID:', error);
    res.status(500).json({ message: 'Server error while fetching mouse' });
  }
});

/**
 * @swagger
 * /api/Accessories/mouses:
 *   post:
 *     summary: Add a new mouse
 *     tags: [Mouses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: Wireless Mouse
 *               brand: Logitech
 *               originalPrice: 1499
 *     responses:
 *       201:
 *         description: Mouse created
 */
router.post('/', async (req, res) => {
  try {
    const result = await addMouse(req.body);
    if (result.success) {
      res
        .status(201)
        .json({ message: 'Mouse added successfully', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error adding mouse:', error);
    res.status(500).json({ message: 'Server error while adding mouse' });
  }
});

/**
 * @swagger
 * /api/Accessories/mouses/{id}:
 *   put:
 *     summary: Update a mouse
 *     tags: [Mouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await updateMouse(req.params.id, req.body);
    if (result.success) {
      res.json({ message: 'Mouse updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error updating mouse:', error);
    res.status(500).json({ message: 'Server error while updating mouse' });
  }
});

/**
 * @swagger
 * /api/Accessories/mouses/{id}:
 *   delete:
 *     summary: Delete a mouse
 *     tags: [Mouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteMouse(req.params.id);
    if (result.success) {
      res.json({ message: 'Mouse deleted successfully' });
    } else {
      res.status(404).json({ message: 'Mouse not found' });
    }
  } catch (error) {
    console.error('Error deleting mouse:', error);
    res.status(500).json({ message: 'Server error while deleting mouse' });
  }
});

export default router;
