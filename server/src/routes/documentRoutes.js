import express from 'express';
import { uploadDocument, getApplicationDocuments, downloadDocument } from '../controllers/documentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/application/:applicationId', getApplicationDocuments);
router.get('/:id/download', downloadDocument);

export default router;
