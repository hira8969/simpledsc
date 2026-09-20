import { SupportTicket } from '../models/SupportTicket.js';
import { generateTicketId } from '../utils/idGenerator.js';
import { USER_ROLES } from '../config/constants.js';

export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, message, orderId } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }

    const ticketId = generateTicketId();

    const ticket = await SupportTicket.create({
      ticketId,
      userId: req.user._id,
      orderId: orderId || null,
      subject,
      category: category || 'GENERAL',
      priority: priority || 'MEDIUM',
      messages: [
        {
          senderId: req.user._id,
          senderRole: req.user.role,
          message
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id })
      .populate('orderId', 'orderId totalAmount')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    next(error);
  }
};

export const replyTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty.' });
    }

    const query = { _id: req.params.id };
    if (req.user.role === USER_ROLES.CUSTOMER) {
      query.userId = req.user._id;
    }

    const ticket = await SupportTicket.findOne(query);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found or unauthorized.' });
    }

    ticket.messages.push({
      senderId: req.user._id,
      senderRole: req.user.role,
      message
    });

    // If customer replies, set status back to IN_PROGRESS; if staff replies, set WAITING_FOR_CUSTOMER
    if (req.user.role === USER_ROLES.CUSTOMER) {
      ticket.status = 'IN_PROGRESS';
    } else {
      ticket.status = 'WAITING_FOR_CUSTOMER';
    }

    await ticket.save();

    res.json({ success: true, message: 'Reply added successfully', data: ticket });
  } catch (error) {
    next(error);
  }
};
