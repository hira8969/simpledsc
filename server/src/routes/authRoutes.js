import express from 'express';
import { register, login, sendOtp, verifyOtp, adminLogin, getMe, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/admin-login', adminLogin);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
