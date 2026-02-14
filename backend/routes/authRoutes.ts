import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe as any); // Type cast for AuthRequest compatibility in routing

export default router;
