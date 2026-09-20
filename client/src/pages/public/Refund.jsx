import React from 'react';

export const Refund = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 leading-relaxed text-sm">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Effective Date: January 1, 2026 | Last Updated: September 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Cancellation Before Verification</h2>
        <p>
          You may cancel your DSC order and request a 100% refund at any point before submitting your identity documents or initiating the video KYC verification process.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. CA Rejection & Full Refund Guarantee</h2>
        <p>
          If your application is rejected by the Certifying Authority due to eligibility or documentation mismatch and cannot be resolved through re-uploading documents, SimplDSC will issue a 100% full refund of the certificate fee back to your original payment method.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Non-Refundable Scenarios</h2>
        <p>
          Once a cryptographic Digital Signature Certificate has been successfully issued by the Certifying Authority and downloaded onto the USB hardware crypto token, the order cannot be cancelled, refunded, or transferred as the digital identity has already been registered in the CCA national directory.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">4. Processing Timeline</h2>
        <p>
          Approved refund requests are processed within 3 to 5 business days and credited to the original source account (UPI / Bank Account / Card) in accordance with standard RBI banking settlement cycles.
        </p>
      </section>
    </div>
  );
};
