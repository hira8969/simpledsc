import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required. Please login.'
      });
    }

    const secret = process.env.JWT_SECRET || 'simpldsc_super_secure_jwt_secret_key_2026_dev_prod';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.userId).select('-__v');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session expired or user no longer exists.'
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Account has been suspended. Please contact support.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.'
    });
  }
};

export const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of [${roles.join(', ')}] privileges.`
      });
    }

    next();
  };
};

export const requireAdmin = requireRoles(USER_ROLES.ADMIN);
export const requireAdminOrStaff = requireRoles(USER_ROLES.ADMIN, USER_ROLES.STAFF);
