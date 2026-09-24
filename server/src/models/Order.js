import mongoose from 'mongoose';
import { ORDER_STATUS, KYC_STATUS, DSC_STATUS } from '../config/constants.js';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  quantity: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number
  },
  baseAmount: {
    type: Number,
    default: 0
  },
  usbTokenAmount: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number
  },
  customerDetails: {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    organizationName: { type: String, trim: true },
    gstin: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  documents: [{
    docType: String,
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'PENDING' }
  }],
  validityYears: {
    type: Number,
    default: 1
  },
  hasUsbToken: {
    type: Boolean,
    default: true
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    index: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Verification', 'Processing', 'Completed', 'Cancelled', ...Object.values(ORDER_STATUS)],
    default: 'Pending',
    index: true
  },
  applicationStatus: {
    type: String,
    default: 'PAYMENT_PENDING'
  },
  kycStatus: {
    type: String,
    enum: Object.values(KYC_STATUS),
    default: KYC_STATUS.PENDING
  },
  dscStatus: {
    type: String,
    enum: Object.values(DSC_STATUS),
    default: DSC_STATUS.NOT_STARTED
  },
  transactionId: {
    type: String,
    default: ''
  },
  dispatchDetails: {
    courierName: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    dispatchedAt: { type: Date }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Sync aliases
orderSchema.pre('save', function (next) {
  if (this.user && !this.userId) this.userId = this.user;
  if (this.userId && !this.user) this.user = this.userId;
  if (this.product && !this.productId) this.productId = this.product;
  if (this.productId && !this.product) this.product = this.productId;
  if (this.amount && !this.totalAmount) this.totalAmount = this.amount;
  if (this.totalAmount && !this.amount) this.amount = this.totalAmount;
  if (this.orderStatus && !this.applicationStatus) this.applicationStatus = this.orderStatus;
  next();
});

export const Order = mongoose.model('Order', orderSchema);
