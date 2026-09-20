import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../config/constants.js';

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gateway: {
    type: String,
    enum: ['RAZORPAY', 'MOCK'],
    default: 'MOCK'
  },
  gatewayOrderId: {
    type: String,
    default: ''
  },
  gatewayPaymentId: {
    type: String,
    default: ''
  },
  gatewaySignature: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'NETBANKING', 'CARD', 'WALLET', 'SIMULATED'],
    default: 'SIMULATED'
  },
  paidAt: {
    type: Date
  },
  gatewayResponseRaw: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const Payment = mongoose.model('Payment', paymentSchema);
