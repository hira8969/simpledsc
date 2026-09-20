import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/endpoints.js';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Search, Filter, Package, ArrowRight, Usb } from 'lucide-react';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (res?.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' && o.orderStatus !== 'COMPLETED') ||
      (filterStatus === 'COMPLETED' && o.orderStatus === 'COMPLETED');

    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.product?.name?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            My DSC Orders
          </h1>
          <p className="text-xs text-slate-500">
            View order history, track application verification, and download tax invoices
          </p>
        </div>

        <Link to="/dashboard/buy">
          <Button variant="primary" size="md">
            + New DSC Application
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'PENDING', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st === 'PENDING' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredOrders.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Certificate Product</th>
                  <th className="px-6 py-4">Application Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">KYC Review</th>
                  <th className="px-6 py-4">Processing Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 max-w-[220px] truncate">
                      {order.product?.name || 'Class 3 DSC'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.paymentStatus} size="xs" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.kycStatus} size="xs" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.orderStatus} size="xs" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/dashboard/orders/${order.orderId}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden p-4 space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3"
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
                    <span className="font-bold text-slate-900 text-xs">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex gap-1.5">
                    <StatusBadge status={order.paymentStatus} size="xs" />
                    <StatusBadge status={order.kycStatus} size="xs" />
                  </div>
                  <Link to={`/dashboard/orders/${order.orderId}`}>
                    <Button variant="primary" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No matching orders"
          description="We could not find any DSC orders matching your filter criteria."
          actionLabel="Apply for New DSC"
          onAction={() => window.location.assign('/dashboard/buy')}
        />
      )}
    </div>
  );
};
