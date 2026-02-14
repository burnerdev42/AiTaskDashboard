import express from 'express';
const router = express.Router();
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from '../controllers/challengeController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getChallenges as any).post(protect, createChallenge as any);
router.route('/:id').put(protect, updateChallenge as any).delete(protect, deleteChallenge as any);

export default router;
