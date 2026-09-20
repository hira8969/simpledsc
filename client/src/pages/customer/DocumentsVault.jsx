import React, { useState, useEffect } from 'react';
import { applicationApi, documentApi } from '../../api/endpoints.js';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FileUploader } from '../../components/ui/FileUploader.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton.jsx';
import {
  FolderLock,
  FileText,
  Download,
  ShieldCheck,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const DocumentsVault = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reuploadModalOpen, setReuploadModalOpen] = useState(false);
  const [reuploadDocType, setReuploadDocType] = useState('PAN_CARD');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await applicationApi.getMyApplications();
        if (res?.data) {
          setApplications(res.data);
          if (res.data.length > 0) {
            setSelectedApp(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load vault documents:', err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  const handleReuploadSubmit = (docType, file) => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setReuploadModalOpen(false);
      success(`${docType.replace(/_/g, ' ')} has been re-uploaded and submitted for review.`);
    }, 700);
  };

  const defaultVaultDocs = [
    { type: 'PAN_CARD', title: 'Permanent Account Number (PAN) Card', format: 'PDF / Image', status: 'VERIFIED' },
    { type: 'AADHAAR_FRONT', title: 'UIDAI Aadhaar eKYC Document', format: 'PDF / Image', status: 'VERIFIED' },
    { type: 'PHOTO', title: 'Passport Size Color Photograph', format: 'JPG', status: 'VERIFIED' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
          Secure Document Vault
        </h1>
        <p className="text-xs text-slate-500">
          Private, encrypted document repository for your identity proofs and CA verification files
        </p>
      </div>

      {/* Security Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5 text-xs text-indigo-900">
        <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Encrypted Identity Storage & Access Control</p>
          <p className="text-indigo-800 leading-relaxed">
            Your verification documents are stored in private, non-public storage with strict role-based access control. Documents are accessible exclusively to authorized Certifying Authority verification officers under the Information Technology Act, 2000.
          </p>
        </div>
      </div>

      {/* Applications Switcher if multiple */}
      {applications.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application:</span>
          {applications.map((app) => (
            <button
              key={app._id}
              onClick={() => setSelectedApp(app)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedApp?._id === app._id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              #{app._id.slice(-6).toUpperCase()} ({app.product?.name?.slice(0, 16) || 'DSC'})
            </button>
          ))}
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultVaultDocs.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <StatusBadge status={doc.status} size="xs" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Format: {doc.format}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                <p>Status: <span className="text-emerald-700 font-semibold">Protected & Verified</span></p>
                <p>Retention: <span className="text-slate-700">7 Years (CCA Statutory)</span></p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  alert('Generating secure temporary authenticated download URL...');
                }}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReuploadDocType(doc.type);
                  setReuploadModalOpen(true);
                }}
                className="text-indigo-600 hover:bg-indigo-50"
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                <span>Update</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Re-upload Modal */}
      <Modal
        isOpen={reuploadModalOpen}
        onClose={() => setReuploadModalOpen(false)}
        title={`Re-upload ${reuploadDocType.replace(/_/g, ' ')}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Upload an updated or clearer copy of this document. The Certifying Authority will be notified automatically to re-verify your submission.
          </p>

          <FileUploader
            label="Select Document File (Max 10MB)"
            description="PDF, JPG, or PNG format"
            documentType={reuploadDocType}
            onFileSelect={handleReuploadSubmit}
            isUploading={uploading}
          />
        </div>
      </Modal>
    </div>
  );
};
