import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  otpHash: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['LOGIN', 'REGISTER', 'VERIFICATION', 'RENEWAL'],
    default: 'LOGIN'
  },
  attempts: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index automatically cleans up expired OTP docs
  }
}, {
  timestamps: true
});

export const OTP = mongoose.model('OTP', otpSchema);
