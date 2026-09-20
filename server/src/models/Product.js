import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../config/constants.js';

const validityPricingSchema = new mongoose.Schema({
  years: { type: Number, required: true }, // 1, 2, or 3
  price: { type: Number, required: true }, // in INR excluding GST
  discountPrice: { type: Number }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  category: {
    type: String,
    enum: Object.values(PRODUCT_CATEGORIES),
    required: true,
    index: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  validityOptions: [validityPricingSchema],
  basePrice: {
    type: Number,
    required: true
  },
  gstRate: {
    type: Number,
    default: 0.18
  },
  hasEncryption: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String
  }],
  useCases: [{
    type: String
  }],
  documentsRequired: [{
    type: String
  }],
  deliveryMethod: {
    type: String,
    enum: ['DOWNLOAD', 'USB_TOKEN_FIPS'],
    default: 'USB_TOKEN_FIPS'
  },
  popularTag: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
