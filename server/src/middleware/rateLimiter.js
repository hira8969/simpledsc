import rateLimit from 'express-rate-limit';

// Standard general API limiter: 120 requests per minute
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limiter for OTP requests: 10 requests per 10 minutes
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many OTP attempts. Please wait 10 minutes before requesting a new OTP.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
