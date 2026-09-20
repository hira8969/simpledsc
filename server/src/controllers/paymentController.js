import { PaymentServiceImpl } from '../services/paymentService.js';
import { Order } from '../models/Order.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const paymentDetails = await PaymentServiceImpl.initiatePayment(orderId, req.user._id);
    res.json({ success: true, data: paymentDetails });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod
    } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, gateway order ID, and payment ID are required.'
      });
    }

    const result = await PaymentServiceImpl.verifyAndProcessPayment({
      orderId,
      userId: req.user._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod
    });

    res.json({
      success: true,
      message: 'Payment verified and processed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook handler for asynchronous payment gateway events
 */
export const handleWebhook = async (req, res, next) => {
  try {
    // In production, verify Razorpay-Signature header against process.env.RAZORPAY_WEBHOOK_SECRET
    const event = req.body.event;
    console.log(`[Payment Webhook] Event received: ${event}`);

    // Acknowledge webhook immediately to payment provider
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[Payment Webhook Error]:', error.message);
    res.status(500).json({ status: 'error' });
  }
};
