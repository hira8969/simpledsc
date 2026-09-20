import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Lock, ExternalLink, CheckCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0A1128] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                SIMPL<span className="text-indigo-400">DSC</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Digital Signatures, Made Simple. Fast, 100% paperless digital signature certificates for Individuals, Directors, Businesses, and Tender Bidders across India.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>2048-bit RSA High Security</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>CCA India & IT Act Compliant</span>
              </div>
            </div>
          </div>

          {/* DSC Products */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              DSC Products
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Class 3 DSC Individual
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Class 3 Combo (Sign + Encrypt)
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Organization DSC
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  DGFT Digital Signature
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  eTender & GeM Portal DSC
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Document Signer Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Tools & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dsc-finder" className="hover:text-white transition-colors text-indigo-400 font-medium">
                  ✦ Interactive DSC Finder
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing & Calculator
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  USB Token Drivers & Setup
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Corporate Office */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact & Legal
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Plot 42, Cyber Gateway Tech Zone, Whitefield, Bangalore, Karnataka - 560066</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 80 4719 2800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@simpldsc.in</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
                GSTIN: 29AABCS1429B1Z8
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} SIMPLDSC TECHNOLOGIES PVT LTD. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 text-slate-400">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Refund & Cancellation</Link>
            <Link to="/admin/login" className="hover:text-indigo-400 transition-colors">Admin Portal</Link>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-6 text-center leading-relaxed">
          Disclaimer: SimplDSC facilitates application and verification for Digital Signature Certificates issued by licensed Certifying Authorities (CAs) under the Office of the Controller of Certifying Authorities (CCA), Ministry of Electronics and Information Technology (MeitY), Government of India pursuant to the Information Technology Act, 2000.
        </p>
      </div>
    </footer>
  );
};
