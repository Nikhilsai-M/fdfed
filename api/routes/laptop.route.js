import express from 'express';
import { getAllLaptops, getLaptopById,getLatestLaptops } from '../crud/laptops.js';

const router = express.Router();

router.get('/latest-laptops', async (req, res) => {
  try {
    const laptops = await getLatestLaptops(5);
    res.json(laptops);
  } catch (error) {
    console.error('Error fetching latest laptops:', error);
    res.status(500).json({ error: 'Failed to fetch latest laptops' });
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

export default router;