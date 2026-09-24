import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ReceiptText,
  FileSpreadsheet,
  FileCheck,
  Gavel,
  PenTool,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const UseCases = () => {
  const useCases = [
    {
      title: 'Company Registration',
      subtitle: 'Ministry of Corporate Affairs (MCA)',
      description: 'Digital Signature Certificates are legally mandatory for incorporating a Private Limited Company, LLP, OPC, or Public Company in India under SPICe+ forms.',
      recommendedDSC: 'Class 3 DSC or MCA DSC',
      features: ['DIN Registration', 'SPICe+ Part B Filing', 'MOA & AOA Electronic Attestation'],
      icon: Building2
    },
    {
      title: 'GST Filing & Invoicing',
      subtitle: 'Goods & Services Tax Network (GSTN)',
      description: 'Mandatory for all corporate entities and LLPs filing GSTR-1, GSTR-3B, refund claims, and generating secure digital e-Invoices.',
      recommendedDSC: 'Class 3 DSC Individual / Org',
      features: ['GSTR Returns Filing', 'e-Way Bill Generation', 'GST Refund Applications'],
      icon: ReceiptText
    },
    {
      title: 'Income Tax e-Filing',
      subtitle: 'Income Tax Department of India',
      description: 'E-verify your ITR-1 to ITR-7 returns instantly without printing and sending physical ITR-V acknowledgment forms to CPC Bengaluru.',
      recommendedDSC: 'Class 3 DSC Individual',
      features: ['Instant e-Verification', 'Tax Audit Report (Form 3CD)', 'Appeal and Rectification Filings'],
      icon: FileSpreadsheet
    },
    {
      title: 'MCA Filings & ROC Compliances',
      subtitle: 'MCA21 & MCA V3 Portal',
      description: 'Directors and Practicing CAs/CS must use Class 3 DSC to sign annual returns (AOC-4, MGT-7), DIR-3 KYC, and charge registrations.',
      recommendedDSC: 'MCA DSC / Class 3 DSC',
      features: ['DIR-3 KYC Authentication', 'Annual Returns AOC-4 & MGT-7', 'Charge Creations & Board Resolutions'],
      icon: FileCheck
    },
    {
      title: 'eTender & GeM Participation',
      subtitle: 'CPPP, Railways & State e-Procurement',
      description: 'Government portals mandate dual cryptographic key certificates (Signing + Encryption) to seal bid submissions securely until opening.',
      recommendedDSC: 'eTender DSC (Sign + Encrypt Combo)',
      features: ['CPPP E-Procurement', 'GeM Portal Seller/Buyer', 'Indian Railways (IREPS) & State Tenders'],
      icon: Gavel
    },
    {
      title: 'Bulk Document Signing',
      subtitle: 'Enterprise PDF Automation',
      description: 'Empower ERPs and payroll engines to digitally batch sign thousands of PDF invoices, salary slips, Form 16, and vendor agreements automatically.',
      recommendedDSC: 'Document Signer DSC',
      features: ['SAP, Oracle, Tally & Zoho Integration', 'GST e-Invoice Bulk Signing', 'Form 16 Automated Issuance'],
      icon: PenTool
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
            Compliance & Legal Use Cases
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            One DSC. Multiple Possibilities.
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            Discover how SimplDSC satisfies every regulatory, corporate, and governmental signing requirement across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((uc, index) => {
            const Icon = uc.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-[#E5E2F0] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center mb-6 group-hover:bg-[#5B2EFF] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#11112F]">{uc.title}</h3>
                  <p className="text-xs font-semibold text-[#5B2EFF] mt-1">{uc.subtitle}</p>
                  <p className="text-xs text-[#70708A] mt-3 leading-relaxed">{uc.description}</p>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-[#11112F] uppercase tracking-wider">Key Applications:</p>
                    {uc.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#16162D]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5B2EFF] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#70708A]">
                    {uc.recommendedDSC}
                  </span>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#5B2EFF] hover:text-[#4A22DE]"
                  >
                    <span>View Plans</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
