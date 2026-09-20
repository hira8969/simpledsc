import express from 'express';
import { getInvoiceByOrderId, getMyInvoices } from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/my', getMyInvoices);
router.get('/order/:orderId', getInvoiceByOrderId);

export default router;
