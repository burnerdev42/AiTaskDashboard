import express from 'express';
const router = express.Router();
import { getIdeas, createIdea, updateIdea, deleteIdea } from '../controllers/ideaController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getIdeas as any).post(protect, createIdea as any);
router.route('/:id').put(protect, updateIdea as any).delete(protect, deleteIdea as any);

export default router;
