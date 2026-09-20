import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { ShieldCheck, Award, Users, Lock, CheckCircle2, ArrowRight, Building } from 'lucide-react';

export const About = () => {
  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Our Story & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Pioneering Paperless Digital Trust Across India
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          At <strong>SimplDSC</strong>, our core mission is simple: eliminate physical queues, tedious notary verification, and confusing paperwork by making legal digital signature certificates accessible in minutes.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto sm:mx-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">100% Legal & Compliant</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            All DSCs are issued in strict compliance with the Information Technology Act, 2000 and guidelines set forth by the Controller of Certifying Authorities (CCA), Government of India.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Highest Security Standards</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            We supply only certified FIPS 140-2 Level 2 cryptographic hardware tokens with 2048-bit RSA key pairs, ensuring your cryptographic keys can never be duplicated or exported.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto sm:mx-0">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Customer-First Philosophy</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            From sole proprietors filing their first GST return to Fortune 500 enterprises signing thousands of invoices, we provide dedicated CA support across all Indian languages.
          </p>
        </div>
      </div>

      {/* Corporate Info */}
      <div className="bg-[#0A1128] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Corporate Headquarters
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-sans">SIMPLDSC TECHNOLOGIES PRIVATE LIMITED</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Plot 42, Cyber Gateway Tech Zone, Whitefield, Bangalore, Karnataka - 560066. Incorporated under the Companies Act, 2013. GSTIN: 29AABCS1429B1Z8.
          </p>
        </div>
        <Link to="/contact" className="shrink-0">
          <Button variant="primary" size="lg" className="bg-indigo-500 hover:bg-indigo-600">
            <span>Contact Our Team</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
