import React from 'react';

const STATUS_CONFIGS = {
  // Order & Application Statuses
  PAYMENT_PENDING: { label: 'Payment Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  PAYMENT_SUCCESS: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  KYC_PENDING: { label: 'KYC Pending', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  KYC_VERIFICATION: { label: 'KYC Under Review', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  KYC_VERIFIED: { label: 'KYC Approved', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  PROCESSING: { label: 'Processing', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  CA_PROCESSING: { label: 'CA Verification', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  ISSUED: { label: 'DSC Issued', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  COMPLETED: { label: 'Completed', bg: 'bg-green-50 text-green-700 border-green-200' },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-slate-100 text-slate-600 border-slate-200' },

  // KYC specific statuses
  PENDING: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  UNDER_REVIEW: { label: 'Under Review', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  VERIFIED: { label: 'Verified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REUPLOAD_REQUIRED: { label: 'Re-upload Needed', bg: 'bg-rose-50 text-rose-700 border-rose-200' },

  // Support Ticket Statuses
  OPEN: { label: 'Open', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  WAITING_FOR_CUSTOMER: { label: 'Waiting for You', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  RESOLVED: { label: 'Resolved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CLOSED: { label: 'Closed', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
};

export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const normalizedKey = (status || '').toUpperCase().trim();
  const config = STATUS_CONFIGS[normalizedKey] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${
        sizeClasses[size] || sizeClasses.sm
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
};
