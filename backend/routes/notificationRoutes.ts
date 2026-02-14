import express from 'express';
const router = express.Router();
import { getNotifications, markAsRead } from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getNotifications as any);
router.route('/:id/read').put(protect, markAsRead as any);

export default router;
