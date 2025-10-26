import express from 'express';
import {
  getAllMouses,
  getMouseById,
  addMouse,
  updateMouse,
  deleteMouse,
} from '../crud/mouses.js'; // Assumes crud file is mouses.js

const router = express.Router();

// ✅ GET all mouses
router.get('/', async (req, res) => {
  try {
    const mouses = await getAllMouses();
    res.json(mouses);
  } catch (error) {
    console.error('Error fetching mouses:', error);
    res.status(500).json({ message: 'Server error while fetching mouses' });
  }
});

// ✅ GET mouse by ID
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

// ✅ POST new mouse
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

// ✅ PUT update mouse
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

// ✅ DELETE mouse
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