import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Use Cases', path: '/use-cases' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Resources', path: '/resources' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E2F0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" showTagline={false} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[15px] font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#5B2EFF] font-semibold'
                    : 'text-[#16162D] hover:text-[#5B2EFF]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Button & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E2F0] bg-[#FAF9FF] hover:bg-[#F3EFFF] text-[#16162D] text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-[#70708A]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E5E2F0] py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-[#E5E2F0]">
                      <p className="text-xs font-semibold text-[#16162D] truncate">{user?.name}</p>
                      <p className="text-[11px] text-[#70708A] truncate">{user?.email || user?.phone}</p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#16162D] hover:bg-[#F3EFFF] hover:text-[#5B2EFF]"
                      >
                        <Shield className="w-4 h-4 text-[#5B2EFF]" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#16162D] hover:bg-[#F3EFFF] hover:text-[#5B2EFF]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#5B2EFF]" />
                        User Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-[#70708A] hover:text-[#5B2EFF] px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/dsc-finder"
              className="px-6 py-2.5 rounded-full bg-[#5B2EFF] text-white font-medium text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              Get DSC
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#16162D] hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E2F0] bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#F3EFFF] text-[#5B2EFF] font-semibold'
                  : 'text-[#16162D] hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-[#E5E2F0] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-[#E5E2F0] font-medium text-sm text-[#16162D]"
                >
                  {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-full text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-[#E5E2F0] font-medium text-sm text-[#16162D]"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/dsc-finder"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-[#5B2EFF] text-white font-medium text-sm hover:bg-[#4A22DE]"
            >
              Get DSC
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
