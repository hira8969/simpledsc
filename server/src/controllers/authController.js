import { AuthService } from '../services/authService.js';

export const sendOtp = async (req, res, next) => {
  try {
    const { mobile, purpose } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const result = await AuthService.requestOtp(mobile, purpose);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { mobile, accessToken, name, email, purpose = 'LOGIN' } = req.body;
    if (!mobile || !accessToken) {
      return res.status(400).json({ success: false, message: 'Mobile and MSG91 access token are required' });
    }

    const result = await AuthService.verifyOtp(mobile, accessToken, { name, email }, purpose);

    // Set HTTP-only secure cookie for additional session protection
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Authentication successful',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await AuthService.adminLogin(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      success: true,
      message: 'Admin authentication successful',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
