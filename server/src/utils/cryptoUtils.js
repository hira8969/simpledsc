import bcrypt from 'bcryptjs';

export const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const verifyOtpHash = async (otp, hash) => {
  return bcrypt.compare(otp, hash);
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
