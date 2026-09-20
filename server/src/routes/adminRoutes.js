import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getKycQueue,
  adminVerifyKyc,
  adminRejectKyc,
  adminRequestReupload,
  getAllUsers,
  getAuditLogs,
  getAllTickets,
  updateTicketStatus,
  getSettings,
  updateSetting
} from '../controllers/adminController.js';
import { authenticate, requireAdminOrStaff, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdminOrStaff);

router.get('/dashboard-stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:orderId', updateOrderStatus);

// KYC verification workbench
router.get('/kyc/queue', getKycQueue);
router.post('/kyc/:applicationId/verify', adminVerifyKyc);
router.post('/kyc/:applicationId/reject', adminRejectKyc);
router.post('/kyc/:applicationId/request-reupload', adminRequestReupload);

// User & ticket management
router.get('/users', getAllUsers);
router.get('/tickets', getAllTickets);
router.patch('/tickets/:id', updateTicketStatus);

// Admin-only actions
router.get('/audit-logs', requireAdmin, getAuditLogs);
router.get('/settings', requireAdmin, getSettings);
router.post('/settings', requireAdmin, updateSetting);

export default router;
