import crypto from 'crypto';

/**
 * Payment Service Abstraction
 * Supports Razorpay and Sandbox Mock Gateway
 */
export class PaymentService {
  async createPaymentOrder({ orderId, amount, currency = 'INR', customerInfo }) {
    throw new Error('createPaymentOrder not implemented');
  }

  async verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    throw new Error('verifyPaymentSignature not implemented');
  }
}

export class MockPaymentService extends PaymentService {
  constructor() {
    super();
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_simpldsc_mock_key';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_simpldsc_mock_secret';
  }

  async createPaymentOrder({ orderId, amount, currency = 'INR', customerInfo }) {
    const gatewayOrderId = `order_mock_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
    return {
      success: true,
      provider: 'RAZORPAY_SANDBOX',
      keyId: this.keyId,
      gatewayOrderId,
      amount: Math.round(amount * 100), // in paise
      currency,
      notes: {
        systemOrderId: orderId,
        customerName: customerInfo?.name || '',
        customerMobile: customerInfo?.mobile || ''
      }
    };
  }

  async verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!razorpayOrderId || !razorpayPaymentId) {
      return { isValid: false, message: 'Missing payment identifiers' };
    }

    // In mock mode, if test signature starts with mock_ or matches expected HMAC, accept
    const generatedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isValid = (razorpaySignature === generatedSignature) ||
                    (razorpaySignature?.startsWith('mock_sig_')) ||
                    process.env.NODE_ENV === 'development';

    return {
      isValid,
      generatedSignature,
      gatewayPaymentId: razorpayPaymentId,
      gatewayOrderId: razorpayOrderId
    };
  }
}

export const getPaymentService = () => {
  return new MockPaymentService();
};
