import React from 'react';
import { Link } from 'react-router-dom';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import { FileEdit, ShieldCheck, CreditCard, DownloadCloud, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: 'Fill the Form',
      description: 'Provide basic details and select your DSC type.',
      icon: FileEdit
    },
    {
      num: 2,
      title: 'Verify Documents',
      description: 'Complete eKYC using Aadhaar, PAN and video verification.',
      icon: ShieldCheck
    },
    {
      num: 3,
      title: 'Make Payment',
      description: 'Pay securely online using UPI, card or net banking.',
      icon: CreditCard
    },
    {
      num: 4,
      title: 'Get Your DSC',
      description: 'Receive your DSC delivered online or on a USB token.',
      icon: DownloadCloud
    }
  ];

  const highlights = [
    'eKYC with Aadhaar',
    'Video Verification',
    'Issued by Licensed CAs',
    'Pan India Delivery'
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header matching screenshot 5 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
            How It Works
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Get Your DSC in 4 Simple Steps
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            A fast, secure and fully online process. No physical paperwork.
          </p>
        </div>

        {/* 4 Steps Timeline matching Screenshot 5 */}
        <div className="relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#E5E2F0] -translate-y-8 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card text-center flex flex-col items-center justify-between hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center mb-5 font-black text-xl shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-[#11112F] mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[#70708A] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Visual + Checklist */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E5E2F0] shadow-card grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual: Laptop + USB token */}
          <div className="lg:col-span-6 flex items-center justify-center p-8 bg-[#FAF9FF] rounded-2xl border border-slate-100">
            <div className="relative flex flex-col items-center">
              <div className="w-64 h-40 bg-[#11112F] rounded-t-xl p-3 border-4 border-slate-700 flex flex-col justify-between shadow-2xl">
                <div className="w-full flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono">simpl-portal.gov.in</span>
                </div>
                <div className="text-center py-4">
                  <p className="text-xs text-white font-bold">DSC Certificate Issued</p>
                  <p className="text-[9px] text-emerald-400 font-mono mt-1">2048-Bit RSA Ready</p>
                </div>
                <div className="h-1 bg-slate-700 rounded" />
              </div>
              <div className="w-72 h-3 bg-slate-400 rounded-b-lg shadow-md" />

              <div className="mt-6">
                <UsbTokenVisual type="epass2003" size="md" />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11112F] tracking-tight">
              Trusted. Secure. 100% Online.
            </h2>
            <p className="text-sm text-[#70708A] leading-relaxed">
              No need to mail physical attested identity documents. Complete Aadhaar eKYC via OTP, record a fast 30-second video selfie, and get your DSC approved by licensed authorities immediately.
            </p>

            <div className="space-y-3 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-semibold text-[#16162D]">
                  <CheckCircle2 className="w-5 h-5 text-[#5B2EFF] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/dsc-finder"
                className="px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-semibold text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-md inline-flex items-center gap-2 group active:scale-95"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
