import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Logo } from '../../components/ui/Logo.jsx';
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Phone,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOtp, verifyOtp } = useAuth();

  const [authMode, setAuthMode] = useState('EMAIL'); // 'EMAIL' or 'OTP'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const from = location.state?.from?.pathname;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await login(email, password);
      const targetUser = res.user || res.data?.user;
      if (targetUser?.role?.toLowerCase() === 'admin') {
        navigate(from || '/admin');
      } else {
        navigate(from || '/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const clean = mobile.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await sendOtp(clean, 'LOGIN');
      setOtpSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMsg('Please enter the OTP received.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const clean = mobile.replace(/\D/g, '').slice(-10);
      const res = await verifyOtp(clean, otp);
      const targetUser = res.user;
      if (targetUser?.role?.toLowerCase() === 'admin') {
        navigate(from || '/admin');
      } else {
        navigate(from || '/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const fillCustomerDemo = () => {
    setEmail('rahul.sharma@example.com');
    setPassword('Password@123');
    setErrorMsg(null);
  };

  const fillAdminDemo = () => {
    setEmail('admin@simpldsc.in');
    setPassword('AdminPassword@123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF9FF] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E5E2F0] shadow-card space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <Logo size="md" showTagline={false} />
          </Link>
          <h2 className="text-2xl font-black text-[#11112F] tracking-tight">
            Sign In to SimplDSC
          </h2>
          <p className="text-xs text-[#70708A]">
            Access your applications, orders, and certificates
          </p>
        </div>

        {/* Tab Toggle: Email vs Mobile OTP */}
        <div className="flex rounded-full bg-[#FAF9FF] p-1 border border-[#E5E2F0]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('EMAIL');
              setErrorMsg(null);
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-full transition-all ${
              authMode === 'EMAIL'
                ? 'bg-[#5B2EFF] text-white shadow-sm'
                : 'text-[#70708A] hover:text-[#16162D]'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('OTP');
              setErrorMsg(null);
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-full transition-all ${
              authMode === 'OTP'
                ? 'bg-[#5B2EFF] text-white shadow-sm'
                : 'text-[#70708A] hover:text-[#16162D]'
            }`}
          >
            Mobile OTP
          </button>
        </div>

        {/* Quick-fill credentials helper for evaluation */}
        {authMode === 'EMAIL' && (
          <div className="p-3 rounded-2xl bg-[#F3EFFF]/60 border border-purple-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#5B2EFF] font-semibold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Demo Quick-Fill:</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillCustomerDemo}
                className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-[#5B2EFF] hover:bg-[#5B2EFF] hover:text-white font-bold text-[11px] transition-colors"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="px-2.5 py-1 rounded-lg bg-[#11112F] text-white hover:bg-slate-800 font-bold text-[11px] transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        {authMode === 'EMAIL' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16162D] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#70708A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16162D] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#70708A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#5B2EFF] text-white font-bold text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Mobile OTP Flow */
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16162D] mb-1">
                10-Digit Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#70708A]">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  disabled={otpSent}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm font-semibold text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-bold text-[#16162D] mb-1">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-center font-bold tracking-widest text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#5B2EFF] text-white font-bold text-sm hover:bg-[#4A22DE] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : otpSent ? (
                <>
                  <span>Verify OTP & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="pt-4 border-t border-[#E5E2F0] flex flex-col gap-2 text-center text-xs">
          <p className="text-[#70708A]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#5B2EFF] font-bold hover:underline">
              Create one now
            </Link>
          </p>
          <Link to="/admin/login" className="text-slate-400 hover:text-[#5B2EFF] inline-flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Dedicated Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
