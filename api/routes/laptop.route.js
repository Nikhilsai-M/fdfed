import express from 'express';
import { getAllLaptops, getLaptopById } from '../crud/laptops.js';

const router = express.Router();

// Get all laptops
router.get('/', async (req, res) => {
  try {
    const laptops = await getAllLaptops();
    res.json(laptops);
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).json({ error: 'Failed to fetch laptops' });
  }
});

// Get laptop by ID
router.get('/:id', async (req, res) => {
  try {
    const laptop = await getLaptopById(req.params.id);
    if (!laptop) {
      return res.status(404).json({ error: 'Laptop not found' });
    }
    res.json(laptop);
  } catch (error) {
    console.error('Error fetching laptop:', error);
    res.status(500).json({ error: 'Failed to fetch laptop' });
  }
});

export default router;