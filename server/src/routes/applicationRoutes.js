import express from 'express';
import { createApplication, getMyApplications, getApplicationById } from '../controllers/applicationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createApplication);
router.get('/my', getMyApplications);
router.get('/:id', getApplicationById);

export default router;
