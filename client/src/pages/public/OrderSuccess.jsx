import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Download, Home } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const product = location.state?.product;

  const orderId = order?.orderId || `SIMPL-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-[85vh] bg-[#FAF9FF] flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E2F0] shadow-card text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-200">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
            Payment Successful
          </span>
          <h1 className="text-3xl font-extrabold text-[#11112F] tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-sm text-[#70708A]">
            Thank you for choosing SimplDSC. Your digital signature certificate application has been initiated.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FAF9FF] rounded-2xl p-6 border border-[#E5E2F0] text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-[#70708A] font-semibold">Order ID</span>
            <span className="font-mono font-bold text-sm text-[#11112F]">{orderId}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-[#70708A] font-semibold">DSC Product</span>
            <span className="font-bold text-[#11112F]">{product?.name || 'Class 3 DSC'}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-[#70708A] font-semibold">Amount Paid</span>
            <span className="font-bold text-[#5B2EFF]">₹{(order?.amount || product?.price || 1999).toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#70708A] font-semibold">Current Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              Document Verification Pending
            </span>
          </div>
        </div>

        {/* Next Steps Guide */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-left text-xs space-y-1.5 text-slate-700">
          <p className="font-bold text-[#5B2EFF]">What happens next?</p>
          <p>1. Our compliance team verifies your Aadhaar eKYC and PAN details within 15–30 minutes.</p>
          <p>2. You will receive an SMS and Email with your tracking link and video verification instructions.</p>
          <p>3. Once approved by the CA, your USB token will be dispatched with same-day courier tracking.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/my-orders"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#5B2EFF] text-white font-bold text-xs hover:bg-[#4A22DE] transition-all shadow-md inline-flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3 rounded-full border border-[#E5E2F0] text-[#16162D] font-bold text-xs hover:bg-slate-50 transition-all inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
