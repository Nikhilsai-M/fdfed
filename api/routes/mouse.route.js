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
 *         content:
 *           application/json:
 *             example:
 *               - name: Gaming Mouse
 *                 price: 1499
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const mouses = await getAllMouses();
    res.json(mouses);
  } catch {
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
    if (!mouse) return res.status(404).json({ message: 'Mouse not found' });
    res.json(mouse);
  } catch {
    res.status(500).json({ message: 'Server error' });
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
 *           example:
 *             name: Gaming Mouse
 *             price: 1499
 *     responses:
 *       201:
 *         description: Mouse created
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  try {
    const result = await addMouse(req.body);
    if (result.success)
      res.status(201).json({ message: 'Mouse added', id: result.id });
    else res.status(400).json({ message: result.message });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/Accessories/mouses/{id}:
 *   put:
 *     summary: Update mouse
 *     tags: [Mouses]
 *     responses:
 *       200:
 *         description: Updated successfully
 *       400:
 *         description: Invalid input
 */
router.put('/:id', async (req, res) => {
  try {
    const result = await updateMouse(req.params.id, req.body);
    if (result.success) res.json({ message: 'Updated successfully' });
    else res.status(400).json({ message: result.message });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/Accessories/mouses/{id}:
 *   delete:
 *     summary: Delete mouse
 *     tags: [Mouses]
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Mouse not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteMouse(req.params.id);
    if (result.success) res.json({ message: 'Deleted successfully' });
    else res.status(404).json({ message: 'Mouse not found' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
