import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { FAQ } from '../models/FAQ.js';
import { Settings } from '../models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database seeding...');

    // 1. Create Default Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@simpldsc.in';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword@123';
    
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: 'SimplDSC Admin',
        email: adminEmail,
        phone: '9876543210',
        mobile: '9876543210',
        password: adminPassword,
        role: 'admin',
        status: 'ACTIVE',
        isVerified: true
      });
      await admin.save();
      console.log(`[Seed] Default Admin created: ${adminEmail} (Password: ${adminPassword})`);
    }

    // Also support backup admin email if different
    const backupAdminEmail = 'admin@simpldsc.com';
    let backupAdmin = await User.findOne({ email: backupAdminEmail });
    if (!backupAdmin) {
      backupAdmin = new User({
        name: 'SimplDSC System Admin',
        email: backupAdminEmail,
        phone: '9876543210',
        mobile: '9876543210',
        password: adminPassword,
        role: 'admin',
        status: 'ACTIVE',
        isVerified: true
      });
      await backupAdmin.save();
    }

    // 2. Demo Customer
    let customer = await User.findOne({ email: 'rahul.sharma@example.com' });
    if (!customer) {
      customer = new User({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '9898989898',
        mobile: '9898989898',
        password: 'Password@123',
        role: 'user',
        status: 'ACTIVE',
        isVerified: true,
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
      await customer.save();
      console.log('[Seed] Demo Customer created: rahul.sharma@example.com');
    }

    // 3. Products
    await Product.deleteMany({});
    const products = [
      {
        name: 'Class 2 DSC',
        slug: 'class-2-dsc',
        category: 'Class 2 DSC',
        shortDescription: 'For individuals and small businesses.',
        description: 'Ideal for individuals and small business owners needing digital authentication for basic tax filings, invoices, and organizational portals.',
        fullDescription: 'Class 2 Digital Signature Certificates offer secure personal identification for individual taxpayers, professionals, and small business owners. Convenient and fully compliant with Indian IT standards.',
        price: 1499,
        basePrice: 1499,
        validity: '1 Year',
        validityOptions: [
          { years: 1, price: 1499, discountPrice: 1299 },
          { years: 2, price: 2199, discountPrice: 1899 },
          { years: 3, price: 2899, discountPrice: 2499 }
        ],
        image: 'epass2003',
        features: [
          'Aadhaar eKYC Verification',
          'PAN Card Verification',
          'Standard Email & Chat Support',
          'Free Reissuance Guarantee*',
          '2048-bit Cryptographic Security'
        ],
        suitableFor: [
          'Individual Taxpayers',
          'Small Business Proprietors',
          'Basic Document Authentication',
          'Internal Corporate Signings'
        ],
        requiredDocuments: [
          'PAN Card (Scanned Copy)',
          'Aadhaar Card (for OTP verification)',
          'Passport Size Photograph'
        ],
        isPopular: false,
        isActive: true,
        hasEncryption: false,
        deliveryMethod: 'USB_TOKEN_FIPS'
      },
      {
        name: 'Class 3 DSC',
        slug: 'class-3-dsc',
        category: 'Class 3 DSC',
        shortDescription: 'For directors, companies and high security usage.',
        description: 'The highest security level DSC in India. Mandatory for MCA V3 director filings, ROC compliances, EPFO, Income Tax, and high-value transactions.',
        fullDescription: 'Class 3 Digital Signature Certificates provide the highest level of assurance and cryptographic protection under the Indian IT Act. Required for MCA portal filings, company directors (DIN), GST returns, and corporate transactions.',
        price: 1999,
        basePrice: 1999,
        validity: '1 Year',
        validityOptions: [
          { years: 1, price: 1999, discountPrice: 1699 },
          { years: 2, price: 2799, discountPrice: 2399 },
          { years: 3, price: 3499, discountPrice: 2999 }
        ],
        image: 'epass2003',
        features: [
          'Aadhaar eKYC & Paperless Verification',
          'PAN Verification within Minutes',
          '30-Second Express Video Verification',
          'Priority VIP Expert Support',
          'Free Reissuance Guarantee*',
          'FIPS 140-2 Level 2 USB Token Included'
        ],
        suitableFor: [
          'Company Directors & Partners',
          'Chartered Accountants & CS',
          'MCA21 & MCA V3 ROC Filings',
          'Income Tax & GST e-Filing Portals',
          'EPFO, TRACES & Patent Filings'
        ],
        requiredDocuments: [
          'PAN Card Copy',
          'Aadhaar Card (Linked with Mobile)',
          'Passport Size Photograph',
          'Company Proof (if Organization DSC)'
        ],
        isPopular: true,
        isActive: true,
        hasEncryption: false,
        deliveryMethod: 'USB_TOKEN_FIPS'
      },
      {
        name: 'DGFT DSC',
        slug: 'dgft-dsc',
        category: 'DGFT',
        shortDescription: 'For import export (IEC) code.',
        description: 'Mandatory digital signature embedded with IEC (Import Export Code) for foreign trade transactions on DGFT and ICEGATE portals.',
        fullDescription: 'Specifically customized for Indian Importers, Exporters, and Custom House Agents. Contains your 10-digit Import Export Code directly embedded in the digital certificate for seamless clearance on DGFT government portals.',
        price: 1999,
        basePrice: 1999,
        validity: '1 Year',
        validityOptions: [
          { years: 1, price: 1999, discountPrice: 1799 },
          { years: 2, price: 2999, discountPrice: 2599 },
          { years: 3, price: 3999, discountPrice: 3399 }
        ],
        image: 'vsign',
        features: [
          'IEC Embedded in Certificate Data',
          '100% Approved for DGFT Portal',
          'Customs & ICEGATE Bill of Entry Compatible',
          'Duty Drawback & Scheme Processing',
          'Plug & Play USB Token Included'
        ],
        suitableFor: [
          'Exporters & Importers in India',
          'Customs House Agents (CHAs)',
          'Foreign Trade Policy License Seekers',
          'SEZ & EOU Units'
        ],
        requiredDocuments: [
          'Applicant PAN & Aadhaar',
          'IEC Certificate Copy',
          'GST Certificate',
          'Passport Size Photograph'
        ],
        isPopular: false,
        isActive: true,
        hasEncryption: false,
        deliveryMethod: 'USB_TOKEN_FIPS'
      },
      {
        name: 'eTender DSC',
        slug: 'etender-dsc',
        category: 'eTender',
        shortDescription: 'For government tenders.',
        description: 'Dual certificate (Signing + Encryption) essential for online e-Procurement, CPPP, GeM bidding, and Indian Railways tenders.',
        fullDescription: 'The eTender DSC contains both Signing and Encryption cryptographic key pairs. The encryption certificate securely seals bid documents, ensuring confidential tender bidding on Central and State government eProcurement portals.',
        price: 2499,
        basePrice: 2499,
        validity: '1 Year',
        validityOptions: [
          { years: 1, price: 2499, discountPrice: 2199 },
          { years: 2, price: 3499, discountPrice: 2999 },
          { years: 3, price: 4499, discountPrice: 3899 }
        ],
        image: 'capsigns',
        features: [
          'Combo Certificate: Signing + Encryption in 1 Token',
          'CPPP Central Procurement Ready',
          'GeM Portal (Government e-Marketplace) Compatible',
          'Indian Railways & Defence Tenders Compatible',
          'Zero Tampering Cryptographic Bid Protection'
        ],
        suitableFor: [
          'Government Contractors & Bidders',
          'GeM Registered Sellers & Buyers',
          'State e-Tender Participants (PWD, Irrigation, etc.)',
          'PSU Vendors and Suppliers'
        ],
        requiredDocuments: [
          'Applicant PAN & Aadhaar',
          'Organization GST Certificate',
          'Board Resolution / Authority Letter',
          'Applicant Photograph'
        ],
        isPopular: false,
        isActive: true,
        hasEncryption: true,
        deliveryMethod: 'USB_TOKEN_FIPS'
      },
      {
        name: 'MCA DSC',
        slug: 'mca-dsc',
        category: 'MCA',
        shortDescription: 'For company filings (DIN, ROC).',
        description: 'Specialized Class 3 DSC optimized for Ministry of Corporate Affairs (MCA21 & V3 portal), Director Identification Number (DIN) registration, and ROC compliance.',
        fullDescription: 'Guaranteed compatibility with MCA V3 portal for signing Spice+ company incorporation forms, Annual Returns (AOC-4, MGT-7), DIR-3 KYC, and Board resolutions. Includes priority support for quick registration on MCA portal.',
        price: 2499,
        basePrice: 2499,
        validity: '1 Year',
        validityOptions: [
          { years: 1, price: 2499, discountPrice: 2199 },
          { years: 2, price: 3499, discountPrice: 2999 },
          { years: 3, price: 4499, discountPrice: 3899 }
        ],
        image: 'ncode',
        features: [
          'MCA21 & MCA V3 Portal Certified',
          'DIN (Director Identification Number) Compatible',
          'ROC Annual Filing & Incorporation Compliant',
          'Fast Track 15-Minute Issuance',
          'Free MCA Registration Assistance'
        ],
        suitableFor: [
          'Company Directors (DIN Holders)',
          'Company Secretaries & Practicing CAs',
          'Startup Founders Incorporating New Companies',
          'Designated Partners of LLPs'
        ],
        requiredDocuments: [
          'Director PAN Card',
          'Director Aadhaar Card',
          'Passport Size Photograph',
          'DIN Details (if existing director)'
        ],
        isPopular: false,
        isActive: true,
        hasEncryption: false,
        deliveryMethod: 'USB_TOKEN_FIPS'
      },
      {
        name: 'Document Signer DSC',
        slug: 'document-signer-dsc',
        category: 'Document Signer',
        shortDescription: 'For bulk document signing.',
        description: 'High-speed automated bulk signing certificate for corporate ERPs, GST e-Invoicing, salary slips, and digital contracts without manual PIN prompts.',
        fullDescription: 'The Document Signer Certificate allows enterprises to automate digital signing of high-volume PDF documents including GST e-Invoices, salary slips, Form 16, account statements, and vendor contracts. Supports server-side batch signing through API and ERP connectors.',
        price: 2999,
        basePrice: 2999,
        validity: '1 Year',
        validityOptions: [
          { years: 1, price: 2999, discountPrice: 2699 },
          { years: 2, price: 4999, discountPrice: 4299 },
          { years: 3, price: 6999, discountPrice: 5899 }
        ],
        image: 'emudhra',
        features: [
          'High Volume Automated Batch Signing',
          'Integration with SAP, Oracle, Tally, & Zoho',
          'GST e-Invoicing & Form 16 Bulk Signing',
          'Enterprise HSM & Token Supported',
          'Dedicated Technical Integration Specialist'
        ],
        suitableFor: [
          'Enterprises & Large Corporations',
          'Fintechs, Banks & NBFCs',
          'Automated e-Invoicing Systems',
          'HR & Payroll Departments'
        ],
        requiredDocuments: [
          'Company PAN & Incorporation Certificate',
          'Board Resolution authorizing applicant',
          'Authorized Signatory PAN & Aadhaar',
          'GST Registration Certificate'
        ],
        isPopular: false,
        isActive: true,
        hasEncryption: false,
        deliveryMethod: 'USB_TOKEN_FIPS'
      }
    ];

    await Product.insertMany(products);
    console.log(`[Seed] ${products.length} DSC products seeded successfully.`);

    // 4. Seed FAQs
    await FAQ.deleteMany({});
    const faqs = [
      {
        question: 'What is a Digital Signature Certificate (DSC)?',
        answer: 'A Digital Signature Certificate (DSC) is a secure digital equivalent of a handwritten signature, issued by government-approved Certifying Authorities (CAs) under the Information Technology Act, 2000. It establishes your identity electronically when filing official government forms and documents.',
        category: 'General',
        order: 1,
        isActive: true
      },
      {
        question: 'How is DSC different from a scanned signature?',
        answer: 'A scanned signature is merely an image of a handwritten signature that can easily be copied or forged without cryptographic validation. A DSC uses asymmetric 2048-bit cryptography to cryptographically seal the document, guaranteeing authenticity, non-repudiation, and detection of any tampering.',
        category: 'General',
        order: 2,
        isActive: true
      },
      {
        question: 'Which DSC should I choose?',
        answer: 'For individual Income Tax, GST, and MCA filings, a Class 3 Individual Signing DSC is recommended. If you participate in government tenders, GeM bidding, or defence contracts, you need a Class 3 Combo (Signing + Encryption) DSC. For foreign trade, choose a DGFT DSC.',
        category: 'Usage',
        order: 3,
        isActive: true
      },
      {
        question: 'What documents are required?',
        answer: 'For individuals: PAN card, Aadhaar card (for paperless eKYC OTP verification), a recent passport-sized photograph, and active mobile number. For organizations: In addition to applicant identity proof, GST certificate, Company PAN, and Board Resolution/Authorization letter are required.',
        category: 'Documentation',
        order: 4,
        isActive: true
      },
      {
        question: 'How long does it take to get a DSC?',
        answer: 'With our instant paperless Aadhaar eKYC and video verification process, your DSC application is typically approved and issued within 15 to 30 minutes! USB hardware tokens are dispatched the same business day via express courier.',
        category: 'Process',
        order: 5,
        isActive: true
      },
      {
        question: 'Is video verification mandatory?',
        answer: 'Yes, as per guidelines established by the Controller of Certifying Authorities (CCA), Government of India, a quick 30-second selfie video recording is mandatory to verify the applicant identity and prevent identity theft.',
        category: 'Verification',
        order: 6,
        isActive: true
      },
      {
        question: 'Will I get a physical token?',
        answer: 'Yes! When you select the USB crypto token option, we dispatch a certified FIPS 140-2 Level 2 USB hardware token (such as ePass2003 or mToken) directly to your shipping address with real-time tracking.',
        category: 'Delivery',
        order: 7,
        isActive: true
      },
      {
        question: 'Can I use DSC for GST, MCA and Income Tax?',
        answer: 'Yes! A single Class 3 Digital Signature Certificate can be registered and used across all Indian government portals including Income Tax e-Filing, GST, MCA V3, EPFO, and TRACES.',
        category: 'Usage',
        order: 8,
        isActive: true
      },
      {
        question: 'What is the validity of a DSC?',
        answer: 'Digital Signature Certificates can be issued with a validity period of 1 Year, 2 Years, or 3 Years as per your selection during checkout. You can choose the plan that best suits your compliance frequency.',
        category: 'Validity',
        order: 9,
        isActive: true
      },
      {
        question: 'How can I renew my DSC?',
        answer: 'You can easily renew your existing DSC online through SimplDSC before or after expiry by completing a quick renewal application with paperless Aadhaar verification. Existing USB tokens can also be updated directly.',
        category: 'Renewal',
        order: 10,
        isActive: true
      }
    ];

    await FAQ.insertMany(faqs);
    console.log(`[Seed] ${faqs.length} FAQs seeded successfully.`);

    // 5. Default Settings
    await Settings.deleteMany({});
    await Settings.create({
      key: 'BUSINESS_INFO',
      value: {
        brandName: 'SimplDSC',
        tagline: 'Digital Signatures, Made Simple.',
        companyLegalName: 'SIMPLDSC TECHNOLOGIES PVT LTD',
        gstin: '29AABCS1429B1Z8',
        supportEmail: 'support@simpldsc.in',
        supportPhone: '+91 98765 43210',
        address: 'Plot No. 123, 2nd Floor, Saheed Nagar, Bhubaneswar, Odisha - 751007, India',
        renewalReminderDays: [60, 30, 15, 7]
      },
      description: 'Core business and legal settings'
    });
    console.log('[Seed] Default settings seeded.');

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
