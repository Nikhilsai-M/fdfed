import express from 'express';
import { submitPhoneApplication, getPhoneApplications, updatePhoneApplicationStatus, upload } from '../controllers/phoneApplication.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Use multer middleware for file upload on submit route
router.post('/submit', verifyToken, upload.single('image_path'), submitPhoneApplication);
router.get('/', getPhoneApplications);
router.put('/:id/status', updatePhoneApplicationStatus);

export default router;