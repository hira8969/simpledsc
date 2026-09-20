import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  const allFaqs = [
    {
      cat: 'General',
      q: 'What is a Digital Signature Certificate (DSC)?',
      a: 'A Digital Signature Certificate (DSC) is the electronic equivalent of a physical identity document like a passport or driving license. It establishes your identity electronically when accessing online government services, signing tax documents, or executing legal commercial contracts under the Indian IT Act 2000.'
    },
    {
      cat: 'General',
      q: 'What happened to Class 2 DSCs in India?',
      a: 'As per Controller of Certifying Authorities (CCA) guidelines effective January 1, 2021, Class 2 certificates have been discontinued across India. Class 3 DSC is now the mandatory universal standard for all individual, corporate, tax, and tender filings.'
    },
    {
      cat: 'Verification',
      q: 'How does Paperless Aadhaar eKYC verification work?',
      a: 'Paperless Aadhaar eKYC utilizes your Aadhaar-registered mobile number to verify your demographic identity via a one-time password (OTP). Once verified, you complete a simple 30-second video recording via your phone or laptop camera reciting an on-screen 3-digit code.'
    },
    {
      cat: 'Verification',
      q: 'Can foreigners or NRI applicants apply for an Indian DSC?',
      a: 'Yes, Non-Resident Indians (NRIs) and foreign nationals can obtain an Indian DSC. Foreign applicants must upload a notarized/apostilled copy of their passport, visa, and local address proof.'
    },
    {
      cat: 'Hardware Token',
      q: 'What is a FIPS crypto USB token and why is it mandatory?',
      a: 'The CCA mandates that digital certificates must reside on a FIPS 140-2 Level 2 validated hardware crypto token (e.g., ProxKey, Watchdata, ePPass). The private key cannot be extracted or copied, preventing cryptographic theft.'
    },
    {
      cat: 'Validity & Renewal',
      q: 'Can an expired DSC be renewed or do I need a new certificate?',
      a: 'Digital certificates cannot be extended once expired; a fresh certificate must be downloaded onto your token. However, you can reuse your existing compatible USB token if it is in working condition, saving you token hardware costs.'
    }
  ];

  const filteredFaqs = allFaqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Everything you need to know about digital signature certificates, eKYC, and CCA compliance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={search}
          onChange={(e) => setSearch}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
        />
      </div>

      {/* FAQs list */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                    {faq.cat}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-800">{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-900">Still have a question?</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Our support specialists are available Monday to Saturday (9 AM - 7 PM) to help you choose or configure your DSC.
        </p>
        <div className="pt-2">
          <Link to="/contact">
            <Button variant="primary" size="sm">Contact Support Team</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
