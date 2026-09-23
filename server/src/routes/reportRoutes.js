import express from 'express';
import { getOverviewStats, getAnalytics } from '../controllers/reportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin only routes for reports and analytics
router.use(authenticate, authorizeRole('ADMIN'));

router.get('/stats', getOverviewStats);
router.get('/analytics', getAnalytics);

export default router;
