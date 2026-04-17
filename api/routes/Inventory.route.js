import express from "express";
import { 
  getAllInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from "../controllers/inventory.controller.js";
import { verifySupervisor } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Supervisor inventory management APIs
 */

/**
 * @swagger
 * /api/supervisor/inventory:
 *   get:
 *     summary: Get all supervisor inventory items
 *     tags: [Inventory]
 *     security:
 *       - supervisorTokenCookie: []
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifySupervisor, getAllInventory);

/**
 * @swagger
 * /api/supervisor/inventory:
 *   post:
 *     summary: Add an inventory item
 *     tags: [Inventory]
 *     security:
 *       - supervisorTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               type: phone
 *               brand: Samsung
 *               model: Galaxy S22
 *     responses:
 *       200:
 *         description: Inventory item added successfully
 */
router.post("/", verifySupervisor, addInventoryItem);

/**
 * @swagger
 * /api/supervisor/inventory/{type}/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               brand: Samsung
 *               pricing:
 *                 base_price: 45999
 *                 discount: 8
 *               model: Galaxy S22
 *               condition: Excellent
 *               image: https://example.com/phone.jpg
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.put("/:type/:id", verifySupervisor, updateInventoryItem);

/**
 * @swagger
 * /api/supervisor/inventory/{type}/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
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
 *         description: Inventory item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory item not found
 */
router.delete("/:type/:id", verifySupervisor, deleteInventoryItem);

export default router;
