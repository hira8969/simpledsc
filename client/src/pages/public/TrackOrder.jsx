import React, { useState } from 'react';
import { orderApi } from '../../api/endpoints.js';
import { Button } from '../../components/ui/Button.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Search, Package, ShieldCheck, CheckCircle2, Clock, AlertCircle, Usb } from 'lucide-react';

export const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await orderApi.trackOrder(orderId.trim());
      if (res?.data) {
        setOrder(res.data);
      } else {
        setError('Order not found. Please verify your Order ID.');
      }
    } catch (err) {
      setError(err.message || 'Unable to track order. Please check the ID.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'PAYMENT', label: 'Payment Completed', desc: 'Transaction confirmed' },
    { key: 'KYC', label: 'KYC & Identity Verification', desc: 'Documents and Aadhaar verified' },
    { key: 'CA_PROCESSING', label: 'Certifying Authority Approval', desc: 'Digital Certificate generated' },
    { key: 'ISSUED', label: 'Token Dispatched / Ready', desc: 'Downloaded onto FIPS crypto token' }
  ];

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Live Status Tracker
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Track Your DSC Application
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Enter your unique Order ID (e.g. DSC-20260918-10245) to view live verification status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card mb-8">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Package className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. DSC-20260918-10245"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" isLoading={loading}>
            <span>Track Application</span>
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Order ID</span>
              <h3 className="text-lg font-extrabold text-slate-900 font-mono">{order.orderId}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{order.product?.name || 'Class 3 DSC'}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-xs text-slate-400">Current Status</span>
              <StatusBadge status={order.orderStatus} size="md" />
            </div>
          </div>

          {/* Timeline steps */}
          <div className="space-y-6 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Processing Milestones
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {steps.map((st, i) => {
                // Determine completion
                const isPaid = order.paymentStatus === 'PAID';
                const isKycDone = order.kycStatus === 'VERIFIED';
                const isIssued = order.orderStatus === 'ISSUED' || order.orderStatus === 'COMPLETED';

                let isCompleted = false;
                if (i === 0 && isPaid) isCompleted = true;
                if (i === 1 && isKycDone) isCompleted = true;
                if (i === 2 && isIssued) isCompleted = true;
                if (i === 3 && order.orderStatus === 'COMPLETED') isCompleted = true;

                return (
                  <div
                    key={st.key}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs font-bold">{st.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{st.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details footer */}
          <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Date of Application:</span>
              <span className="font-semibold text-slate-800">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Amount:</span>
              <span className="font-semibold text-slate-800 font-sans">
                ₹{order.totalAmount} (Paid)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Dispatch Mode:</span>
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <Usb className="w-3.5 h-3.5" /> FIPS Crypto Token
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
