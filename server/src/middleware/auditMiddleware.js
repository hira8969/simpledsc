import { AuditLog } from '../models/AuditLog.js';

export const logAuditAction = async ({
  req,
  action,
  resource,
  resourceId = '',
  details = {}
}) => {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '';
    await AuditLog.create({
      userId: req?.user?._id,
      userRole: req?.user?.role || 'SYSTEM',
      action,
      resource,
      resourceId,
      ipAddress,
      details
    });
  } catch (error) {
    console.error('[AuditLog] Failed to record audit log:', error.message);
  }
};
