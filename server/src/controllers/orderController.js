import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      product,
      productId,
      quantity = 1,
      amount,
      customerDetails,
      documents = [],
      validityYears = 1,
      hasUsbToken = true,
      paymentStatus = 'PAID'
    } = req.body;

    const targetProductId = productId || product;
    let productDoc = null;
    if (targetProductId) {
      if (typeof targetProductId === 'string' && targetProductId.match(/^[0-9a-fA-F]{24}$/)) {
        productDoc = await Product.findById(targetProductId);
      }
      if (!productDoc && typeof targetProductId === 'string') {
        productDoc = await Product.findOne({ slug: targetProductId });
      }
    }

    if (!productDoc) {
      productDoc = await Product.findOne({ isActive: true });
    }

    const calculatedAmount = amount || (productDoc ? productDoc.price * Number(quantity) : 1999);
    const orderId = `SIMPL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderId,
      user: req.user._id,
      userId: req.user._id,
      product: productDoc?._id,
      productId: productDoc?._id,
      quantity: Number(quantity) || 1,
      amount: calculatedAmount,
      totalAmount: calculatedAmount,
      baseAmount: calculatedAmount,
      validityYears: Number(validityYears) || 1,
      hasUsbToken,
      customerDetails: {
        fullName: customerDetails?.fullName || customerDetails?.name || req.user.name,
        email: customerDetails?.email || req.user.email,
        phone: customerDetails?.phone || req.user.phone || req.user.mobile,
        panNumber: customerDetails?.panNumber || req.user.panNumber,
        organizationName: customerDetails?.organizationName,
        gstin: customerDetails?.gstin,
        address: customerDetails?.address
      },
      documents: documents.map(d => ({
        docType: d.docType || 'Identity Proof',
        fileName: d.fileName || d.name || 'document.pdf',
        fileUrl: d.fileUrl || d.url || '/uploads/sample.pdf',
        fileSize: d.fileSize || 1024
      })),
      paymentStatus: paymentStatus || 'PAID',
      orderStatus: 'Verification',
      applicationStatus: 'KYC_VERIFICATION'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone mobile')
      .populate('product', 'name slug category price validity image');

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder,
      order: populatedOrder
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders OR GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { userId: req.user._id }]
    })
      .populate('product', 'name slug category price validity image')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const { id, orderId } = req.params;
    const lookup = id || orderId;

    let query = {
      $or: [{ orderId: lookup }]
    };
    if (lookup.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: lookup });
    }

    const order = await Order.findOne(query)
      .populate('user', 'name email phone mobile')
      .populate('product', 'name slug category price validity image features');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      data: order,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order publicly
// @route   GET /api/orders/track/:orderId
// @access  Public
export const trackOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate('product', 'name category price validity image');

    if (!order) {
      return res.status(404).json({ success: false, message: `No order found with ID: ${orderId}` });
    }

    const milestones = [
      { title: 'Order Placed', status: 'COMPLETED', date: order.createdAt },
      { title: 'Payment Verification', status: order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' ? 'COMPLETED' : 'PENDING' },
      { title: 'Document & Video eKYC', status: order.orderStatus === 'Completed' || order.kycStatus === 'VERIFIED' ? 'COMPLETED' : 'IN_PROGRESS' },
      { title: 'Certifying Authority (CA) Approval', status: order.orderStatus === 'Completed' ? 'COMPLETED' : 'PENDING' },
      { title: 'DSC Issued & Token Dispatched', status: order.orderStatus === 'Completed' ? 'COMPLETED' : 'PENDING' }
    ];

    return res.status(200).json({
      success: true,
      data: { order, milestones }
    });
  } catch (error) {
    next(error);
  }
};
