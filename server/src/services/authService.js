import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';
import { verifyMSG91AccessToken } from '../integrations/otp/msg91Service.js';

export class AuthService {
  /**
   * Request OTP for mobile authentication
   */
  static async requestOtp(mobile, purpose = 'LOGIN') {
    if (!['LOGIN', 'REGISTER', 'VERIFICATION', 'RENEWAL'].includes(purpose)) {
      throw new Error('Invalid OTP purpose.');
    }

    // Validate Indian 10-digit mobile number
    const cleanMobile = String(mobile || '').replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    return {
      success: true,
      message: 'Mobile number accepted. Continue with MSG91 OTP verification.',
      mobile: cleanMobile
    };
  }

  /**
   * Verify OTP and log in / register customer
   */
  static async verifyOtp(mobile, accessToken, additionalData = {}, purpose = 'LOGIN') {
    if (!['LOGIN', 'REGISTER', 'VERIFICATION', 'RENEWAL'].includes(purpose)) {
      throw new Error('Invalid OTP purpose.');
    }

    const cleanMobile = String(mobile || '').replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) throw new Error('Please enter a valid 10-digit Indian mobile number.');
    await verifyMSG91AccessToken(accessToken, cleanMobile);

    // Check if user already exists
    let user = await User.findOne({ mobile: cleanMobile });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        mobile: cleanMobile,
        name: additionalData.name || `User ${cleanMobile.slice(-4)}`,
        email: additionalData.email || '',
        role: USER_ROLES.CUSTOMER,
        lastLoginAt: new Date()
      });
    } else {
      user.lastLoginAt = new Date();
      if (additionalData.name && user.name.startsWith('User ')) {
        user.name = additionalData.name;
      }
      await user.save();
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'simpldsc_super_secure_jwt_secret_key_2026_dev_prod';
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        mobile: user.mobile
      },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        panNumber: user.panNumber
      }
    };
  }

  /**
   * Admin / Staff password login or secure setup login
   */
  static async adminLogin(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || (user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.STAFF)) {
      throw new Error('Invalid credentials or unauthorized role.');
    }

    // Default admin development password check
    const validDevPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@SimplDSC2026!';
    if (password !== validDevPassword) {
      throw new Error('Invalid administrator password.');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const secret = process.env.JWT_SECRET || 'simpldsc_super_secure_jwt_secret_key_2026_dev_prod';
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email
      },
      secret,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    };
  }
}
