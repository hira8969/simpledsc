import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '../api/endpoints.js';
import { retryMSG91Otp, sendMSG91Otp, verifyMSG91Otp } from '../api/msg91Widget.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('simpldsc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('simpldsc_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const msg91RequestId = useRef(null);

  // Sync / Verify with backend on mount
  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await authApi.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('simpldsc_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn('[Auth] Session sync failed:', err.message);
      // If token expired, clear local storage
      setUser(null);
      setToken(null);
      localStorage.removeItem('simpldsc_token');
      localStorage.removeItem('simpldsc_user');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Request Mobile OTP
  const sendOtp = async (mobile, purpose = 'LOGIN') => {
    const validation = await authApi.sendOtp(mobile, purpose);
    const result = await sendMSG91Otp(validation.mobile);
    msg91RequestId.current = result.reqId;
    return validation;
  };

  const resendOtp = async (mobile, purpose = 'LOGIN') => {
    if (!msg91RequestId.current) throw new Error('OTP session expired. Please request a new OTP.');
    const validation = await authApi.sendOtp(mobile, purpose);
    const result = await retryMSG91Otp(msg91RequestId.current);
    msg91RequestId.current = result.reqId;
    return validation;
  };

  // Verify OTP for Customer login / registration
  const verifyOtp = async (mobile, otp, name, email, purpose = 'LOGIN') => {
    if (!msg91RequestId.current) throw new Error('OTP session expired. Please request a new OTP.');
    const { accessToken } = await verifyMSG91Otp(otp, msg91RequestId.current);
    const res = await authApi.verifyOtp(mobile, accessToken, name, email, purpose);
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('simpldsc_token', res.token);
      localStorage.setItem('simpldsc_user', JSON.stringify(res.user));
    }
    return res;
  };

  // Admin login with email and password
  const adminLogin = async (email, password) => {
    const res = await authApi.adminLogin(email, password);
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('simpldsc_token', res.token);
      localStorage.setItem('simpldsc_user', JSON.stringify(res.user));
    }
    return res;
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('[Auth] Logout API call error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('simpldsc_token');
      localStorage.removeItem('simpldsc_user');
    }
  };

  const isAuthenticated = !!token && !!user;
  const isCustomer = user?.role === 'CUSTOMER';
  const isAdmin = user?.role === 'ADMIN';
  const isStaff = user?.role === 'STAFF' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isCustomer,
        isAdmin,
        isStaff,
        sendOtp,
        resendOtp,
        verifyOtp,
        adminLogin,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
