import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/cryptoUtils.js';
import { USER_ROLES } from '../config/constants.js';
import { getOtpService } from '../integrations/otp/TwoFactorService.js';

export class AuthService {
  /**
   * Request OTP for mobile authentication
   */
  static async requestOtp(mobile, purpose = 'LOGIN') {
    if (!['LOGIN', 'REGISTER', 'VERIFICATION', 'RENEWAL'].includes(purpose)) {
      throw new Error('Invalid OTP purpose.');
    }

    // Validate Indian 10-digit mobile number
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    const otpCode = generateOtp();
    const otpHash = await hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Delete any existing unverified OTPs for this mobile
    await OTP.deleteMany({ mobile: cleanMobile, purpose });

    await OTP.create({
      mobile: cleanMobile,
      otpHash,
      purpose,
      expiresAt
    });

    if (process.env.OTP_PROVIDER === '2FACTOR') {
      await getOtpService().sendOtp({ mobile: cleanMobile, otp: otpCode });
    } else {
      console.log(`\n[SIMPLDSC OTP SERVICE] Mobile: +91-${cleanMobile} | OTP: ${otpCode}\n`);
    }

    return {
      success: true,
      message: `OTP sent successfully to +91-${cleanMobile}`,
      mobile: cleanMobile,
      demoOtp: process.env.OTP_PROVIDER === 'MOCK' && process.env.NODE_ENV !== 'production' ? otpCode : undefined
    };
  }

  /**
   * Verify OTP and log in / register customer
   */
  static async verifyOtp(mobile, otpCode, additionalData = {}, purpose = 'LOGIN') {
    if (!['LOGIN', 'REGISTER', 'VERIFICATION', 'RENEWAL'].includes(purpose)) {
      throw new Error('Invalid OTP purpose.');
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const otpRecord = await OTP.findOne({
      mobile: cleanMobile,
      purpose,
      isVerified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      throw new Error('OTP has expired or is invalid. Please request a new OTP.');
    }

    if (otpRecord.attempts >= 5) {
      throw new Error('Too many invalid attempts. Please request a new OTP.');
    }

    const isMatch = await verifyOtpHash(otpCode, otpRecord.otpHash);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new Error('Invalid OTP. Please check the 6-digit code entered.');
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

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
