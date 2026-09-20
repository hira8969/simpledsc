import mongoose from 'mongoose';

const renewalSchema = new mongoose.Schema({
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
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  certificateExpiryDate: {
    type: Date,
    required: true,
    index: true
  },
  reminderSent: [{
    daysBefore: Number, // 60, 30, 15, 7
    sentAt: Date,
    channel: String
  }],
  renewalStatus: {
    type: String,
    enum: ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'RENEWED'],
    default: 'ACTIVE',
    index: true
  },
  renewedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

export const Renewal = mongoose.model('Renewal', renewalSchema);
