import express from 'express';
import { submitPhoneApplication, getPhoneApplications, updatePhoneApplicationStatus, upload } from '../controllers/phoneApplication.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Phone Applications
 *   description: Phone application submission APIs
 */

/**
 * @swagger
 * /api/phone-applications/submit:
 *   post:
 *     summary: Submit a phone application
 *     tags: [Phone Applications]
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
 *               - rom
 *               - processor
 *               - network
 *               - device_age
 *               - battery
 *               - camera
 *               - os
 *               - location
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
 *               rom:
 *                 type: string
 *               processor:
 *                 type: string
 *               network:
 *                 type: string
 *               device_age:
 *                 type: string
 *               battery:
 *                 type: string
 *               camera:
 *                 type: string
 *               os:
 *                 type: string
 *               location:
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
 *         description: Phone application submitted successfully
 */
router.post('/submit', verifyToken, upload.single('image_path'), submitPhoneApplication);

/**
 * @swagger
 * /api/phone-applications:
 *   get:
 *     summary: Get all phone applications
 *     tags: [Phone Applications]
 *     responses:
 *       200:
 *         description: Phone applications fetched successfully
 */
router.get('/', getPhoneApplications);

/**
 * @swagger
 * /api/phone-applications/{id}/status:
 *   put:
 *     summary: Update a phone application status
 *     tags: [Phone Applications]
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
 *               price: 18000
 *               rejection_reason: Screen issue
 *     responses:
 *       200:
 *         description: Phone application status updated successfully
 *       404:
 *         description: Phone application not found
 */
router.put('/:id/status', updatePhoneApplicationStatus);

export default router;
