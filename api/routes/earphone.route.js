import express from 'express';
import {
  getAllEarphones,
  getEarphoneById,
  addEarphone,
  updateEarphone,
  deleteEarphone,
} from '../crud/earphones.js';

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
router.get('/', async (req, res) => {
  try {
    const earphones = await getAllEarphones();
    res.json(earphones);
  } catch (error) {
    console.error('Error fetching earphones:', error);
    res.status(500).json({ message: 'Server error while fetching earphones' });
  }
});

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
router.get('/:id', async (req, res) => {
  try {
    const earphone = await getEarphoneById(req.params.id);
    if (!earphone) {
      return res.status(404).json({ message: 'Earphone not found' });
    }
    res.json(earphone);
  } catch (error) {
    console.error('Error fetching earphone by ID:', error);
    res.status(500).json({ message: 'Server error while fetching earphone' });
  }
});

/**
 * @swagger
 * /api/Accessories/earphones:
 *   post:
 *     summary: Add a new earphone
 *     tags: [Earphones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: Wireless Earbuds
 *               brand: Sony
 *               originalPrice: 2499
 *     responses:
 *       201:
 *         description: Earphone created
 */
router.post('/', async (req, res) => {
  try {
    const result = await addEarphone(req.body);
    if (result.success) {
      res
        .status(201)
        .json({ message: 'Earphone added successfully', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error adding earphone:', error);
    res.status(500).json({ message: 'Server error while adding earphone' });
  }
});

/**
 * @swagger
 * /api/Accessories/earphones/{id}:
 *   put:
 *     summary: Update an earphone
 *     tags: [Earphones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await updateEarphone(req.params.id, req.body);
    if (result.success) {
      res.json({ message: 'Earphone updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error updating earphone:', error);
    res.status(500).json({ message: 'Server error while updating earphone' });
  }
});

/**
 * @swagger
 * /api/Accessories/earphones/{id}:
 *   delete:
 *     summary: Delete an earphone
 *     tags: [Earphones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteEarphone(req.params.id);
    if (result.success) {
      res.json({ message: 'Earphone deleted successfully' });
    } else {
      res.status(404).json({ message: 'Earphone not found' });
    }
  } catch (error) {
    console.error('Error deleting earphone:', error);
    res.status(500).json({ message: 'Server error while deleting earphone' });
  }
});

export default router;
