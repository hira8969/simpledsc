import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Application } from '../models/Application.js';
import { Document } from '../models/Document.js';
import { Payment } from '../models/Payment.js';
import { Product } from '../models/Product.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { AuditLog } from '../models/AuditLog.js';
import { Renewal } from '../models/Renewal.js';
import { Settings } from '../models/Settings.js';
import { KycService } from '../services/kycService.js';
import { NotificationService } from '../services/notificationService.js';
import { logAuditAction } from '../middleware/auditMiddleware.js';
import { KYC_STATUS, ORDER_STATUS, DSC_STATUS } from '../config/constants.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      todayOrders,
      pendingKyc,
      pendingApplications,
      paymentsSummary,
      activeRenewalsDue,
      recentOrders,
      ordersByStatus,
      productsBreakdown
    ] = await Promise.all([
      User.countDocuments({ role: 'CUSTOMER' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Application.countDocuments({ kycStatus: { $in: [KYC_STATUS.PENDING, KYC_STATUS.UNDER_REVIEW] } }),
      Order.countDocuments({ applicationStatus: { $in: [ORDER_STATUS.PAYMENT_SUCCESS, ORDER_STATUS.KYC_VERIFICATION, ORDER_STATUS.PROCESSING] } }),
      Payment.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Renewal.countDocuments({ renewalStatus: { $in: ['ACTIVE', 'EXPIRING_SOON'] } }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('productId', 'name category')
        .populate('userId', 'name mobile email'),
      Order.aggregate([
        { $group: { _id: '$applicationStatus', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$productId', count: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $project: { name: '$product.name', count: 1, totalRevenue: 1 } }
      ])
    ]);

    const totalRevenue = paymentsSummary[0]?.totalRevenue || 0;
    const successfulPaymentsCount = paymentsSummary[0]?.count || 0;

    // Monthly revenue simulation data for charts
    const monthlyRevenue = [
      { month: 'Apr', revenue: Math.round(totalRevenue * 0.12), orders: 14 },
      { month: 'May', revenue: Math.round(totalRevenue * 0.15), orders: 19 },
      { month: 'Jun', revenue: Math.round(totalRevenue * 0.18), orders: 24 },
      { month: 'Jul', revenue: Math.round(totalRevenue * 0.22), orders: 31 },
      { month: 'Aug', revenue: Math.round(totalRevenue * 0.28), orders: 38 },
      { month: 'Sep', revenue: Math.round(totalRevenue * 0.35), orders: 46 }
    ];

    res.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          todayOrders,
          pendingKyc,
          pendingApplications,
          successfulPaymentsCount,
          totalRevenue,
          activeRenewalsDue
        },
        charts: {
          monthlyRevenue,
          ordersByStatus: ordersByStatus.map(s => ({ status: s._id, count: s.count })),
          productsBreakdown
        },
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, kycStatus, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.applicationStatus = status;
    if (kycStatus) query.kycStatus = kycStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.orderId = { $regex: search, $options: 'i' };
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('productId', 'name category basePrice')
      .populate('userId', 'name mobile email')
      .populate('applicationId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { applicationStatus, dscStatus, internalNote, courierName, trackingNumber } = req.body;

    const order = await Order.findOne({ orderId }).populate('userId productId');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.applicationStatus;

    if (applicationStatus) order.applicationStatus = applicationStatus;
    if (dscStatus) order.dscStatus = dscStatus;
    if (courierName || trackingNumber) {
      order.dispatchDetails = {
        courierName: courierName || order.dispatchDetails?.courierName,
        trackingNumber: trackingNumber || order.dispatchDetails?.trackingNumber,
        dispatchedAt: new Date()
      };
    }

    if (internalNote) {
      order.internalNotes.push({
        note: internalNote,
        author: req.user._id,
        createdAt: new Date()
      });
    }

    // When status changes to ISSUED or COMPLETED, calculate certificate expiry date (e.g. 2 years)
    if (applicationStatus === ORDER_STATUS.COMPLETED || applicationStatus === ORDER_STATUS.ISSUED) {
      if (!order.certificateExpiryDate) {
        order.certificateExpiryDate = new Date(Date.now() + (order.validityYears || 2) * 365 * 24 * 60 * 60 * 1000);
        // Create or update Renewal record
        await Renewal.findOneAndUpdate(
          { orderId: order._id },
          {
            userId: order.userId._id,
            productId: order.productId._id,
            certificateExpiryDate: order.certificateExpiryDate,
            renewalStatus: 'ACTIVE'
          },
          { upsert: true }
        );
      }
    }

    await order.save();

    await logAuditAction({
      req,
      action: 'UPDATE_ORDER_STATUS',
      resource: 'Order',
      resourceId: order.orderId,
      details: { previousStatus, newStatus: applicationStatus, dscStatus }
    });

    // Notify customer if status advanced to DSC_ISSUED or COMPLETED
    if (applicationStatus === ORDER_STATUS.ISSUED) {
      await NotificationService.notify({
        userId: order.userId._id,
        orderId: order._id,
        event: 'DSC_ISSUED',
        title: 'Your DSC is Issued',
        message: `Your DSC (${order.productId.name}) has been issued by the CA. Order ID: ${order.orderId}.`,
        recipientMobile: order.userId.mobile,
        variables: {
          name: order.userId.name,
          orderId: order.orderId,
          product: order.productId.name,
          status: 'DSC Issued'
        }
      });
    }

    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    next(error);
  }
};

export const getKycQueue = async (req, res, next) => {
  try {
    const applications = await Application.find({
      kycStatus: { $in: [KYC_STATUS.PENDING, KYC_STATUS.UNDER_REVIEW, KYC_STATUS.REUPLOAD_REQUIRED] }
    })
      .populate('userId', 'name mobile email panNumber')
      .populate('productId', 'name category documentsRequired')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

export const adminVerifyKyc = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    const result = await KycService.verifyKyc({
      applicationId,
      verifiedByUserId: req.user._id,
      notes
    });

    await logAuditAction({
      req,
      action: 'VERIFY_KYC',
      resource: 'Application',
      resourceId: applicationId,
      details: { notes }
    });

    res.json({ success: true, message: 'KYC verified and submitted to CA queue', data: result });
  } catch (error) {
    next(error);
  }
};

export const adminRejectKyc = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    const result = await KycService.rejectKyc({
      applicationId,
      reason,
      verifiedByUserId: req.user._id
    });

    await logAuditAction({
      req,
      action: 'REJECT_KYC',
      resource: 'Application',
      resourceId: applicationId,
      details: { reason }
    });

    res.json({ success: true, message: 'KYC rejected successfully', data: result });
  } catch (error) {
    next(error);
  }
};

export const adminRequestReupload = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    const result = await KycService.requestReupload({
      applicationId,
      reason,
      verifiedByUserId: req.user._id
    });

    await logAuditAction({
      req,
      action: 'REQUEST_REUPLOAD',
      resource: 'Application',
      resourceId: applicationId,
      details: { reason }
    });

    res.json({ success: true, message: 'Document re-upload requested from customer', data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, data: users });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .populate('userId', 'name email mobile')
      .populate('orderId', 'orderId totalAmount')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    await ticket.save();

    res.json({ success: true, message: 'Ticket updated successfully', data: ticket });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.find();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, description },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};
