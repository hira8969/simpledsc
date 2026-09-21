import { apiClient } from './client.js';

export const authApi = {
  sendOtp: (mobile, purpose = 'LOGIN') => apiClient.post('/auth/send-otp', { mobile, purpose }),
  verifyOtp: (mobile, accessToken, name, email, purpose = 'LOGIN') =>
    apiClient.post('/auth/verify-otp', { mobile, accessToken, name, email, purpose }),
  adminLogin: (email, password) => apiClient.post('/auth/admin-login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout')
};

export const productApi = {
  getProducts: () => apiClient.get('/products'),
  getProductBySlug: (slug) => apiClient.get(`/products/slug/${slug}`),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  getQuotation: (productId, validityYears) => apiClient.post('/products/quotation', { productId, validityYears })
};

export const dscFinderApi = {
  getRecommendations: (answers) => apiClient.post('/dsc-finder/recommend', answers)
};

export const applicationApi = {
  createApplication: (payload) => apiClient.post('/applications', payload),
  getMyApplications: () => apiClient.get('/applications/my'),
  getApplicationById: (id) => apiClient.get(`/applications/${id}`)
};

export const documentApi = {
  uploadDocument: (formData, onProgress) =>
    apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    }),
  getApplicationDocuments: (applicationId) => apiClient.get(`/documents/application/${applicationId}`),
  getDownloadUrl: (id) => `${apiClient.defaults.baseURL}/documents/${id}/download`
};

export const orderApi = {
  createOrder: (payload) => apiClient.post('/orders', payload),
  getMyOrders: () => apiClient.get('/orders/my'),
  getOrderById: (orderId) => apiClient.get(`/orders/${orderId}`),
  trackOrder: (orderId) => apiClient.get(`/orders/track/${orderId}`)
};

export const paymentApi = {
  initiatePayment: (orderId) => apiClient.post('/payments/initiate', { orderId }),
  verifyPayment: (payload) => apiClient.post('/payments/verify', payload)
};

export const invoiceApi = {
  getMyInvoices: () => apiClient.get('/invoices/my'),
  getInvoiceByOrderId: (orderId) => apiClient.get(`/invoices/order/${orderId}`)
};

export const renewalApi = {
  getMyRenewals: () => apiClient.get('/renewals/my'),
  requestRenewal: (applicationId, validityYears) => apiClient.post('/renewals/request', { applicationId, validityYears })
};

export const supportApi = {
  createTicket: (payload) => apiClient.post('/support/tickets', payload),
  getMyTickets: () => apiClient.get('/support/tickets/my'),
  replyTicket: (ticketId, message) => apiClient.post(`/support/tickets/${ticketId}/reply`, { message })
};

export const notificationApi = {
  getMyNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all')
};

export const adminApi = {
  getDashboardStats: () => apiClient.get('/admin/dashboard-stats'),
  getAllOrders: (params) => apiClient.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, payload) => apiClient.patch(`/admin/orders/${orderId}`, payload),
  getKycQueue: () => apiClient.get('/admin/kyc/queue'),
  verifyKyc: (applicationId, notes) => apiClient.post(`/admin/kyc/${applicationId}/verify`, { notes }),
  rejectKyc: (applicationId, reason) => apiClient.post(`/admin/kyc/${applicationId}/reject`, { reason }),
  requestReupload: (applicationId, missingDocs, reason) =>
    apiClient.post(`/admin/kyc/${applicationId}/request-reupload`, { missingDocs, reason }),
  getAllUsers: () => apiClient.get('/admin/users'),
  getAllTickets: () => apiClient.get('/admin/tickets'),
  updateTicketStatus: (id, payload) => apiClient.patch(`/admin/tickets/${id}`, payload),
  getAuditLogs: () => apiClient.get('/admin/audit-logs'),
  getSettings: () => apiClient.get('/admin/settings'),
  updateSetting: (payload) => apiClient.post('/admin/settings', payload)
};
