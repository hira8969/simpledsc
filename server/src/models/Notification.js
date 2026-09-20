import mongoose from 'mongoose';
import { NOTIFICATION_CHANNELS } from '../config/constants.js';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  channel: {
    type: String,
    enum: Object.values(NOTIFICATION_CHANNELS),
    default: NOTIFICATION_CHANNELS.IN_APP
  },
  event: {
    type: String,
    enum: [
      'ORDER_CREATED',
      'PAYMENT_SUCCESS',
      'PAYMENT_FAILED',
      'KYC_PENDING',
      'KYC_UNDER_REVIEW',
      'KYC_APPROVED',
      'KYC_REJECTED',
      'KYC_REUPLOAD_REQUIRED',
      'APPLICATION_PROCESSING',
      'CA_PROCESSING',
      'DSC_ISSUED',
      'ORDER_COMPLETED',
      'RENEWAL_REMINDER',
      'SUPPORT_REPLY'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
