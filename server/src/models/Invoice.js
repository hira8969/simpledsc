import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hsnSacCode: { type: String, default: '998313' }, // SAC 998313 for Information Technology software & DSC certification services
  qty: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
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
  customerDetails: {
    name: String,
    mobile: String,
    email: String,
    address: String,
    panNumber: String,
    gstin: String
  },
  companyDetails: {
    name: { type: String, default: 'SIMPLDSC TECHNOLOGIES PVT LTD' },
    address: { type: String, default: 'Plot 42, Cyber Gateway Tech Zone, Whitefield, Bangalore, Karnataka - 560066' },
    gstin: { type: String, default: '29AABCS1429B1Z8' },
    pan: { type: String, default: 'AABCS1429B' },
    email: { type: String, default: 'billing@simpldsc.in' },
    supportPhone: { type: String, default: '+91 80 4719 2800' }
  },
  items: [invoiceItemSchema],
  subTotal: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'PAID'
  },
  transactionId: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Invoice = mongoose.model('Invoice', invoiceSchema);
