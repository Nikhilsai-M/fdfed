// api/routes/laptop.route.js
import express from 'express';
import { getLatestLaptops } from '../crud/laptops.js';

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

export default router;