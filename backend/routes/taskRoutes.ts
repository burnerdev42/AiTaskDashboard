import express from 'express';
const router = express.Router();
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getTasks as any).post(protect, createTask as any);
router.route('/:id').put(protect, updateTask as any).delete(protect, deleteTask as any);

export default router;
