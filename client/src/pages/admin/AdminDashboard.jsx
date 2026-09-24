import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Users,
  Package,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
        setRecentOrders(res.data.data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Unable to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
        <p className="text-sm font-semibold text-[#70708A]">Loading admin dashboard metrics...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ClipboardList,
      color: 'bg-indigo-50 text-[#5B2EFF] border-purple-200'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: 'Completed Orders',
      value: stats?.completedOrders || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#11112F] tracking-tight">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#70708A]">
            Real-time management for SimplDSC users, orders, and certificates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-full bg-[#5B2EFF] text-white text-xs font-bold hover:bg-[#4A22DE] transition-colors shadow-sm"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-full border border-[#E5E2F0] bg-white text-xs font-bold text-[#16162D] hover:bg-slate-50 transition-colors shadow-sm"
          >
            All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards (Section 25) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#E5E2F0] shadow-card flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-[#70708A] font-semibold">{kpi.title}</p>
                <p className="text-xl font-black text-[#11112F] mt-0.5">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2F0] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#11112F]">Recent Applications & Orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#5B2EFF] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#16162D]">
              <thead className="bg-[#FAF9FF] border-y border-[#E5E2F0] text-[11px] font-bold text-[#70708A] uppercase">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#5B2EFF]">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {order.customerDetails?.fullName || order.user?.name || 'Customer'}
                    </td>
                    <td className="px-4 py-3.5 text-[#70708A]">
                      {order.product?.name || 'Class 3 DSC'}
                    </td>
                    <td className="px-4 py-3.5 font-bold">
                      ₹{(order.amount || order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {order.paymentStatus || 'PAID'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {order.orderStatus || 'Verification'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-bold text-[#5B2EFF] hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-[#70708A]">
            No recent orders. Once customers submit applications, they will appear here.
          </div>
        )}
      </div>
    </div>
  );
};
