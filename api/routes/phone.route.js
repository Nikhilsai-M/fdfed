import express from 'express';
import { getAllPhones, getPhoneById ,getLatestPhones} from '../crud/phones.js';

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

// Get phone by ID
router.get('/:id', async (req, res) => {
  try {
    const phone = await getPhoneById(req.params.id);
    if (!phone) {
      return res.status(404).json({ error: 'Phone not found' });
    }
    res.json(phone);
  } catch (error) {
    console.error('Error fetching phone:', error);
    res.status(500).json({ error: 'Failed to fetch phone' });
  }
});

// Get all phones
router.get('/', async (req, res) => {
  try {
    const phones = await getAllPhones();
    res.json(phones);
  } catch (error) {
    console.error('Error fetching phones:', error);
    res.status(500).json({ error: 'Failed to fetch phones' });
  }
});



export default router;