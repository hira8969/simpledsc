import { ProductService } from '../services/productService.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts(req.query);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await ProductService.getProductBySlug(req.params.slug);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getQuotation = async (req, res, next) => {
  try {
    const { productId, validityYears, includeUsbToken } = req.body;
    const product = await ProductService.getProductById(productId);
    const quotation = ProductService.calculateQuotation(
      product,
      validityYears || 2,
      includeUsbToken !== false
    );
    res.json({ success: true, quotation });
  } catch (error) {
    next(error);
  }
};
