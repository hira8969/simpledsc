import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { orderApi, renewalApi } from '../../api/endpoints.js';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import {
  Package,
  Clock,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, renewalsRes] = await Promise.allSettled([
          orderApi.getMyOrders(),
          renewalApi.getMyRenewals()
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
          setOrders(ordersRes.value.data);
        }
        if (renewalsRes.status === 'fulfilled' && renewalsRes.value?.data) {
          setRenewals(renewalsRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load customer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED'
  ).length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'COMPLETED').length;
  const upcomingRenewals = renewals.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-elevated">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
            Welcome, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md">
            Manage your digital signature certificates, track KYC status, and download tax invoices.
          </p>
        </div>

        <Link to="/dashboard/buy">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-indigo-950 hover:bg-slate-100 shadow-md font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Apply for New DSC</span>
          </Button>
        </Link>
      </div>

      {/* Expiry Alerts if any */}
      {upcomingRenewals > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 text-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">DSC Renewal Due Soon</p>
              <p className="text-amber-700">You have {upcomingRenewals} certificate(s) expiring within the next 60 days.</p>
            </div>
          </div>
          <Link to="/dashboard/renewals">
            <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-900">
              Renew Now
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <LoadingSkeleton type="stats" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            subtitle="All time applications"
            icon={Package}
            color="indigo"
          />
          <StatCard
            title="Pending Actions"
            value={pendingOrders}
            subtitle="Under KYC or CA processing"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Issued / Completed"
            value={completedOrders}
            subtitle="Active digital certificates"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Renewals Due"
            value={upcomingRenewals}
            subtitle="Next 60 days"
            icon={RefreshCw}
            color="purple"
          />
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Applications & Orders</h2>
            <p className="text-xs text-slate-500">Track current status and download tax invoices</p>
          </div>
          <Link to="/dashboard/orders">
            <Button variant="ghost" size="sm">
              <span>View All</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={3} />
        ) : orders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-y border-slate-200 uppercase text-[11px] font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">KYC Status</th>
                    <th className="px-4 py-3">Order Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-600">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 max-w-[200px] truncate">
                        {order.product?.name || 'Class 3 DSC'}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.paymentStatus} size="xs" />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.kycStatus} size="xs" />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.orderStatus} size="xs" />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link to={`/dashboard/orders/${order.orderId}`}>
                          <Button variant="outline" size="sm">
                            Track
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Responsive table transformation) */}
            <div className="md:hidden space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {order.orderId}
                    </span>
                    <StatusBadge status={order.orderStatus} size="xs" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {order.product?.name || 'Class 3 DSC'}
                    </h4>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    <div className="flex gap-1.5">
                      <StatusBadge status={order.paymentStatus} size="xs" />
                      <StatusBadge status={order.kycStatus} size="xs" />
                    </div>
                    <Link to={`/dashboard/orders/${order.orderId}`}>
                      <Button variant="primary" size="sm">
                        Track
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No orders placed yet"
            description="You have not created any DSC applications yet. Click below to get your digital signature certificate."
            actionLabel="Apply for DSC"
            onAction={() => window.location.assign('/dashboard/buy')}
          />
        )}
      </div>
    </div>
  );
};
