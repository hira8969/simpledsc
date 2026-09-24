import mongoose from 'mongoose';
import { Application } from './Application.js';

const dscApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  panNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  aadhaarNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'VERIFICATION_PENDING', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED'
  },
  documents: [{
    docType: String,
    fileName: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export const DSCApplication = mongoose.models.DSCApplication || mongoose.model('DSCApplication', dscApplicationSchema);
export default DSCApplication;
