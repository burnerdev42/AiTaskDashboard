import express from 'express';
const router = express.Router();
import { getMetrics } from '../controllers/metricController';
import { protect } from '../middleware/authMiddleware';

router.get('/', protect, getMetrics as any);

export default router;
