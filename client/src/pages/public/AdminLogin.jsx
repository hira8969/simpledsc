import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const { success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      success(`Welcome Administrator, ${res.user?.name}!`);
      navigate('/admin');
    } catch (err) {
      error(err.message || 'Admin authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const prefillAdmin = () => {
    setEmail('admin@simpldsc.in');
    setPassword('AdminPassword@123');
    info('Prefilled Administrator Credentials (admin@simpldsc.in / AdminPassword@123)');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-900">
      <div className="w-full max-w-md bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 text-white">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight font-sans">
            SIMPL<span className="text-indigo-400">DSC</span> Admin Console
          </h2>
          <p className="text-xs text-slate-400">
            Authorized administrative & compliance personnel only
          </p>
        </div>

        {/* 1-Click Fast Fill */}
        <div className="p-3.5 rounded-2xl bg-slate-700/60 border border-slate-600 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Developer / Evaluator Mode</span>
          </div>
          <button
            type="button"
            onClick={prefillAdmin}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
          <div>
            <label className="text-xs font-bold block mb-1 text-slate-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@simpldsc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-600 bg-slate-900/80 text-xs focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-600 bg-slate-900/80 text-xs focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={loading}
          >
            <span>Sign In to Admin Console</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-[11px] text-center text-slate-500">
          All administrative sessions and actions are logged for security compliance.
        </p>
      </div>
    </div>
  );
};
