import express from 'express';
import { createOrder, getMyOrders, getOrderById, trackOrder } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public order status tracking
router.get('/track/:orderId', trackOrder);

// Authenticated endpoints
router.use(authenticate);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:orderId', getOrderById);

export default router;
