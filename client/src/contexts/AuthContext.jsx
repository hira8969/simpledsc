import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { authApi } from '../api/endpoints.js';
import { retryMSG91Otp, sendMSG91Otp, verifyMSG91Otp } from '../api/msg91Widget.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data?.user || res.data?.data;
      if (userData) {
        setUser(userData);
        localStorage.setItem('simpldsc_user', JSON.stringify(userData));
      }
    } catch (err) {
      console.warn('[Auth] Session sync failed:', err.message);
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

  // Standard Email & Password Login
  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    if (res.data?.success) {
      const authToken = res.data.token || res.data.data?.token;
      const authUser = res.data.user || res.data.data?.user;
      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('simpldsc_token', authToken);
      localStorage.setItem('simpldsc_user', JSON.stringify(authUser));
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  // Standard Registration
  const register = async ({ name, email, phone, mobile, password }) => {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name,
      email,
      phone: phone || mobile,
      password
    });
    if (res.data?.success) {
      const authToken = res.data.data?.token || res.data.token;
      const authUser = res.data.data?.user || res.data.user;
      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('simpldsc_token', authToken);
      localStorage.setItem('simpldsc_user', JSON.stringify(authUser));
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  // Admin login
  const adminLogin = async (email, password) => {
    return login(email, password);
  };

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

  // Logout
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`);
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
  const normalizedRole = (user?.role || '').toLowerCase();
  const isAdmin = normalizedRole === 'admin';
  const isStaff = normalizedRole === 'admin' || normalizedRole === 'staff';
  const isCustomer = !isAdmin;

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
        login,
        register,
        adminLogin,
        sendOtp,
        resendOtp,
        verifyOtp,
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
