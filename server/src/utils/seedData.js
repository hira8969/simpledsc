import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { PRODUCT_CATEGORIES, DOCUMENT_TYPES } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database seeding...');

    // 1. Create Default Admin User
    const adminExists = await User.findOne({ email: 'admin@simpldsc.com' });
    if (!adminExists) {
      await User.create({
        name: 'SimplDSC System Admin',
        email: 'admin@simpldsc.com',
        mobile: '9876543210',
        role: 'ADMIN',
        status: 'ACTIVE'
      });
      console.log('[Seed] Default Admin created: admin@simpldsc.com (Mobile: 9876543210)');
    }

    // 2. Create Demo Customer
    const customerExists = await User.findOne({ mobile: '9898989898' });
    if (!customerExists) {
      await User.create({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        mobile: '9898989898',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        panNumber: 'ABCPS1234F',
        companyName: 'Sharma Global Advisory LLP',
        gstin: '29ABCPS1234F1Z5',
        address: {
          street: '45/B, Brigade Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        }
      });
      console.log('[Seed] Demo Customer created: Rahul Sharma (Mobile: 9898989898)');
    }

    // 3. Products
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      const products = [
        {
          name: 'Class 3 DSC - Individual (Signing Only)',
          slug: 'class-3-individual-signing',
          category: PRODUCT_CATEGORIES.CLASS_3_INDIVIDUAL,
          shortDescription: 'Standard Class 3 digital signature for individual tax returns, GST, and MCA filings.',
          fullDescription: 'The Class 3 Individual Signing Digital Signature is the most widely used certificate across India. Ideal for Directors, Tax Consultants, Business Owners, and Individuals requiring e-verification on the Income Tax Portal, GST Portal, MCA V3, and EPFO.',
          hasEncryption: false,
          basePrice: 1499,
          validityOptions: [
            { years: 1, price: 1499, discountPrice: 1199 },
            { years: 2, price: 2199, discountPrice: 1799 },
            { years: 3, price: 2999, discountPrice: 2499 }
          ],
          features: [
            '2048-bit RSA High-grade Encryption',
            'CCA India & IT Act 2000 Compliant',
            'Income Tax & GST e-Filing Supported',
            'MCA21 & MCA V3 Portal Valid',
            'FIPS 140-2 Level 2 Crypto Token Included'
          ],
          useCases: ['Income Tax Returns (ITR)', 'GST Invoicing & Returns', 'MCA V3 Director Signatures', 'EPFO & TRACES'],
          documentsRequired: [DOCUMENT_TYPES.PAN_CARD, DOCUMENT_TYPES.AADHAAR_FRONT, DOCUMENT_TYPES.PHOTO],
          deliveryMethod: 'USB_TOKEN_FIPS',
          popularTag: true,
          status: 'ACTIVE'
        },
        {
          name: 'Class 3 DSC - Combo (Sign + Encrypt)',
          slug: 'class-3-combo-sign-encrypt',
          category: PRODUCT_CATEGORIES.CLASS_3_INDIVIDUAL,
          shortDescription: 'Dual certificate (Signing + Encryption) essential for e-Tendering, GeM, and secure bidding.',
          fullDescription: 'Provides both cryptographic Signing and Encryption certificates on a single hardware crypto token. The encryption certificate securely seals your confidential bid documents, ensuring zero tampering before government tender opening.',
          hasEncryption: true,
          basePrice: 2499,
          validityOptions: [
            { years: 1, price: 2499, discountPrice: 2099 },
            { years: 2, price: 3499, discountPrice: 2899 },
            { years: 3, price: 4499, discountPrice: 3799 }
          ],
          features: [
            'Dual Certificate: Signer + Encryptor in 1 Token',
            'CPPP (Central Public Procurement) Ready',
            'Mandatory for GeM (Government e-Marketplace)',
            'State e-Procurement Portals Compatible',
            'Free USB Hardware Crypto Token Included'
          ],
          useCases: ['CPPP E-Procurement', 'GeM Portal Seller/Buyer', 'Defence & Railway Tenders', 'State E-Tenders'],
          documentsRequired: [DOCUMENT_TYPES.PAN_CARD, DOCUMENT_TYPES.AADHAAR_FRONT, DOCUMENT_TYPES.PHOTO],
          deliveryMethod: 'USB_TOKEN_FIPS',
          popularTag: true,
          status: 'ACTIVE'
        },
        {
          name: 'Class 3 DSC - Organization',
          slug: 'class-3-organization',
          category: PRODUCT_CATEGORIES.CLASS_3_ORGANIZATION,
          shortDescription: 'Issued in company name with authorized signatory for corporate filings and contracts.',
          fullDescription: 'Issued to employees and authorized signatories representing a Company, LLP, Partnership, or Trust. Authenticates corporate identity for high-value tenders, international banking, MCA filings, and commercial vendor agreements.',
          hasEncryption: true,
          basePrice: 3499,
          validityOptions: [
            { years: 1, price: 3499, discountPrice: 2999 },
            { years: 2, price: 4999, discountPrice: 4199 },
            { years: 3, price: 6499, discountPrice: 5399 }
          ],
          features: [
            'Includes Company Name in Certificate Subject',
            'Signing + Encryption Combo Included',
            'Authorized Signatory Authentication',
            'Legal Binding under Section 3 of Indian IT Act',
            'Priority Fast-track KYC Verification'
          ],
          useCases: ['High-Value Enterprise Bids', 'MCA Corporate Filings', 'Customs ICEGATE Clearance', 'Vendor Vendor Agreements'],
          documentsRequired: [
            DOCUMENT_TYPES.PAN_CARD,
            DOCUMENT_TYPES.AADHAAR_FRONT,
            DOCUMENT_TYPES.PHOTO,
            DOCUMENT_TYPES.GST_CERTIFICATE,
            DOCUMENT_TYPES.BOARD_RESOLUTION
          ],
          deliveryMethod: 'USB_TOKEN_FIPS',
          popularTag: false,
          status: 'ACTIVE'
        },
        {
          name: 'DGFT Digital Signature Certificate',
          slug: 'dgft-dsc',
          category: PRODUCT_CATEGORIES.DGFT,
          shortDescription: 'Mandatory DSC for Importers & Exporters on the Directorate General of Foreign Trade portal.',
          fullDescription: 'Specialized digital signature certificate embedded with IEC (Import Export Code). Tailored specifically for Indian import-export enterprises filing foreign trade applications, license applications, and clearance under foreign trade policies.',
          hasEncryption: false,
          basePrice: 2799,
          validityOptions: [
            { years: 1, price: 2799, discountPrice: 2299 },
            { years: 2, price: 3999, discountPrice: 3299 },
            { years: 3, price: 5199, discountPrice: 4299 }
          ],
          features: [
            'IEC (Import Export Code) Embedded Certificate',
            'Approved for DGFT Online Portal Applications',
            'Duty Drawback & License Incentive Processing',
            'Instant Recognition on ICEGATE',
            'Plug & Play FIPS Token Included'
          ],
          useCases: ['DGFT Import/Export Filings', 'Advance Authorization Applications', 'Duty Remission Schemes', 'Customs Bill of Entry Signing'],
          documentsRequired: [
            DOCUMENT_TYPES.PAN_CARD,
            DOCUMENT_TYPES.AADHAAR_FRONT,
            DOCUMENT_TYPES.PHOTO,
            DOCUMENT_TYPES.GST_CERTIFICATE
          ],
          deliveryMethod: 'USB_TOKEN_FIPS',
          popularTag: false,
          status: 'ACTIVE'
        },
        {
          name: 'Document Signer Certificate',
          slug: 'document-signer-dsc',
          category: PRODUCT_CATEGORIES.DOCUMENT_SIGNER,
          shortDescription: 'Automated bulk PDF signing for banks, fintechs, ERPs, and automated e-Invoicing systems.',
          fullDescription: 'Designed for server-side automated bulk signing of invoices, salary slips, bank statements, and client agreements without requiring manual PIN entry for every document. Ideal for ERP integrations (SAP, Oracle, Tally, Zoho).',
          hasEncryption: false,
          basePrice: 5999,
          validityOptions: [
            { years: 1, price: 5999, discountPrice: 5299 },
            { years: 2, price: 8999, discountPrice: 7799 },
            { years: 3, price: 11999, discountPrice: 10499 }
          ],
          features: [
            'Automated High-volume Bulk Document Signing',
            'Compatible with Java, .NET, Python, Node.js PDF Signers',
            'HSM / Crypto Token Supported',
            'GST e-Invoice Bulk Signing Compliant',
            'Enterprise Technical Support Included'
          ],
          useCases: ['Automated GST Invoices', 'Bank Statements & Account Aggregators', 'HR Form 16 Bulk Generation', 'ERP Order Confirmations'],
          documentsRequired: [
            DOCUMENT_TYPES.PAN_CARD,
            DOCUMENT_TYPES.AADHAAR_FRONT,
            DOCUMENT_TYPES.PHOTO,
            DOCUMENT_TYPES.GST_CERTIFICATE,
            DOCUMENT_TYPES.BOARD_RESOLUTION
          ],
          deliveryMethod: 'USB_TOKEN_FIPS',
          popularTag: false,
          status: 'ACTIVE'
        }
      ];

      await Product.insertMany(products);
      console.log(`[Seed] ${products.length} DSC products seeded successfully.`);
    }

    // 4. Default Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        key: 'BUSINESS_INFO',
        value: {
          brandName: 'SimplDSC',
          tagline: 'Digital Signatures, Made Simple.',
          companyLegalName: 'SIMPLDSC TECHNOLOGIES PVT LTD',
          gstin: '29AABCS1429B1Z8',
          supportEmail: 'support@simpldsc.in',
          supportPhone: '+91 80 4719 2800',
          address: 'Plot 42, Cyber Gateway Tech Zone, Whitefield, Bangalore, Karnataka - 560066',
          renewalReminderDays: [60, 30, 15, 7]
        },
        description: 'Core business and legal settings'
      });
      console.log('[Seed] Default settings seeded.');
    }

    console.log('[Seed] Database seeding completed successfully.');
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};

// If run directly via npm run seed
if (process.argv[1] && process.argv[1].includes('seedData.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
