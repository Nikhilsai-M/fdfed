import express from 'express';
import {
  getAllSmartwatches,
  getSmartwatchById,
  addSmartwatch,
  updateSmartwatch,
  deleteSmartwatch,
} from '../crud/smartwatches.js'; // Assumes crud file is smartwatches.js

const router = express.Router();

// ✅ GET all smartwatches
router.get('/', async (req, res) => {
  try {
    const smartwatches = await getAllSmartwatches();
    res.json(smartwatches);
  } catch (error) {
    console.error('Error fetching smartwatches:', error);
    res
      .status(500)
      .json({ message: 'Server error while fetching smartwatches' });
  }
});

// ✅ GET smartwatch by ID
router.get('/:id', async (req, res) => {
  try {
    const smartwatch = await getSmartwatchById(req.params.id);
    if (!smartwatch) {
      return res.status(404).json({ message: 'Smartwatch not found' });
    }
    res.json(smartwatch);
  } catch (error) {
    console.error('Error fetching smartwatch by ID:', error);
    res
      .status(500)
      .json({ message: 'Server error while fetching smartwatch' });
  }
});

// ✅ POST new smartwatch
router.post('/', async (req, res) => {
  try {
    const result = await addSmartwatch(req.body);
    if (result.success) {
      res
        .status(201)
        .json({ message: 'Smartwatch added successfully', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error adding smartwatch:', error);
    res.status(500).json({ message: 'Server error while adding smartwatch' });
  }
});

// ✅ PUT update smartwatch
router.put('/:id', async (req, res) => {
  try {
    const result = await updateSmartwatch(req.params.id, req.body);
    if (result.success) {
      res.json({ message: 'Smartwatch updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error updating smartwatch:', error);
    res.status(500).json({ message: 'Server error while updating smartwatch' });
  }
});

// ✅ DELETE smartwatch
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteSmartwatch(req.params.id);
    if (result.success) {
      res.json({ message: 'Smartwatch deleted successfully' });
    } else {
      res.status(404).json({ message: 'Smartwatch not found' });
    }
  } catch (error) {
    console.error('Error deleting smartwatch:', error);
    res.status(500).json({ message: 'Server error while deleting smartwatch' });
  }
});

export default router;