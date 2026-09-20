import { Application } from '../models/Application.js';
import { Document } from '../models/Document.js';
import { Order } from '../models/Order.js';
import { getCAService } from '../integrations/ca/CAService.js';
import { NotificationService } from './notificationService.js';
import { KYC_STATUS, ORDER_STATUS, DSC_STATUS } from '../config/constants.js';

export class KycService {
  /**
   * Admin approves KYC documents for an application
   */
  static async verifyKyc({ applicationId, verifiedByUserId, notes = '' }) {
    const application = await Application.findById(applicationId).populate('productId userId');
    if (!application) {
      throw new Error('Application not found.');
    }

    application.kycStatus = KYC_STATUS.VERIFIED;
    application.adminNotes = notes;
    application.verifiedBy = verifiedByUserId;
    application.verifiedAt = new Date();

    // Submit to Certifying Authority Queue
    const caService = getCAService();
    const caResponse = await caService.createApplication({
      applicantName: application.personalDetails.fullName,
      pan: application.personalDetails.panNumber,
      category: application.productId.category
    });

    application.caApplicationId = caResponse.caApplicationNumber;
    await application.save();

    // Mark documents as verified
    await Document.updateMany({ applicationId: application._id }, { status: KYC_STATUS.VERIFIED });

    // Update associated Order
    const order = await Order.findOne({ applicationId: application._id });
    if (order) {
      order.kycStatus = KYC_STATUS.VERIFIED;
      order.applicationStatus = ORDER_STATUS.CA_PROCESSING;
      order.dscStatus = DSC_STATUS.IN_CA_QUEUE;
      order.caApplicationNumber = caResponse.caApplicationNumber;
      await order.save();

      // Dispatch WhatsApp & in-app notification
      await NotificationService.notify({
        userId: application.userId._id,
        orderId: order._id,
        event: 'KYC_APPROVED',
        title: 'KYC Documents Approved',
        message: `Your KYC documents for Order ${order.orderId} have been verified. Application submitted to CA queue.`,
        recipientMobile: application.personalDetails.mobile,
        variables: {
          name: application.personalDetails.fullName,
          orderId: order.orderId,
          product: application.productId.name,
          status: 'CA Processing'
        }
      });
    }

    return {
      success: true,
      application,
      caResponse
    };
  }

  /**
   * Admin rejects KYC with mandatory reason
   */
  static async rejectKyc({ applicationId, reason, verifiedByUserId }) {
    if (!reason || !reason.trim()) {
      throw new Error('A rejection reason is mandatory when rejecting KYC.');
    }

    const application = await Application.findById(applicationId).populate('productId userId');
    if (!application) {
      throw new Error('Application not found.');
    }

    application.kycStatus = KYC_STATUS.REJECTED;
    application.rejectionReason = reason;
    application.verifiedBy = verifiedByUserId;
    application.verifiedAt = new Date();
    await application.save();

    const order = await Order.findOne({ applicationId: application._id });
    if (order) {
      order.kycStatus = KYC_STATUS.REJECTED;
      order.applicationStatus = ORDER_STATUS.REJECTED;
      await order.save();

      await NotificationService.notify({
        userId: application.userId._id,
        orderId: order._id,
        event: 'KYC_REJECTED',
        title: 'KYC Verification Action Required',
        message: `Your KYC for Order ${order.orderId} was rejected. Reason: ${reason}. Please update documents.`,
        recipientMobile: application.personalDetails.mobile,
        variables: {
          name: application.personalDetails.fullName,
          orderId: order.orderId,
          product: application.productId.name,
          reason,
          status: 'KYC Rejected'
        }
      });
    }

    return { success: true, application };
  }

  /**
   * Admin requests document re-upload
   */
  static async requestReupload({ applicationId, reason, verifiedByUserId }) {
    const application = await Application.findById(applicationId).populate('productId userId');
    if (!application) {
      throw new Error('Application not found.');
    }

    application.kycStatus = KYC_STATUS.REUPLOAD_REQUIRED;
    application.rejectionReason = reason;
    await application.save();

    const order = await Order.findOne({ applicationId: application._id });
    if (order) {
      order.kycStatus = KYC_STATUS.REUPLOAD_REQUIRED;
      await order.save();

      await NotificationService.notify({
        userId: application.userId._id,
        orderId: order._id,
        event: 'KYC_REUPLOAD_REQUIRED',
        title: 'Document Re-upload Requested',
        message: `Please re-upload your document for Order ${order.orderId}: ${reason}.`,
        recipientMobile: application.personalDetails.mobile,
        variables: {
          name: application.personalDetails.fullName,
          orderId: order.orderId,
          product: application.productId.name,
          reason,
          status: 'Re-upload Required'
        }
      });
    }

    return { success: true, application };
  }
}
