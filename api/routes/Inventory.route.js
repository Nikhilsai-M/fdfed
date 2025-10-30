import express from "express";
import { 
  getAllInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from "../controllers/inventory.controller.js";
import { verifySupervisor } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifySupervisor, getAllInventory);
router.post("/", verifySupervisor, addInventoryItem);
router.put("/:type/:id", verifySupervisor, updateInventoryItem);
router.delete("/:type/:id", verifySupervisor, deleteInventoryItem);

export default router;