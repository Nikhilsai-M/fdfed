import express from 'express';
import { submitLaptopApplication, getLaptopApplications, updateLaptopApplicationStatus, upload } from '../controllers/laptopApplication.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Use multer middleware for file upload on submit route
router.post('/submit', upload.single('image_path'), submitLaptopApplication);
router.get('/', getLaptopApplications);
router.put('/:id/status', updateLaptopApplicationStatus);

export default router;