import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { OTPInput } from '../../components/ui/OTPInput.jsx';
import { ShieldCheck, Phone, ArrowRight, Sparkles, RefreshCw, KeyRound } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOtp, verifyOtp } = useAuth();
  const { success, error, info } = useToast();

  const [step, setStep] = useState('MOBILE'); // 'MOBILE' or 'OTP'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const clean = mobile.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      error('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(clean, 'LOGIN');
      success(res.message || 'OTP sent successfully!');
      if (res.demoOtp) {
        setDemoCode(res.demoOtp);
        setOtp(res.demoOtp); // Auto-fill for frictionless testing
      }
      setStep('OTP');
    } catch (err) {
      error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      error('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const clean = mobile.replace(/\D/g, '').slice(-10);
      const res = await verifyOtp(clean, otp);
      success(`Welcome back, ${res.user?.name || 'Customer'}!`);
      navigate(from, { replace: true });
    } catch (err) {
      error(err.message || 'Invalid or expired OTP. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setMobile('9898989898');
    info('Prefilled demo customer mobile: 9898989898');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/25">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
            Customer Portal Sign In
          </h2>
          <p className="text-xs text-slate-500">
            {step === 'MOBILE'
              ? 'Enter your mobile number to receive a secure 6-digit OTP'
              : `Enter the 6-digit verification code sent to +91 ${mobile}`}
          </p>
        </div>

        {/* Demo Fast Fill Button */}
        {step === 'MOBILE' && (
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Demo Customer (Rahul Sharma)</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition-colors"
            >
              Prefill
            </button>
          </div>
        )}

        {/* Step 1: Mobile Form */}
        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Indian Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={mobile.length < 10}
            >
              <span>Send OTP Verification Code</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              New to SimplDSC?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                Register an account
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
            {demoCode && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <span>Demo OTP Code: <strong>{demoCode}</strong></span>
                <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded font-bold">Dev Mode</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block text-center mb-1">
                Enter 6-Digit OTP
              </label>
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={otp.length !== 6}
            >
              <span>Verify & Access Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                className="text-slate-500 hover:text-slate-800"
              >
                Change mobile number
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            to="/admin/login"
            className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Authorized Staff & Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
