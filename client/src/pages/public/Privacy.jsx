import React from 'react';

export const Privacy = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 leading-relaxed text-sm">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Privacy Policy & Data Security
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Effective Date: January 1, 2026 | Compliant with Digital Personal Data Protection (DPDP) Act
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Data Collection & Purpose</h2>
        <p>
          To process your DSC in accordance with statutory guidelines, we collect personal identity information (Name, Mobile, Email, PAN, Aadhaar Demographic Data, and Photo) and Organization details where applicable. This information is utilized solely for certificate verification, statutory audit logging, and certificate lifecycle reminders.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Document Storage & Access Control</h2>
        <p>
          Uploaded documents (PAN cards, address proofs, video KYC recordings) are stored in secure, private, non-public storage with strict role-based access control. Documents are never exposed to search engines, indexing crawlers, or unauthorized third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Payment Information Security</h2>
        <p>
          SimplDSC does not store credit card numbers, debit card numbers, CVVs, or Net Banking credentials on our servers. All financial transactions are processed through RBI-authorized payment aggregators (such as Razorpay) utilizing 256-bit SSL encryption.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">4. Retention & Deletion</h2>
        <p>
          Under the CCA Intermediary Guidelines and the Information Technology Act 2000, Certifying Authorities and their partners are required to preserve verification audit records for a minimum statutory period of seven (7) years.
        </p>
      </section>
    </div>
  );
};
