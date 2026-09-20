const TWOFACTOR_API_BASE_URL = 'https://2factor.in/API/V1';

export class TwoFactorService {
  async sendOtp({ mobile, otp }) {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    if (!apiKey) {
      throw new Error('OTP provider is not configured.');
    }

    const response = await fetch(
      `${TWOFACTOR_API_BASE_URL}/${apiKey}/SMS/${mobile}/${otp}/OTP1`
    );
    const result = await response.json();

    if (!response.ok || result.Status !== 'Success') {
      throw new Error(result.Details || 'Unable to send OTP to the mobile number.');
    }

    return result;
  }
}

export const getOtpService = () => new TwoFactorService();