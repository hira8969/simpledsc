import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  LayoutDashboard,
  ShoppingCart,
  FileCheck2,
  FolderLock,
  ReceiptText,
  RefreshCw,
  LifeBuoy,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Package,
  Bell
} from 'lucide-react';

export const CustomerLayout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Buy DSC', path: '/dashboard/buy', icon: ShoppingCart, highlight: true },
    { name: 'My Orders', path: '/dashboard/orders', icon: Package },
    { name: 'My Applications', path: '/dashboard/applications', icon: FileCheck2 },
    { name: 'Document Vault', path: '/dashboard/documents', icon: FolderLock },
    { name: 'Invoices', path: '/dashboard/invoices', icon: ReceiptText },
    { name: 'Renewals', path: '/dashboard/renewals', icon: RefreshCw },
    { name: 'Support', path: '/dashboard/support', icon: LifeBuoy },
    { name: 'Profile', path: '/dashboard/profile', icon: User }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col md:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">
              SIMPL<span className="text-indigo-600">DSC</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Customer'}</p>
              <p className="text-[11px] text-slate-500 truncate">+91 {user?.mobile}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.highlight && !active
                    ? 'bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100/70 border border-indigo-100/80 font-semibold'
                    : active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base">
              SIMPL<span className="text-indigo-600">DSC</span>
            </span>
          </Link>
        </div>

        <Link
          to="/dashboard/buy"
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-sm"
        >
          Buy DSC
        </Link>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-up">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-slate-900">SimplDSC Dashboard</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900">{user?.name}</p>
              <p className="text-[11px] text-slate-500">+91 {user?.mobile}</p>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Sticky Bottom Navigation for 1-Hand Thumb Access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            location.pathname === '/dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link
          to="/dashboard/buy"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/dashboard/buy') ? 'text-indigo-600 font-bold' : 'text-indigo-500'
          }`}
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span>Buy DSC</span>
        </Link>
        <Link
          to="/dashboard/orders"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/dashboard/orders') ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Orders</span>
        </Link>
        <Link
          to="/dashboard/support"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/dashboard/support') ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LifeBuoy className="w-5 h-5 mb-0.5" />
          <span>Support</span>
        </Link>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-2 text-[10px] font-medium text-slate-500"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
};
