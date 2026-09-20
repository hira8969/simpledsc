import { Renewal } from '../models/Renewal.js';
import { Order } from '../models/Order.js';

export const getMyRenewals = async (req, res, next) => {
  try {
    const renewals = await Renewal.find({ userId: req.user._id })
      .populate('orderId')
      .populate('productId')
      .sort({ certificateExpiryDate: 1 });

    res.json({ success: true, count: renewals.length, data: renewals });
  } catch (error) {
    next(error);
  }
};

export const requestRenewal = async (req, res, next) => {
  try {
    const { renewalId, validityYears } = req.body;
    const renewal = await Renewal.findOne({ _id: renewalId, userId: req.user._id });
    if (!renewal) {
      return res.status(404).json({ success: false, message: 'Renewal record not found' });
    }

    // In demo / staging, mark status as renewal in progress
    renewal.renewalStatus = 'EXPIRING_SOON';
    await renewal.save();

    res.json({
      success: true,
      message: 'Renewal initiated successfully. Please proceed to verify your details.',
      data: renewal
    });
  } catch (error) {
    next(error);
  }
};
