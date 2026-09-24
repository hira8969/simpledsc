import express from 'express';
import { recommend } from '../controllers/dscController.js';

const router = express.Router();

router.post('/recommend', recommend);

export default router;
