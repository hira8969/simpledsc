const MSG91_VERIFY_URL = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';

const providerError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeMobile = (mobile) => {
  const digits = String(mobile || '').replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.slice(-10);
};

const extractVerifiedMobile = (payload) => [
  payload?.mobile,
  payload?.phone,
  payload?.identifier,
  payload?.data?.mobile,
  payload?.data?.phone,
  payload?.data?.identifier
].find(Boolean);

export const verifyMSG91AccessToken = async (accessToken, expectedMobile) => {
  const authKey = process.env.MSG91_AUTH_KEY?.trim();
  if (!authKey) throw providerError('MSG91 OTP provider is not configured.', 503);
  if (!accessToken || typeof accessToken !== 'string') throw providerError('MSG91 access token is required.', 400);

  let response;
  try {
    response = await fetch(MSG91_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authkey: authKey, 'access-token': accessToken })
    });
  } catch {
    throw providerError('MSG91 verification service is unavailable. Please try again.', 502);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw providerError('MSG91 returned an invalid verification response.', 502);
  }

  const providerSuccess = response.ok && (
    payload?.type === 'success' || payload?.status === 'success' || payload?.success === true
  );
  if (!providerSuccess) throw providerError('MSG91 access token verification failed.', 401);

  const verifiedMobile = extractVerifiedMobile(payload);
  if (!verifiedMobile || normalizeMobile(verifiedMobile) !== normalizeMobile(expectedMobile)) {
    throw providerError('The verified mobile number does not match the requested number.', 401);
  }

  return { mobile: normalizeMobile(verifiedMobile) };
};