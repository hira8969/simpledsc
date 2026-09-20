import mongoose from 'mongoose';
import { USER_ROLES, USER_STATUS } from '../config/constants.js';

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    sparse: true
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER,
    index: true
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.ACTIVE
  },
  panNumber: {
    type: String,
    uppercase: true,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    uppercase: true,
    trim: true
  },
  address: addressSchema,
  avatar: {
    type: String,
    default: ''
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
