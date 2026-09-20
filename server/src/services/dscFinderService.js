import { Product } from '../models/Product.js';
import { PRODUCT_CATEGORIES } from '../config/constants.js';

export class DscFinderService {
  /**
   * Recommend products based on user requirements
   */
  static async recommend({ purpose, activity, needEncryption, validityYears = 2 }) {
    const products = await Product.find({ status: 'ACTIVE' });

    const scoredProducts = products.map(product => {
      let score = 0;
      const reasons = [];

      // Category matching
      if (purpose === 'IMPORT_EXPORT' && product.category === PRODUCT_CATEGORIES.DGFT) {
        score += 50;
        reasons.push('Specifically designed for DGFT portal, ICEGATE and Foreign Trade policies.');
      } else if (purpose === 'GOVERNMENT' || activity === 'HIGH_VALUE_TENDER') {
        if (product.category === PRODUCT_CATEGORIES.ETENDER || (product.hasEncryption && product.category === PRODUCT_CATEGORIES.CLASS_3_ORGANIZATION)) {
          score += 45;
          reasons.push('Includes cryptographic encryption key required for CPPP, Railway, and State e-Tendering portals.');
        }
      } else if (purpose === 'MCA_ROC' || activity === 'MCA_FILING') {
        if (product.category === PRODUCT_CATEGORIES.MCA || product.category === PRODUCT_CATEGORIES.CLASS_3_INDIVIDUAL) {
          score += 40;
          reasons.push('Perfect for Ministry of Corporate Affairs (MCA V3 portal), DIN registration, and Director filings.');
        }
      } else if (purpose === 'GST_INCOME_TAX' || activity === 'TAX_FILING') {
        if (product.category === PRODUCT_CATEGORIES.CLASS_3_INDIVIDUAL) {
          score += 40;
          reasons.push('Recognized for seamless Income Tax e-verification and GST portal corporate signing.');
        }
      } else if (purpose === 'BUSINESS' || activity === 'DOCUMENT_SIGNING') {
        if (product.category === PRODUCT_CATEGORIES.CLASS_3_ORGANIZATION || product.category === PRODUCT_CATEGORIES.DOCUMENT_SIGNER) {
          score += 45;
          reasons.push('Authorized for authorized corporate signatories, HR signing, and enterprise bulk document sealing.');
        }
      } else {
        // General default
        if (product.category === PRODUCT_CATEGORIES.CLASS_3_INDIVIDUAL) {
          score += 30;
          reasons.push('Versatile Class 3 DSC valid across all major Indian government and legal portals.');
        }
      }

      // Encryption matching
      if (needEncryption === true || needEncryption === 'true' || needEncryption === 'YES') {
        if (product.hasEncryption) {
          score += 25;
          reasons.push('Includes both Signing + Encryption certificate combo.');
        } else {
          score -= 20;
        }
      } else {
        if (!product.hasEncryption) {
          score += 15;
          reasons.push('Cost-effective Signature-only option.');
        }
      }

      return {
        product,
        score,
        reasons
      };
    });

    // Sort descending by score
    scoredProducts.sort((a, b) => b.score - a.score);

    return {
      success: true,
      recommendations: scoredProducts.slice(0, 3).map(item => ({
        ...item.product.toObject(),
        matchScore: item.score,
        matchReasons: item.reasons
      })),
      disclaimer: 'Based on your answers, these products may match your stated requirements. Please confirm with your Chartered Accountant (CA) or compliance provider if unsure.'
    };
  }
}
