import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getAllContacts,
  getAllFAQs,
  getKycQueue,
  adminVerifyKyc,
  adminRejectKyc,
  adminRequestReupload,
  getAuditLogs,
  getAllTickets,
  updateTicketStatus,
  getSettings,
  updateSetting
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard Metrics
router.get('/dashboard-stats', getDashboardStats);
router.get('/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.patch('/orders/:orderId', updateOrderStatus);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id', updateOrderStatus);

// Users & Contacts & FAQs
router.get('/users', getAllUsers);
router.get('/contacts', getAllContacts);
router.get('/faqs', getAllFAQs);

// KYC
router.get('/kyc/queue', getKycQueue);
router.post('/kyc/:applicationId/verify', adminVerifyKyc);
router.post('/kyc/:applicationId/reject', adminRejectKyc);
router.post('/kyc/:applicationId/request-reupload', adminRequestReupload);

// System
router.get('/audit-logs', getAuditLogs);
router.get('/tickets', getAllTickets);
router.patch('/tickets/:id', updateTicketStatus);
router.get('/settings', getSettings);
router.post('/settings', updateSetting);

export default router;
