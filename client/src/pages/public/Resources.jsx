import React from 'react';
import { Download, Usb, FileText, CheckCircle2, Shield, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';

export const Resources = () => {
  const drivers = [
    {
      name: 'Watchdata PROXKey Token Driver',
      os: 'Windows 10 / 11 (64-bit & 32-bit)',
      version: 'v4.0.25 (Latest)',
      size: '12.4 MB'
    },
    {
      name: 'ePass 2003 Auto Crypto Token',
      os: 'Windows & macOS Compatible',
      version: 'v2.1 Build 2026',
      size: '18.1 MB'
    },
    {
      name: 'mToken Crypto Hardware Driver',
      os: 'Windows 10 / 11',
      version: 'v1.4.19',
      size: '9.8 MB'
    }
  ];

  const portalGuides = [
    {
      title: 'MCA V3 Portal DSC Registration Guide',
      desc: 'How to map your Director Identification Number (DIN) and register DSC on Ministry of Corporate Affairs V3 portal.',
      link: '#'
    },
    {
      title: 'Income Tax emBridge / emSigner Configuration',
      desc: 'Step-by-step troubleshooting for DSC recognition errors on the e-Filing 2.0 portal.',
      link: '#'
    },
    {
      title: 'Adobe Acrobat PDF Digital Signing Setup',
      desc: 'Configuring trusted root certificates and placing verifiable legal cryptographic signatures on PDF contracts.',
      link: '#'
    },
    {
      title: 'GeM Portal & CPPP e-Tender Encryption Setup',
      desc: 'How to install the dual encryption certificate for sealing tender bids on government procurement sites.',
      link: '#'
    }
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Downloads & Utilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Token Drivers & Portal Guides
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Official drivers for FIPS USB tokens and comprehensive walkthroughs for MCA, GST, Income Tax, and eTender portals.
        </p>
      </div>

      {/* USB Token Drivers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Usb className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Official USB Hardware Drivers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drivers.map((drv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700">
                  {drv.version}
                </span>
                <h3 className="text-base font-bold text-slate-900">{drv.name}</h3>
                <p className="text-xs text-slate-500">{drv.os}</p>
                <p className="text-[11px] text-slate-400">File Size: {drv.size}</p>
              </div>

              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading ${drv.name} installer...`);
                }}
                className="w-full"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-1.5 text-indigo-600" />
                  <span>Download Driver</span>
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Portal Guides */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Portal Configuration Guides</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portalGuides.map((g, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900">{g.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.desc}</p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  Read Setup Guide <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
