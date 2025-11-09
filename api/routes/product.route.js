import express from 'express';
import { getLatestPhones } from '../crud/phones.js';
import { getLatestLaptops } from '../crud/laptops.js';
const router = express.Router();

router.get('/latest-products', async (req, res) => {
    try {
      const latestPhones = await getLatestPhones();
      const latestLaptops = await getLatestLaptops();
  
      // Combine both
      const allLatestProducts = [...latestPhones, ...latestLaptops];
  
      // Sort by created_at DESC
      allLatestProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      res.json(allLatestProducts);
    } catch (error) {
      console.error('Error fetching latest products:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  export default router;





