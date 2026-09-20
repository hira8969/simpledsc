import { OrderService } from '../services/orderService.js';
import { Order } from '../models/Order.js';

export const createOrder = async (req, res, next) => {
  try {
    const { applicationId, validityYears, hasUsbToken } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, message: 'Application ID is required.' });
    }

    const order = await OrderService.createOrder({
      userId: req.user._id,
      applicationId,
      validityYears: validityYears || 2,
      hasUsbToken: hasUsbToken !== false
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.getUserOrders(req.user._id);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await OrderService.getOrderById(req.params.orderId, req.user._id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * Public status tracking by Order ID and Mobile
 */
export const trackOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate('productId', 'name category validityOptions')
      .select('orderId paymentStatus applicationStatus kycStatus dscStatus createdAt updatedAt validityYears hasUsbToken');

    if (!order) {
      return res.status(404).json({ success: false, message: `No order found with ID: ${orderId}` });
    }

    // Return timeline milestones
    const milestones = [
      {
        title: 'Order Placed',
        status: 'COMPLETED',
        date: order.createdAt
      },
      {
        title: 'Payment Verification',
        status: order.paymentStatus === 'SUCCESS' ? 'COMPLETED' : 'PENDING'
      },
      {
        title: 'KYC Document Verification',
        status: order.kycStatus === 'VERIFIED' ? 'COMPLETED' : order.kycStatus === 'UNDER_REVIEW' ? 'IN_PROGRESS' : 'PENDING'
      },
      {
        title: 'Certifying Authority (CA) Processing',
        status: order.applicationStatus === 'CA_PROCESSING' || order.dscStatus === 'ISSUED' ? 'COMPLETED' : 'PENDING'
      },
      {
        title: 'Certificate Issuance & Token Dispatch',
        status: order.applicationStatus === 'COMPLETED' ? 'COMPLETED' : 'PENDING'
      }
    ];

    res.json({
      success: true,
      data: {
        order,
        milestones
      }
    });
  } catch (error) {
    next(error);
  }
};
