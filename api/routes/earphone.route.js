import express from 'express';
import {
  getAllEarphones,
  getEarphoneById,
  addEarphone,
  updateEarphone,
  deleteEarphone,
} from '../crud/earphones.js'; // Assumes crud file is earphones.js

const router = express.Router();

// ✅ GET all earphones
router.get('/', async (req, res) => {
  try {
    const earphones = await getAllEarphones();
    res.json(earphones);
  } catch (error) {
    console.error('Error fetching earphones:', error);
    res.status(500).json({ message: 'Server error while fetching earphones' });
  }
});

// ✅ GET earphone by ID
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

// ✅ POST new earphone
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

// ✅ PUT update earphone
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

// ✅ DELETE earphone
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