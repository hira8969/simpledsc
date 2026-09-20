import { NotificationService } from '../services/notificationService.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user._id);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user._id);
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationService.markAllAsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
