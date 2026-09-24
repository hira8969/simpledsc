import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authenticate, requireAdmin, getContacts);

export default router;
