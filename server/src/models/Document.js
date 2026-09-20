import mongoose from 'mongoose';
import { DOCUMENT_TYPES, KYC_STATUS } from '../config/constants.js';

const documentSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: Object.values(DOCUMENT_TYPES),
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(KYC_STATUS),
    default: KYC_STATUS.PENDING
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Document = mongoose.model('Document', documentSchema);
