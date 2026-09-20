import express from 'express';
import { getProducts, getProductBySlug, getProductById, getQuotation } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/quotation', getQuotation);

export default router;
