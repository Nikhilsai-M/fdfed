import express from 'express';
import { getStatistics, addSupervisor, getSupervisors, removeSupervisor } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/admin.middleware.js';
const router = express.Router();

router.get('/statistics', verifyAdmin, getStatistics);
router.post('/add-supervisor', verifyAdmin, addSupervisor);
router.get('/supervisors', verifyAdmin, getSupervisors);
router.delete('/supervisors/:userId', verifyAdmin, removeSupervisor);

export default router;