import { Notification } from '../models/Notification.js';
import { getWhatsAppService } from '../integrations/whatsapp/WhatsAppService.js';
import { NOTIFICATION_CHANNELS } from '../config/constants.js';

export class NotificationService {
  /**
   * Dispatch notification to user across channels (In-App + WhatsApp)
   */
  static async notify({
    userId,
    orderId = null,
    event,
    title,
    message,
    recipientMobile,
    variables = {}
  }) {
    try {
      // 1. Create In-App Notification in DB
      const inAppNotification = await Notification.create({
        userId,
        orderId,
        channel: NOTIFICATION_CHANNELS.IN_APP,
        event,
        title,
        message,
        metadata: variables
      });

      // 2. Trigger WhatsApp notification if mobile number is present
      if (recipientMobile) {
        const whatsapp = getWhatsAppService();
        await whatsapp.sendTemplateMessage({
          recipientPhone: recipientMobile,
          templateName: event,
          variables
        });
      }

      return inAppNotification;
    } catch (error) {
      console.error('[NotificationService] Failed to send notification:', error.message);
    }
  }

  static async getUserNotifications(userId, limit = 20) {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('orderId', 'orderId totalAmount applicationStatus');
  }

  static async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  static async markAllAsRead(userId) {
    return Notification.updateMany({ userId, isRead: false }, { isRead: true });
  }
}
