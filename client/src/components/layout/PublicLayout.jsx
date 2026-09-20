import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAuthPage && (
        <>
          <Footer />

          {/* Sticky Bottom CTA for Mobile users (hidden on desktop and auth pages) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between shadow-lg">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">Need a DSC in 15 mins?</span>
              <span className="text-[11px] text-emerald-600 font-semibold">100% Paperless & Fast</span>
            </div>
            <Link
              to="/products"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5"
            >
              <span>Get DSC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
