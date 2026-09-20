import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api/endpoints.js';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { FileCheck2, AlertCircle, ArrowRight, User } from 'lucide-react';

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationApi.getMyApplications();
        if (res?.data) {
          setApplications(res.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            My DSC Applications
          </h1>
          <p className="text-xs text-slate-500">
            View submitted KYC documents, verification notes, and identity applications
          </p>
        </div>

        <Link to="/dashboard/buy">
          <Button variant="primary" size="md">
            + New Application
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Application #{app._id.slice(-6).toUpperCase()}
                  </span>
                  <StatusBadge status={app.status} size="xs" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {app.product?.name || 'Class 3 DSC'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Validity: {app.validityYears || 2} Year(s)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <p className="font-semibold text-slate-800">
                    {app.personalDetails?.name}
                  </p>
                  <p className="text-slate-500">
                    PAN: <span className="font-mono font-bold text-slate-700">{app.personalDetails?.panNumber}</span>
                  </p>
                  <p className="text-slate-500">
                    Phone: +91 {app.personalDetails?.mobile}
                  </p>
                  {app.organizationDetails?.companyName && (
                    <p className="text-indigo-600 font-medium">
                      Org: {app.organizationDetails.companyName}
                    </p>
                  )}
                </div>

                {app.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">CA Verification Note:</p>
                      <p>{app.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {new Date(app.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <Link
                  to="/dashboard/documents"
                  className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>View Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications submitted"
          description="You have not submitted any certificate applications yet."
          actionLabel="Apply for DSC"
          onAction={() => window.location.assign('/dashboard/buy')}
        />
      )}
    </div>
  );
};
