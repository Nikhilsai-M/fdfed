import express from 'express';
import { submitLaptopApplication, getLaptopApplications, updateLaptopApplicationStatus, upload } from '../controllers/laptopApplication.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Laptop Applications
 *   description: Laptop application submission APIs
 */

/**
 * @swagger
 * /api/laptop-applications/submit:
 *   post:
 *     summary: Submit a laptop application
 *     tags: [Laptop Applications]
 *     security:
 *       - bearerAuth: []
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - ram
 *               - storage
 *               - processor
 *               - location
 *               - description
 *               - name
 *               - email
 *               - phone
 *               - image_path
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               ram:
 *                 type: string
 *               storage:
 *                 type: string
 *               processor:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               image_path:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Laptop application submitted successfully
 */
router.post('/submit', verifyToken, upload.single('image_path'), submitLaptopApplication);

/**
 * @swagger
 * /api/laptop-applications:
 *   get:
 *     summary: Get all laptop applications
 *     tags: [Laptop Applications]
 *     responses:
 *       200:
 *         description: Laptop applications fetched successfully
 */
router.get('/', getLaptopApplications);

/**
 * @swagger
 * /api/laptop-applications/{id}/status:
 *   put:
 *     summary: Update a laptop application status
 *     tags: [Laptop Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               status: approved
 *               price: 28000
 *               rejection_reason: Cosmetic damage
 */
router.put('/:id/status', updateLaptopApplicationStatus);

export default router;
