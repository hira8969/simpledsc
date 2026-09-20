import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { OTPInput } from '../../components/ui/OTPInput.jsx';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState('DETAILS');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const clean = formData.mobile.replace(/\D/g, '').slice(-10);
    if (!formData.name.trim()) {
      error('Please enter your full legal name.');
      return;
    }
    if (clean.length !== 10) {
      error('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(clean, 'REGISTER');
      success(res.message || 'OTP sent successfully!');
      if (res.demoOtp) {
        setDemoCode(res.demoOtp);
        setOtp(res.demoOtp);
      }
      setStep('OTP');
    } catch (err) {
      error(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      error('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const clean = formData.mobile.replace(/\D/g, '').slice(-10);
      const res = await verifyOtp(clean, otp, formData.name, formData.email, 'REGISTER');
      success(`Registration successful! Welcome to SimplDSC, ${res.user?.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/25">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
            Create Customer Account
          </h2>
          <p className="text-xs text-slate-500">
            {step === 'DETAILS'
              ? 'Join 25,000+ applicants using fast paperless digital signatures'
              : `Enter verification OTP sent to +91 ${formData.mobile}`}
          </p>
        </div>

        {step === 'DETAILS' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="As printed on your PAN card"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile Number (10 digits) *
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
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="For invoice and certificate delivery"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={!formData.name || formData.mobile.length < 10}
            >
              <span>Continue with Mobile OTP</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Sign in here
              </Link>
            </div>
          </form>
        ) : (
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
              <OTPInput length={6} value={otp} onChange={setOtp} disabled={loading} />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={otp.length !== 6}
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="text-slate-500 hover:text-slate-800"
              >
                Change details
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
      </div>
    </div>
  );
};
