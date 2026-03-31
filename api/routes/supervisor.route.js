import express from "express";
import { 
  getDashboardData, 
  getStatistics, 
  getVerifyApplications, 
  getApplicationDetails, 
  updateApplicationStatus,
  addToInventory,
  getSupervisorProfile,
  updateSupervisorProfile,
  updateSupervisorPassword,
  supervisorLogout
} from "../controllers/supervisor.controller.js";
import { verifySupervisor } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Supervisor
 *   description: Supervisor dashboard and workflow APIs
 */

/**
 * @swagger
 * /api/supervisor/dashboard:
 *   get:
 *     summary: Get supervisor dashboard data
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     responses:
 *       200:
 *         description: Supervisor dashboard fetched successfully
 */
router.get("/dashboard", verifySupervisor, getDashboardData);

/**
 * @swagger
 * /api/supervisor/statistics:
 *   get:
 *     summary: Get supervisor statistics
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     responses:
 *       200:
 *         description: Supervisor statistics fetched successfully
 */
router.get("/statistics", verifySupervisor, getStatistics);

/**
 * @swagger
 * /api/supervisor/verify-applications:
 *   get:
 *     summary: Get applications assigned for supervisor review
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 */
router.get("/verify-applications", verifySupervisor, getVerifyApplications);

/**
 * @swagger
 * /api/supervisor/application/{type}/{id}:
 *   get:
 *     summary: Get application details by type and ID
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application details fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.get("/application/:type/:id", verifySupervisor, getApplicationDetails);

/**
 * @swagger
 * /api/supervisor/application/{type}/{id}/status:
 *   put:
 *     summary: Update an application status
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.put("/application/:type/:id/status", verifySupervisor, updateApplicationStatus);

/**
 * @swagger
 * /api/supervisor/add-to-inventory/{type}/{id}:
 *   post:
 *     summary: Add an approved application to inventory
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application added to inventory successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.post("/add-to-inventory/:type/:id", verifySupervisor, addToInventory);

/**
 * @swagger
 * /api/supervisor/profile:
 *   get:
 *     summary: Get the logged-in supervisor profile
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     responses:
 *       200:
 *         description: Supervisor profile fetched successfully
 */
router.get("/profile", verifySupervisor, getSupervisorProfile);

/**
 * @swagger
 * /api/supervisor/profile:
 *   put:
 *     summary: Update the logged-in supervisor profile
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Supervisor profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", verifySupervisor, updateSupervisorProfile);

/**
 * @swagger
 * /api/supervisor/password:
 *   post:
 *     summary: Update the logged-in supervisor password
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               currentPassword: oldPassword123
 *               newPassword: newPassword123
 *     responses:
 *       200:
 *         description: Supervisor password updated successfully
 *       400:
 *         description: Invalid password update request
 *       401:
 *         description: Unauthorized
 */
router.post("/password", verifySupervisor, updateSupervisorPassword);

/**
 * @swagger
 * /api/supervisor/logout:
 *   get:
 *     summary: Log out the current supervisor
 *     tags: [Supervisor]
 *     security:
 *       - supervisorTokenCookie: []
 *     responses:
 *       200:
 *         description: Supervisor logged out successfully
 */
router.get("/logout", verifySupervisor, supervisorLogout);

export default router;
