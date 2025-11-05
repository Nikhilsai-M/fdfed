// /api/routes/phone.route.js
import express from 'express';
import { getLatestPhones } from '../crud/phones.js';

const router = express.Router();

router.get('/latest-phones', async (req, res) => {
  try {
    const phones = await getLatestPhones();
    res.json(phones);
  } catch (error) {
    console.error('Error fetching latest phones:', error);
    res.status(500).json({ error: 'Failed to fetch latest phones' });
  }
});

export default router;