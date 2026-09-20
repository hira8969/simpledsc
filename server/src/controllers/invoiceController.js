import { Invoice } from '../models/Invoice.js';
import { Order } from '../models/Order.js';
import { USER_ROLES } from '../config/constants.js';

export const getInvoiceByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check
    if (order.userId.toString() !== req.user._id.toString() &&
        req.user.role !== USER_ROLES.ADMIN &&
        req.user.role !== USER_ROLES.STAFF) {
      return res.status(403).json({ success: false, message: 'Unauthorized invoice access' });
    }

    const invoice = await Invoice.findOne({ orderId: order._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not generated yet for this order.' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getMyInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .sort({ issuedAt: -1 })
      .populate('orderId', 'orderId totalAmount');

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    next(error);
  }
};
