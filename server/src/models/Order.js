import mongoose from 'mongoose';
import { ORDER_STATUS, KYC_STATUS, DSC_STATUS } from '../config/constants.js';

const orderSchema = new mongoose.Schema({
  orderId: {
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
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  validityYears: {
    type: Number,
    required: true,
    default: 2
  },
  hasUsbToken: {
    type: Boolean,
    default: true
  },
  baseAmount: {
    type: Number,
    required: true
  },
  usbTokenAmount: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    index: true
  },
  applicationStatus: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PAYMENT_PENDING,
    index: true
  },
  kycStatus: {
    type: String,
    enum: Object.values(KYC_STATUS),
    default: KYC_STATUS.PENDING,
    index: true
  },
  dscStatus: {
    type: String,
    enum: Object.values(DSC_STATUS),
    default: DSC_STATUS.NOT_STARTED,
    index: true
  },
  transactionId: {
    type: String,
    index: true,
    default: ''
  },
  caApplicationNumber: {
    type: String,
    default: ''
  },
  certificateExpiryDate: {
    type: Date
  },
  dispatchDetails: {
    courierName: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    dispatchedAt: { type: Date }
  },
  internalNotes: [{
    note: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
