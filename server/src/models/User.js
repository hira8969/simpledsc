import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'customer', 'CUSTOMER', 'admin', 'ADMIN', 'staff', 'STAFF'],
    default: 'user',
    index: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'ACTIVE'
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

// Pre-save to synchronize phone & mobile, and hash password
userSchema.pre('save', async function (next) {
  if (this.phone && !this.mobile) this.mobile = this.phone;
  if (this.mobile && !this.phone) this.phone = this.mobile;

  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
