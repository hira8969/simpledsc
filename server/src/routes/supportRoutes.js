import express from 'express';
import { createTicket, getMyTickets, replyTicket } from '../controllers/supportController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/tickets', createTicket);
router.get('/tickets/my', getMyTickets);
router.post('/tickets/:id/reply', replyTicket);

export default router;
