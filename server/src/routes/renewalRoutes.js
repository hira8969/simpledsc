import express from 'express';
import { getMyRenewals, requestRenewal } from '../controllers/renewalController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/my', getMyRenewals);
router.post('/request', requestRenewal);

export default router;
