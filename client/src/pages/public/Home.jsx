import React from 'react';
import { Link } from 'react-router-dom';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Award,
  ArrowRight,
  Building2,
  FileSpreadsheet,
  ReceiptText,
  FileCheck,
  Gavel,
  PenTool,
  ExternalLink
} from 'lucide-react';

export const Home = () => {
  const trustBadges = [
    { label: 'PAN Verified', icon: ShieldCheck },
    { label: 'Aadhaar eKYC', icon: CheckCircle2 },
    { label: 'Licensed CAs', icon: Award },
    { label: '100% Secure', icon: Lock }
  ];

  const govAgencies = [
    {
      title: 'MCA',
      subtitle: 'Ministry of Corporate Affairs',
      code: 'MCA'
    },
    {
      title: 'Income Tax',
      subtitle: 'Department of Revenue',
      code: 'IT'
    },
    {
      title: 'GSTN',
      subtitle: 'Goods and Services Tax Network',
      code: 'GST'
    },
    {
      title: 'GeM',
      subtitle: 'Government e Marketplace',
      code: 'GEM'
    },
    {
      title: 'Tenders',
      subtitle: 'Government eProcurement',
      code: 'CPPP'
    }
  ];

  const useCases = [
    {
      title: 'Company Registration',
      description: 'Mandatory for SPICe+ company incorporation, DIN allocation and ROC director authentication.',
      icon: Building2
    },
    {
      title: 'GST Filing',
      description: 'Sign monthly and annual GST returns, refund claims, and e-way bill generation effortlessly.',
      icon: ReceiptText
    },
    {
      title: 'Income Tax e-Filing',
      description: 'E-verify your ITR-1 to ITR-7 returns without the hassle of physical postal verification.',
      icon: FileSpreadsheet
    },
    {
      title: 'MCA Filings',
      description: 'Authenticate AOC-4, MGT-7, DIR-3 KYC and other corporate statutory forms on MCA V3.',
      icon: FileCheck
    },
    {
      title: 'eTender Participation',
      description: 'Dual certificate combo for secure encryption and bidding on CPPP, Railways & GeM tenders.',
      icon: Gavel
    },
    {
      title: 'Document Signing',
      description: 'Cryptographically sign PDF invoices, contracts, HR letters, and Form 16 legally under the IT Act.',
      icon: PenTool
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFFF] border border-purple-200 text-[#5B2EFF] text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#5B2EFF] animate-pulse" />
                <span>India's trusted DSC partner</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#11112F] tracking-tight leading-[1.12]">
                Your Trusted <br />
                <span className="text-[#5B2EFF]">Digital Signature</span> <br />
                Partner in India
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#70708A] max-w-xl leading-relaxed">
                Get your Class 2 & Class 3 Digital Signature Certificate online in minutes. Trusted by professionals, businesses and organizations.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/dsc-finder"
                  className="px-7 py-3.5 rounded-full bg-[#5B2EFF] text-white font-semibold text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2 group active:scale-95"
                >
                  <span>Get Your DSC Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/pricing"
                  className="px-7 py-3.5 rounded-full border border-[#E5E2F0] bg-white text-[#16162D] font-semibold text-sm hover:bg-slate-50 transition-all duration-200 shadow-sm active:scale-95"
                >
                  View Plans
                </Link>
              </div>

              {/* Trust Badges Row */}
              <div className="pt-6 border-t border-[#E5E2F0]/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {trustBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#16162D]">
                      <div className="w-7 h-7 rounded-full bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Hero Visual: Realistic USB Token + Certificate Mockup */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                {/* Background Certificate Card */}
                <div className="absolute inset-x-4 inset-y-6 bg-white rounded-3xl border border-[#E5E2F0] shadow-xl p-6 flex flex-col justify-between transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#5B2EFF] flex items-center justify-center text-white text-[10px] font-bold">
                        CA
                      </div>
                      <span className="text-xs font-bold text-slate-800">Certifying Authority India</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                      VALID
                    </span>
                  </div>

                  <div className="space-y-2 py-4">
                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                    <div className="h-2 w-1/2 bg-slate-100 rounded" />
                    <div className="h-2 w-2/3 bg-slate-100 rounded" />
                  </div>

                  {/* Digital Signature preview stamping */}
                  <div className="border border-dashed border-[#5B2EFF]/30 rounded-xl p-3 bg-[#FAF9FF] flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-[#5B2EFF] tracking-wider">Digitally Signed By</p>
                      <p className="text-xs font-extrabold text-[#11112F]">AUTHORIZED SIGNATORY</p>
                      <p className="text-[9px] text-[#70708A]">2048-Bit RSA Security</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-emerald-600 font-mono">SHA-256</p>
                    </div>
                  </div>
                </div>

                {/* Floating Realistic USB Token on top with 3D shadow and slight angle */}
                <div className="relative z-10 transform translate-y-8 translate-x-4 rotate-12 hover:rotate-6 transition-transform duration-300">
                  <div className="p-2 rounded-2xl bg-[#11112F]/10 backdrop-blur-xs shadow-2xl">
                    <UsbTokenVisual type="epass2003" size="hero" />
                  </div>
                </div>

                {/* Floating Tags */}
                <div className="absolute -bottom-2 z-20 px-4 py-1.5 rounded-full bg-[#11112F] text-white text-[11px] font-bold tracking-widest uppercase shadow-lg">
                  • PROTECT • IDENTIFY • SIGN
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION: Government Agencies */}
      <section className="py-12 bg-white border-y border-[#E5E2F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-[#70708A] tracking-wider uppercase mb-8">
            Trusted by 1,00,000+ Customers Across India
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
            {govAgencies.map((agency, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-[#5B2EFF]/30 hover:bg-[#FAF9FF] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center font-extrabold text-sm mb-2 group-hover:scale-105 transition-transform">
                  {agency.code}
                </div>
                <h2 className="text-sm font-bold text-[#11112F]">{agency.title}</h2>
                <span className="text-[11px] text-[#70708A] text-center leading-tight mt-0.5">
                  {agency.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. USE CASES SECTION */}
      <section className="py-20 md:py-28 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
              Versatile Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11112F] mt-4 tracking-tight">
              One DSC. Multiple Possibilities.
            </h2>
            <p className="text-base text-[#70708A] mt-3">
              From corporate director signatures to government tender bidding, your SimplDSC certificate covers every Indian regulatory portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {useCases.map((uc, index) => {
              const Icon = uc.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-7 border border-[#E5E2F0] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center mb-5 group-hover:bg-[#5B2EFF] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#11112F] mb-2">{uc.title}</h3>
                  <p className="text-sm text-[#70708A] leading-relaxed">{uc.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOME CTA BANNER */}
      <section className="py-16 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#11112F] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
            {/* Ambient purple background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#5B2EFF]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Go Paperless. <br />
                  Go Digital with SimplDSC.
                </h2>
                <p className="text-base text-slate-300 max-w-lg leading-relaxed">
                  Join over 100,000+ businesses and professionals across India who have switched to fast, secure, and legally recognized paperless digital signing.
                </p>
                <div>
                  <Link
                    to="/dsc-finder"
                    className="px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-semibold text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-lg hover:shadow-purple-500/25 inline-flex items-center gap-2 group active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Side Visual: Indian Professional Business Imagery Graphic */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-800 to-[#1E1B4B] border border-slate-700/60 p-6 shadow-2xl flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center font-bold text-2xl mb-4 shadow-inner">
                    🇮🇳
                  </div>
                  <h3 className="text-white font-bold text-lg">Digital India Compliant</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Certificates issued in full adherence to the Information Technology Act 2000 and CCA guidelines.
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700 w-full flex items-center justify-around text-xs text-slate-300 font-semibold">
                    <span>✓ 100% Online</span>
                    <span>✓ 15-Min Approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
