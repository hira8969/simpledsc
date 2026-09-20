import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi, invoiceApi } from '../../api/endpoints.js';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import {
  ArrowLeft,
  Download,
  FileCheck2,
  Clock,
  ShieldCheck,
  Usb,
  ReceiptText,
  AlertCircle,
  HelpCircle,
  Truck
} from 'lucide-react';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrderById(orderId);
        if (res?.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Order Not Found</h3>
        <p className="text-xs text-slate-500">The requested order does not exist or you lack authorization.</p>
        <Link to="/dashboard/orders">
          <Button variant="primary" size="sm">Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const milestones = [
    { title: 'Payment Confirmed', done: order.paymentStatus === 'PAID' },
    { title: 'KYC Documents Verified', done: order.kycStatus === 'VERIFIED' },
    { title: 'CA Cryptographic Processing', done: order.orderStatus === 'CA_PROCESSING' || order.orderStatus === 'ISSUED' || order.orderStatus === 'COMPLETED' },
    { title: 'Certificate Issued & Token Ready', done: order.orderStatus === 'ISSUED' || order.orderStatus === 'COMPLETED' },
    { title: 'Order Completed & Delivered', done: order.orderStatus === 'COMPLETED' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
                {order.orderId}
              </h1>
              <StatusBadge status={order.orderStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to={`/dashboard/invoices?orderId=${order.orderId}`}>
            <Button variant="outline" size="sm">
              <ReceiptText className="w-4 h-4 mr-1.5 text-indigo-600" />
              <span>Tax Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Stepper Milestone Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Verification & Issuance Progress
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative flex items-center gap-4">
              <div
                className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                  m.done
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                {m.done ? '✓' : idx + 1}
              </div>
              <div>
                <p className={`text-xs sm:text-sm font-bold ${m.done ? 'text-slate-900' : 'text-slate-400'}`}>
                  {m.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order & Applicant Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certificate Specs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Certificate & Hardware
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Product:</span>
              <span className="font-bold text-slate-800">{order.product?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Validity:</span>
              <span className="font-semibold text-slate-800">{order.validityYears || 2} Year(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Encryption:</span>
              <span className="font-semibold text-slate-800">
                {order.product?.hasEncryption ? 'Signing + Encryption' : 'Signing Only'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery Hardware:</span>
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <Usb className="w-3.5 h-3.5" /> FIPS 140-2 Level 2 Crypto Token
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Payment & Settlement
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Status:</span>
              <StatusBadge status={order.paymentStatus} size="xs" />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Ref:</span>
              <span className="font-mono font-bold text-slate-800">{order.transactionId || 'TXN-CONFIRMED'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Certificate Base:</span>
              <span className="font-semibold text-slate-800">₹{order.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">GST (18%):</span>
              <span className="font-semibold text-slate-800">₹{order.tax}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Amount:</span>
              <span className="text-indigo-600 font-sans">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
