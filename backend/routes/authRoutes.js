import express from 'express';
import { register, login, getMe, updateProfile, getAllDemoUsers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/demo-users', getAllDemoUsers);

export default router;
