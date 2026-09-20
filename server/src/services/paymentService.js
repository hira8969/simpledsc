import { Payment } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { Invoice } from '../models/Invoice.js';
import { Application } from '../models/Application.js';
import { Product } from '../models/Product.js';
import { getPaymentService } from '../integrations/payment/PaymentService.js';
import { NotificationService } from './notificationService.js';
import { generateTransactionId, generateInvoiceId } from '../utils/idGenerator.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../config/constants.js';

export class PaymentServiceImpl {
  /**
   * Initiate payment for an order
   */
  static async initiatePayment(orderId, userId) {
    const order = await Order.findOne({ orderId, userId }).populate('productId');
    if (!order) {
      throw new Error('Order not found or unauthorized.');
    }

    if (order.paymentStatus === 'SUCCESS') {
      throw new Error('This order has already been paid successfully.');
    }

    const application = await Application.findById(order.applicationId);
    const paymentGateway = getPaymentService();

    const gatewayOrder = await paymentGateway.createPaymentOrder({
      orderId: order.orderId,
      amount: order.totalAmount,
      currency: 'INR',
      customerInfo: {
        name: application?.personalDetails?.fullName,
        mobile: application?.personalDetails?.mobile
      }
    });

    return {
      orderId: order.orderId,
      amount: order.totalAmount,
      currency: 'INR',
      gateway: gatewayOrder
    };
  }

  /**
   * Verify signature and finalize payment
   */
  static async verifyAndProcessPayment({
    orderId,
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod = 'UPI'
  }) {
    const order = await Order.findOne({ orderId, userId }).populate('productId applicationId');
    if (!order) {
      throw new Error('Order not found.');
    }

    const gateway = getPaymentService();
    const verification = await gateway.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!verification.isValid) {
      throw new Error('Payment verification failed. Invalid gateway signature.');
    }

    const transactionId = generateTransactionId();

    // 1. Record Payment Document
    const payment = await Payment.create({
      transactionId,
      orderId: order._id,
      userId,
      gateway: 'RAZORPAY',
      gatewayOrderId: razorpayOrderId,
      gatewayPaymentId: razorpayPaymentId,
      gatewaySignature: razorpaySignature,
      amount: order.totalAmount,
      currency: 'INR',
      status: PAYMENT_STATUS.SUCCESS,
      paymentMethod,
      paidAt: new Date()
    });

    // 2. Update Order Status
    order.paymentStatus = 'SUCCESS';
    order.applicationStatus = ORDER_STATUS.KYC_PENDING;
    order.transactionId = transactionId;
    await order.save();

    // 3. Generate Tax Invoice
    const invoiceNumber = generateInvoiceId();
    const customer = order.applicationId?.personalDetails;
    const address = order.applicationId?.addressDetails;

    const cgst = Math.round(order.taxAmount / 2);
    const sgst = order.taxAmount - cgst;

    const invoice = await Invoice.create({
      invoiceNumber,
      orderId: order._id,
      userId,
      customerDetails: {
        name: customer?.fullName || 'Customer',
        mobile: customer?.mobile || '',
        email: customer?.email || '',
        address: `${address?.street || ''}, ${address?.city || ''}, ${address?.state || ''} - ${address?.pincode || ''}`,
        panNumber: customer?.panNumber || '',
        gstin: order.applicationId?.organizationDetails?.gstin || ''
      },
      items: [
        {
          description: `${order.productId.name} (${order.validityYears} Year Validity)`,
          hsnSacCode: '998313',
          qty: 1,
          unitPrice: order.baseAmount,
          total: order.baseAmount
        },
        ...(order.hasUsbToken ? [{
          description: 'FIPS 140-2 Level 2 Certified Cryptographic USB Token',
          hsnSacCode: '847170',
          qty: 1,
          unitPrice: order.usbTokenAmount,
          total: order.usbTokenAmount
        }] : [])
      ],
      subTotal: order.baseAmount + (order.usbTokenAmount || 0),
      cgst,
      sgst,
      igst: 0,
      totalAmount: order.totalAmount,
      paymentStatus: 'PAID',
      transactionId
    });

    // 4. Send WhatsApp & In-App notification
    await NotificationService.notify({
      userId,
      orderId: order._id,
      event: 'PAYMENT_SUCCESS',
      title: 'Payment Received Successfully',
      message: `Your payment of ₹${order.totalAmount} for Order ${order.orderId} was successful. Transaction ID: ${transactionId}.`,
      recipientMobile: customer?.mobile,
      variables: {
        name: customer?.fullName,
        orderId: order.orderId,
        product: order.productId.name,
        amount: order.totalAmount,
        status: 'Payment Received'
      }
    });

    return {
      success: true,
      orderId: order.orderId,
      transactionId,
      invoiceNumber: invoice.invoiceNumber,
      amount: order.totalAmount,
      paidAt: payment.paidAt
    };
  }
}
