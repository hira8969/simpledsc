import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { FAQ } from '../models/FAQ.js';
import { Contact } from '../models/Contact.js';
import { Application } from '../models/Application.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Settings } from '../models/Settings.js';
import { AuditLog } from '../models/AuditLog.js';
import { KycService } from '../services/kycService.js';
import { logAuditAction } from '../middleware/auditMiddleware.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      allOrders,
      recentOrders,
      totalProducts
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['Pending', 'Verification', 'Processing', 'PAYMENT_PENDING', 'KYC_PENDING', 'KYC_VERIFICATION'] } }),
      Order.countDocuments({ orderStatus: { $in: ['Completed', 'COMPLETED', 'ISSUED'] } }),
      Order.find().select('amount totalAmount paymentStatus'),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('product', 'name category price')
        .populate('user', 'name email mobile phone'),
      Product.countDocuments()
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.amount || o.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalProducts,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.$or = [{ orderStatus: status }, { applicationStatus: status }];
    }

    if (search) {
      query.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'customerDetails.fullName': new RegExp(search, 'i') },
        { 'customerDetails.email': new RegExp(search, 'i') }
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('product', 'name category price validity')
      .populate('user', 'name email mobile phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      data: orders,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.orderId;
    const { status, orderStatus, applicationStatus, dscStatus, trackingNumber, courierName } = req.body;

    const newStatus = status || orderStatus || applicationStatus;

    let query = { $or: [{ orderId: id }] };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: id });
    }

    const updateData = {};
    if (newStatus) {
      updateData.orderStatus = newStatus;
      updateData.applicationStatus = newStatus;
    }
    if (dscStatus) updateData.dscStatus = dscStatus;
    if (trackingNumber || courierName) {
      updateData.dispatchDetails = {
        trackingNumber: trackingNumber || '',
        courierName: courierName || 'DTDC Express',
        dispatchedAt: new Date()
      };
    }

    const order = await Order.findOneAndUpdate(query, updateData, { new: true })
      .populate('product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
      faqs
    });
  } catch (error) {
    next(error);
  }
};

export const getKycQueue = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name mobile email panNumber')
      .populate('productId', 'name category')
      .sort({ createdAt: 1 });

    return res.json({ success: true, count: applications.length, data: applications });
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
    return res.json({ success: true, message: 'KYC verified successfully', data: result });
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
    return res.json({ success: true, message: 'KYC rejected', data: result });
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
    return res.json({ success: true, message: 'Reupload requested', data: result });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find().sort({ updatedAt: -1 });
    return res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.find();
    return res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const setting = await Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    return res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};
