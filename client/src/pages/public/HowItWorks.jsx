import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import {
  FileText,
  Camera,
  CreditCard,
  Usb,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Fill Application Online',
      desc: 'Select your preferred DSC category (Class 3, DGFT, or Combo) and fill in your basic personal or corporate details. Our clean, one-column mobile-friendly form takes less than 3 minutes to complete.',
      icon: FileText,
      points: [
        'Select 1, 2, or 3-year validity',
        'Provide PAN, Mobile, Email & Address',
        'Enter GSTIN / CIN for Organization DSCs'
      ]
    },
    {
      step: '02',
      title: '100% Paperless KYC & Verification',
      desc: 'No physical paperwork, notary stamps, or courier queues needed. Complete verification in 5 minutes using official Aadhaar OTP eKYC and a 30-second mobile video recording.',
      icon: Camera,
      points: [
        'Instant UIDAI Aadhaar Paperless verification',
        'Real-time PAN database validation',
        'Secure 30-second video recording via your phone camera'
      ]
    },
    {
      step: '03',
      title: 'Instant Online Payment',
      desc: 'Complete payment securely via UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ Indian banks, or Corporate Credit/Debit cards. Receive an automated GST-compliant tax invoice instantly.',
      icon: CreditCard,
      points: [
        '100% secure payment gateway integration',
        'Zero hidden charges; free FIPS token included',
        'Instant invoice generation with HSN Code 998313'
      ]
    },
    {
      step: '04',
      title: 'CA Issuance & Token Dispatch',
      desc: 'Our authorized Certifying Authority verifies your application. Once approved, the cryptographic certificate is downloaded to a FIPS 140-2 Level 2 USB crypto token and dispatched with live tracking.',
      icon: Usb,
      points: [
        'Approved within 15-30 minutes during business hours',
        'FIPS 140-2 Level 2 cryptographic hardware token',
        'Shipped via express courier (Bluedart/DTDC) with tracking'
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Fast & Paperless
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          How SimplDSC Works
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          The fastest and simplest way to obtain a legal Digital Signature Certificate in India.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-12">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          const isEven = idx % 2 === 1;

          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-8 lg:gap-16 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-card card-hover`}
            >
              {/* Visual Box */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md bg-gradient-to-tr from-[#EEF2FF] to-white rounded-2xl p-8 border border-indigo-100 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    Step {item.step}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                </div>
              </div>

              {/* Text Description Box */}
              <div className="w-full lg:w-1/2 space-y-4 text-left">
                <span className="text-3xl font-extrabold text-indigo-600 font-mono">
                  {item.step}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                <div className="space-y-2 pt-2">
                  {item.points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="mt-16 text-center bg-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-4">
        <h3 className="text-2xl font-bold font-sans">Ready to apply for your DSC?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Complete the 100% paperless verification today and have your token ready for upcoming filings.
        </p>
        <div className="pt-2">
          <Link to="/products">
            <Button variant="primary" size="lg">
              <span>Start Your Application Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
