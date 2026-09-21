const MSG91_SCRIPT_URL = 'https://verify.msg91.com/otp-provider.js';
const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID || '3669756d4246323334383333';

let widgetReadyPromise;

const getValue = (response, keys) => {
  for (const key of keys) {
    if (response?.[key]) return response[key];
    if (response?.data?.[key]) return response.data[key];
  }
  return null;
};

const loadWidget = () => {
  if (widgetReadyPromise) return widgetReadyPromise;

  widgetReadyPromise = new Promise((resolve, reject) => {
    const initialize = () => {
      if (typeof window.initSendOTP !== 'function') {
        reject(new Error('MSG91 OTP widget could not be initialized.'));
        return;
      }

      window.initSendOTP({
        widgetId,
        tokenAuth: '',
        identifier: '',
        exposeMethods: true,
        captchaRenderId: '',
        success: () => {},
        failure: () => {}
      });
      resolve();
    };

    if (window.initSendOTP) {
      initialize();
      return;
    }

    const script = document.createElement('script');
    script.src = MSG91_SCRIPT_URL;
    script.async = true;
    script.onload = initialize;
    script.onerror = () => reject(new Error('Unable to load MSG91 OTP service.'));
    document.head.appendChild(script);
  });

  return widgetReadyPromise;
};

const getMethod = (name) => {
  if (typeof window[name] !== 'function') throw new Error('MSG91 OTP service is not ready. Please try again.');
  return window[name];
};

export const sendMSG91Otp = async (mobile) => {
  await loadWidget();
  return new Promise((resolve, reject) => {
    getMethod('sendOtp')(
      `91${mobile}`,
      (response) => resolve({ reqId: getValue(response, ['reqId', 'requestId']) }),
      () => reject(new Error('Unable to send OTP. Please try again.'))
    );
  });
};

export const retryMSG91Otp = async (reqId, channel = null) => {
  await loadWidget();
  return new Promise((resolve, reject) => {
    getMethod('retryOtp')(
      channel,
      (response) => resolve({ reqId: getValue(response, ['reqId', 'requestId']) || reqId }),
      () => reject(new Error('Unable to resend OTP. Please try again.')),
      reqId
    );
  });
};

export const verifyMSG91Otp = async (otp, reqId) => {
  await loadWidget();
  return new Promise((resolve, reject) => {
    getMethod('verifyOtp')(
      otp,
      (response) => {
        const accessToken = getValue(response, ['accessToken', 'access_token', 'token', 'jwt']);
        if (!accessToken) {
          reject(new Error('MSG91 did not return a verification token.'));
          return;
        }
        resolve({ accessToken });
      },
      () => reject(new Error('Invalid or expired OTP. Please try again.')),
      reqId
    );
  });
};