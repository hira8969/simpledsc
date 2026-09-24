import React from 'react';
import { Shield, Clock, Lock, MapPin, Award, CheckCircle, Star, Users } from 'lucide-react';

export const About = () => {
  const stats = [
    { value: '1,00,000+', label: 'Happy Customers' },
    { value: '4.8/5', label: 'Customer Rating' },
    { value: '99%', label: 'Successful Issuance' },
    { value: '24/7', label: 'Expert Support' }
  ];

  const whyChoose = [
    {
      title: 'Authorized & Licensed CAs',
      description: 'We partner exclusively with CCA-approved Certifying Authorities ensuring all certificates are 100% legally recognized.',
      icon: Shield
    },
    {
      title: 'Fast & Hassle-Free Process',
      description: 'Complete Aadhaar eKYC and video verification online from anywhere in under 15 minutes without paper courier forms.',
      icon: Clock
    },
    {
      title: 'Secure & Encrypted Verification',
      description: 'Bank-grade 2048-bit RSA cryptography ensures that your private keys and identification data remain strictly confidential.',
      icon: Lock
    },
    {
      title: 'Pan India Support',
      description: 'Dedicated customer care executives assist you across all states and union territories for installation and portal registration.',
      icon: MapPin
    }
  ];

  const partners = [
    { name: 'eMudhra', logoText: 'eMudhra', accent: '#703BFF', desc: 'Licensed Certifying Authority' },
    { name: 'CAPSIGNS', logoText: 'CAPSIGNS', accent: '#2563EB', desc: 'The Digital Signature Company' },
    { name: '(n)Code solutions', logoText: '(n)code solutions', accent: '#059669', desc: 'A Division of GNFC Ltd.' },
    { name: 'V SIGN', logoText: 'V SIGN', accent: '#DC2626', desc: 'Authorized CCA Licensed CA' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 1. Header & Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Enabling a Secure <br />
            and Digital India
          </h1>
          <p className="text-base sm:text-lg text-[#70708A] leading-relaxed">
            SimplDSC is on a mission to make Digital Signature Certificates simple, accessible and reliable for everyone — from individuals to large enterprises.
          </p>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-[#E5E2F0] shadow-card hover:shadow-card-hover transition-all"
            >
              <p className="text-3xl sm:text-4xl font-black text-[#5B2EFF] tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-[#70708A] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 3. Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E2F0] shadow-card">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-[#11112F]">Our Story</h2>
            <p className="text-base text-[#70708A] leading-relaxed">
              SimplDSC was founded with a simple goal: to simplify the process of getting a Digital Signature Certificate in India.
            </p>
            <p className="text-base text-[#70708A] leading-relaxed">
              We work with licensed Certifying Authorities (CAs) to provide a fast, secure and fully online DSC experience for professionals, businesses and government users.
            </p>
            <p className="text-base font-semibold text-[#5B2EFF]">
              We believe in a Paperless, Compliant and Digital India.
            </p>
          </div>

          {/* Right Visual: Digital India Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#1E1B4B] to-[#11112F] p-8 text-center text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B2EFF]/30 rounded-full blur-2xl" />
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-xl font-extrabold tracking-tight text-white">Digital India</h3>
              <p className="text-sm font-semibold text-[#8A5BFF] mt-1 uppercase tracking-wider">Stronger Together</p>
              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                Empowering millions of chartered accountants, company directors, exporters, and entrepreneurs with hassle-free electronic identity credentials.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Why Choose SimplDSC? */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#11112F]">Why Choose SimplDSC?</h2>
            <p className="text-sm text-[#70708A] mt-2">
              We eliminate traditional paperwork delays with modern cryptographic automation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#E5E2F0] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#11112F] mb-2">{item.title}</h3>
                    <p className="text-xs text-[#70708A] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Our Certifying Partners */}
        <div className="space-y-8 pb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11112F]">Our Certifying Partners</h2>
            <p className="text-sm text-[#70708A] mt-2">
              Direct integration with government-authorized licensed Certifying Authorities (CAs).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E5E2F0] shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg mb-3 shadow-md group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.name[0]}
                </div>
                <h3 className="text-base font-extrabold text-[#11112F]">{p.logoText}</h3>
                <span className="text-[11px] text-[#70708A] mt-1">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
