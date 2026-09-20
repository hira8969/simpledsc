import express from 'express';
import { initiatePayment, verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook from payment provider (no user auth)
router.post('/webhook', handleWebhook);

// Authenticated endpoints
router.post('/initiate', authenticate, initiatePayment);
router.post('/verify', authenticate, verifyPayment);

export default router;
