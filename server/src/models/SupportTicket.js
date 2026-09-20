import mongoose from 'mongoose';
import { SUPPORT_TICKET_STATUS } from '../config/constants.js';

const ticketMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['CUSTOMER', 'ADMIN', 'STAFF'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attachments: [{
    fileName: String,
    filePath: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
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
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['KYC_ISSUE', 'PAYMENT_ISSUE', 'TOKEN_DELIVERY', 'DSC_DOWNLOAD', 'RENEWAL', 'GENERAL'],
    default: 'GENERAL'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: Object.values(SUPPORT_TICKET_STATUS),
    default: SUPPORT_TICKET_STATUS.OPEN,
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [ticketMessageSchema]
}, {
  timestamps: true
});

export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
