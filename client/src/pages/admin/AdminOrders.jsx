import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Search,
  Filter,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && (res.data?.data || res.data?.orders)) {
        setOrders(res.data.data || res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      await axios.put(
        `${API_BASE}/admin/orders/${orderId}/status`,
        { status: newStatus, orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const s = search.toLowerCase();
    return (
      o.orderId?.toLowerCase().includes(s) ||
      o.customerDetails?.fullName?.toLowerCase().includes(s) ||
      o.customerDetails?.email?.toLowerCase().includes(s) ||
      o.product?.name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#11112F]">DSC Order Management</h1>
          <p className="text-xs text-[#70708A]">Review incoming applications, verify KYC, and update fulfillment</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E5E2F0] bg-white text-xs focus:outline-none focus:border-[#5B2EFF]"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E2F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#16162D]">
              <thead className="bg-[#FAF9FF] border-b border-[#E5E2F0] uppercase text-[11px] font-bold text-[#70708A]">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status & Action</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#5B2EFF]">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#11112F]">
                        {order.customerDetails?.fullName || order.user?.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-[#70708A]">
                        {order.customerDetails?.email || order.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[#70708A]">
                      {order.product?.name || 'Class 3 DSC'}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{(order.amount || order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {order.paymentStatus || 'PAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus || 'Pending'}
                        onChange={(e) => handleUpdateStatus(order.orderId || order._id, e.target.value)}
                        disabled={statusUpdating}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] font-bold text-xs text-[#11112F] focus:outline-none focus:border-[#5B2EFF]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verification">Verification</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg border border-[#E5E2F0] hover:bg-slate-100 text-[#5B2EFF]"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E5E2F0] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#5B2EFF]">
                  {selectedOrder.orderId}
                </span>
                <h3 className="text-base font-bold text-[#11112F]">Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-slate-100 space-y-2">
                <p className="font-bold text-sm text-[#11112F]">Customer Information</p>
                <p><span className="text-[#70708A]">Name:</span> {selectedOrder.customerDetails?.fullName}</p>
                <p><span className="text-[#70708A]">Email:</span> {selectedOrder.customerDetails?.email}</p>
                <p><span className="text-[#70708A]">Phone:</span> {selectedOrder.customerDetails?.phone}</p>
                {selectedOrder.customerDetails?.panNumber && (
                  <p><span className="text-[#70708A]">PAN:</span> {selectedOrder.customerDetails?.panNumber}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-slate-100 space-y-2">
                <p className="font-bold text-sm text-[#11112F]">Product & Fulfillment</p>
                <p><span className="text-[#70708A]">Product:</span> {selectedOrder.product?.name || 'Class 3 DSC'}</p>
                <p><span className="text-[#70708A]">Total Amount:</span> ₹{(selectedOrder.amount || selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</p>
                <p><span className="text-[#70708A]">Payment:</span> {selectedOrder.paymentStatus || 'PAID'}</p>
                <p><span className="text-[#70708A]">Order Status:</span> {selectedOrder.orderStatus}</p>
              </div>

              {selectedOrder.documents && selectedOrder.documents.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-slate-100 space-y-2">
                  <p className="font-bold text-sm text-[#11112F]">Uploaded Documents</p>
                  <ul className="space-y-1">
                    {selectedOrder.documents.map((d, i) => (
                      <li key={i} className="text-[#5B2EFF] font-semibold">
                        • {d.docType}: {d.fileName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-full bg-[#11112F] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
