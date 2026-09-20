import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export const FileUploader = ({
  label,
  description,
  documentType,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  onFileSelect,
  uploadedFile = null,
  isUploading = false,
  uploadProgress = 0,
  error = null
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`);
      return;
    }
    if (onFileSelect) {
      onFileSelect(documentType, file);
    }
  };

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
          <span>{label}</span>
          <span className="text-[11px] font-normal text-slate-400">Max {maxSizeMB}MB (PDF, JPG, PNG)</span>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer text-center ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50'
            : uploadedFile
            ? 'border-emerald-300 bg-emerald-50/30'
            : error
            ? 'border-rose-300 bg-rose-50/30'
            : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {uploadedFile.name || uploadedFile.originalName || 'Document Attached'}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Ready for verification</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (fileInputRef.current) fileInputRef.current.value = '';
                if (onFileSelect) onFileSelect(documentType, null);
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : isUploading ? (
          <div className="py-2 space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-700">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading document... {uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center justify-center gap-1.5 text-slate-500">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              <span className="text-indigo-600">Click to upload</span> or drag and drop
            </p>
            {description && <p className="text-[11px] text-slate-400">{description}</p>}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
