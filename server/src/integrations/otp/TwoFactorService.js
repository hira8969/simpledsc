const TWOFACTOR_API_BASE_URL = 'https://2factor.in/API/V1';

export class TwoFactorService {
  async sendOtp({ mobile, otp }) {
    const rawApiKey = process.env.TWOFACTOR_API_KEY || '';
    const apiKey = rawApiKey.replace(/^TWOFACTOR_API_KEY=/, '').trim();
    if (!apiKey) {
      throw new Error('OTP provider is not configured.');
    }

    const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
    const url = `${TWOFACTOR_API_BASE_URL}/${apiKey}/SMS/${cleanMobile}/${otp}/OTP1`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok || result.Status !== 'Success') {
        console.warn(`[2Factor Warning] ${url} responded:`, result);
        throw new Error(result.Details || 'Unable to send OTP to the mobile number.');
      }

      return result;
    } catch (err) {
      console.error('[2Factor Error]', err.message);
      throw err;
    }
  }
}

export const getOtpService = () => new TwoFactorService();
