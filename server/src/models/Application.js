import mongoose from 'mongoose';
import { KYC_STATUS } from '../config/constants.js';

const personalDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  dob: { type: String },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
  panNumber: { type: String, required: true, uppercase: true, trim: true },
  aadhaarLast4: { type: String, trim: true }
}, { _id: false });

const addressDetailsSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const organizationDetailsSchema = new mongoose.Schema({
  companyName: { type: String, trim: true },
  gstin: { type: String, uppercase: true, trim: true },
  cin: { type: String, uppercase: true, trim: true },
  designation: { type: String, trim: true },
  department: { type: String, trim: true }
}, { _id: false });

const certificateDetailsSchema = new mongoose.Schema({
  dscType: { type: String, required: true },
  purpose: { type: String, required: true },
  validityYears: { type: Number, required: true, enum: [1, 2, 3] },
  needEncryption: { type: Boolean, default: false },
  needUsbToken: { type: Boolean, default: true }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  applicantType: {
    type: String,
    enum: ['INDIVIDUAL', 'ORGANIZATION'],
    default: 'INDIVIDUAL'
  },
  personalDetails: {
    type: personalDetailsSchema,
    required: true
  },
  addressDetails: {
    type: addressDetailsSchema,
    required: true
  },
  organizationDetails: organizationDetailsSchema,
  certificateDetails: {
    type: certificateDetailsSchema,
    required: true
  },
  kycStatus: {
    type: String,
    enum: Object.values(KYC_STATUS),
    default: KYC_STATUS.PENDING,
    index: true
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },
  caApplicationId: {
    type: String,
    default: ''
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export const Application = mongoose.model('Application', applicationSchema);
