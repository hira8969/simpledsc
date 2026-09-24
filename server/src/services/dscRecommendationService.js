import { Product } from '../models/Product.js';

export const recommendDSC = async ({ purpose, usage, requirement, activity, needEncryption, validityYears }) => {
  const p = (purpose || '').toLowerCase();
  const u = (usage || activity || '').toLowerCase();
  const r = (requirement || '').toLowerCase();

  const allProducts = await Product.find({ isActive: true });

  let targetSlug = 'class-3-dsc';
  let reason = 'Class 3 DSC is the most versatile certificate in India, valid for MCA, Income Tax, GST, and personal identity verification.';

  if (p.includes('import') || p.includes('export') || u.includes('dgft') || u.includes('iec') || r.includes('customs')) {
    targetSlug = 'dgft-dsc';
    reason = 'Based on your import/export requirements, the DGFT DSC with embedded IEC code is required for customs and foreign trade filings.';
  } else if (p.includes('tender') || p.includes('government') || p.includes('psu') || u.includes('tender') || u.includes('gem') || r.includes('encrypt') || needEncryption) {
    targetSlug = 'etender-dsc';
    reason = 'Government e-tenders and GeM bidding strictly mandate dual Signing and Encryption certificates to prevent bid tampering.';
  } else if (u.includes('mca') || u.includes('din') || u.includes('roc') || u.includes('incorporation') || (p.includes('business') && u.includes('director'))) {
    targetSlug = 'mca-dsc';
    reason = 'Optimized for MCA V3 portal, Director Identification Number (DIN) registration, and ROC annual returns.';
  } else if (u.includes('bulk') || u.includes('erp') || u.includes('invoice') || r.includes('automated')) {
    targetSlug = 'document-signer-dsc';
    reason = 'Designed specifically for high-speed automated server-side batch signing of GST e-Invoices and PDF contracts.';
  } else if (p.includes('individual') && (u.includes('personal') || u.includes('itr') || u.includes('tax'))) {
    targetSlug = 'class-2-dsc';
    reason = 'Class 2 DSC is an economical and straightforward certificate for individual taxpayers and basic filings.';
  } else {
    targetSlug = 'class-3-dsc';
    reason = 'Based on your requirements, we recommend Class 3 DSC. It is the gold standard for high-security compliance in India.';
  }

  let recommendedProduct = allProducts.find(prod => prod.slug === targetSlug);
  if (!recommendedProduct) {
    recommendedProduct = allProducts.find(prod => prod.slug === 'class-3-dsc') || allProducts[0];
  }

  return {
    success: true,
    recommendationText: `Based on your requirements, we recommend ${recommendedProduct?.name || 'Class 3 DSC'}.`,
    product: recommendedProduct,
    reason,
    purpose,
    usage,
    requirement,
    alternatives: allProducts.filter(item => item.slug !== recommendedProduct?.slug).slice(0, 2)
  };
};
