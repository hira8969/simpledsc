import express from 'express';
import { recommend } from '../controllers/dscFinderController.js';

const router = express.Router();

router.post('/recommend', recommend);

export default router;
