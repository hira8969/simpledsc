import React from 'react';

export const Terms = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 leading-relaxed text-sm">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Terms and Conditions of Service
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Effective Date: January 1, 2026 | Last Updated: September 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Regulatory Framework</h2>
        <p>
          SimplDSC Technologies Private Limited ("SimplDSC") operates as an authorized registration authority partner facilitating Digital Signature Certificate (DSC) applications under the provisions of the Information Technology Act, 2000 and guidelines prescribed by the Controller of Certifying Authorities (CCA), Ministry of Electronics & IT, Government of India.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Applicant Representations & KYC Obligations</h2>
        <p>
          The applicant confirms that all personal, contact, and identity proofs submitted (including PAN, Aadhaar eKYC, and organization board resolutions) are authentic, true, and unmanipulated. Any submission of forged documents or misrepresentation of identity is a criminal offense punishable under Section 66D, 71, and 72 of the Indian Information Technology Act, 2000 and the Indian Penal Code.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Certificate Issuance & Hardware Security</h2>
        <p>
          Actual cryptographic digital certificates are issued exclusively by licensed Certifying Authorities (CAs). SimplDSC supplies compliant FIPS 140-2 Level 2 validated hardware crypto tokens. The applicant is solely responsible for maintaining the confidentiality of their token PIN and physical security of the device.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">4. Limitation of Liability</h2>
        <p>
          SimplDSC shall not be held liable for any delay or failure in DSC issuance resulting from incorrect applicant data, failure during applicant video verification, CCA portal downtime, or courier transit disruptions.
        </p>
      </section>
    </div>
  );
};
