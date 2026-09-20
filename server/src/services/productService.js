import { Product } from '../models/Product.js';
import { GST_RATE, USB_TOKEN_PRICE } from '../config/constants.js';

export class ProductService {
  static async getAllProducts(query = {}) {
    const filter = { status: 'ACTIVE' };
    if (query.category) {
      filter.category = query.category;
    }
    return Product.find(filter).sort({ basePrice: 1 });
  }

  static async getProductBySlug(slug) {
    const product = await Product.findOne({ slug });
    if (!product) {
      throw new Error(`Product not found for slug: ${slug}`);
    }
    return product;
  }

  static async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(`Product not found with id: ${id}`);
    }
    return product;
  }

  /**
   * Calculate precise quotation for a product based on validity and USB token inclusion
   */
  static calculateQuotation(product, validityYears = 2, includeUsbToken = true) {
    const option = product.validityOptions.find(o => o.years === Number(validityYears)) || {
      years: validityYears,
      price: product.basePrice * validityYears
    };

    const baseAmount = option.discountPrice || option.price;
    const tokenAmount = includeUsbToken ? USB_TOKEN_PRICE : 0;
    const taxableAmount = baseAmount + tokenAmount;
    const taxAmount = Math.round(taxableAmount * GST_RATE);
    const totalAmount = taxableAmount + taxAmount;

    return {
      productId: product._id,
      productName: product.name,
      validityYears,
      includeUsbToken,
      baseAmount,
      tokenAmount,
      taxableAmount,
      gstRate: 18,
      taxAmount,
      totalAmount
    };
  }
}
