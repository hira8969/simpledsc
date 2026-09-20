import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Application } from '../models/Application.js';
import { ProductService } from './productService.js';
import { NotificationService } from './notificationService.js';
import { generateOrderId } from '../utils/idGenerator.js';
import { ORDER_STATUS } from '../config/constants.js';

export class OrderService {
  /**
   * Create an order from an application
   */
  static async createOrder({ userId, applicationId, validityYears = 2, hasUsbToken = true }) {
    const application = await Application.findOne({ _id: applicationId, userId }).populate('productId');
    if (!application) {
      throw new Error('Application not found or unauthorized.');
    }

    const product = application.productId;
    const quotation = ProductService.calculateQuotation(product, validityYears, hasUsbToken);

    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      userId,
      productId: product._id,
      applicationId: application._id,
      validityYears,
      hasUsbToken,
      baseAmount: quotation.baseAmount,
      usbTokenAmount: quotation.tokenAmount,
      taxAmount: quotation.taxAmount,
      totalAmount: quotation.totalAmount,
      applicationStatus: ORDER_STATUS.PAYMENT_PENDING
    });

    // Notify customer about order creation
    await NotificationService.notify({
      userId,
      orderId: order._id,
      event: 'ORDER_CREATED',
      title: 'DSC Order Created',
      message: `Your DSC order ${orderId} has been created. Total payable: ₹${quotation.totalAmount}.`,
      recipientMobile: application.personalDetails.mobile,
      variables: {
        name: application.personalDetails.fullName,
        orderId,
        product: product.name,
        amount: quotation.totalAmount,
        status: 'Payment Pending'
      }
    });

    return order;
  }

  static async getUserOrders(userId) {
    return Order.find({ userId })
      .populate('productId')
      .populate('applicationId')
      .sort({ createdAt: -1 });
  }

  static async getOrderById(orderId, userId = null) {
    const query = { orderId };
    if (userId) {
      query.userId = userId;
    }
    const order = await Order.findOne(query)
      .populate('productId')
      .populate('applicationId')
      .populate('userId', 'name mobile email');

    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    return order;
  }
}
