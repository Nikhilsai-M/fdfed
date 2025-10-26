import express from 'express';
import {
  getAllChargers,
  getChargerById,
  addCharger,
  updateCharger,
  deleteCharger,
} from '../crud/chargers.js';

const router = express.Router();

// ✅ GET all chargers
router.get('/', async (req, res) => {
  try {
    const chargers = await getAllChargers();
    res.json(chargers);
  } catch (error) {
    console.error('Error fetching chargers:', error);
    res.status(500).json({ message: 'Server error while fetching chargers' });
  }
});

// ✅ GET charger by ID
router.get('/:id', async (req, res) => {
  try {
    const charger = await getChargerById(req.params.id);
    if (!charger) {
      return res.status(404).json({ message: 'Charger not found' });
    }
    res.json(charger);
  } catch (error) {
    console.error('Error fetching charger by ID:', error);
    res.status(500).json({ message: 'Server error while fetching charger' });
  }
});

// ✅ POST new charger
router.post('/', async (req, res) => {
  try {
    const result = await addCharger(req.body);
    if (result.success) {
      res.status(201).json({ message: 'Charger added successfully', id: result.id });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error adding charger:', error);
    res.status(500).json({ message: 'Server error while adding charger' });
  }
});

// ✅ PUT update charger
router.put('/:id', async (req, res) => {
  try {
    const result = await updateCharger(req.params.id, req.body);
    if (result.success) {
      res.json({ message: 'Charger updated successfully' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error updating charger:', error);
    res.status(500).json({ message: 'Server error while updating charger' });
  }
});

// ✅ DELETE charger
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCharger(req.params.id);
    if (result.success) {
      res.json({ message: 'Charger deleted successfully' });
    } else {
      res.status(404).json({ message: 'Charger not found' });
    }
  } catch (error) {
    console.error('Error deleting charger:', error);
    res.status(500).json({ message: 'Server error while deleting charger' });
  }
});

export default router;