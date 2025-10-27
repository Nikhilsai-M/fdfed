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

// Dashboard routes
router.get("/dashboard", verifySupervisor, getDashboardData);
router.get("/statistics", verifySupervisor, getStatistics);

// Application verification routes
router.get("/verify-applications", verifySupervisor, getVerifyApplications);
router.get("/application/:type/:id", verifySupervisor, getApplicationDetails);
router.put("/application/:type/:id/status", verifySupervisor, updateApplicationStatus);
router.post("/add-to-inventory/:type/:id", verifySupervisor, addToInventory);

// Profile routes
router.get("/profile", verifySupervisor, getSupervisorProfile);
router.put("/profile", verifySupervisor, updateSupervisorProfile);
router.post("/password", verifySupervisor, updateSupervisorPassword);

// Logout
router.get("/logout", verifySupervisor, supervisorLogout);

export default router;