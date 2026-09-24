import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import {
  User,
  Building,
  Landmark,
  Globe2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DSCFinder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState('Individual');
  const [usage, setUsage] = useState('Income Tax & GST');
  const [requirement, setRequirement] = useState('USB Crypto Token Included');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const step1Options = [
    {
      id: 'Individual',
      title: 'Individual',
      subtitle: 'For personal use, ITR filing, etc.',
      icon: User
    },
    {
      id: 'Business / Company',
      title: 'Business / Company',
      subtitle: 'For MCA, GST, business compliance',
      icon: Building
    },
    {
      id: 'Government / PSU',
      title: 'Government / PSU',
      subtitle: 'For tenders and government filings',
      icon: Landmark
    },
    {
      id: 'Import / Export',
      title: 'Import / Export',
      subtitle: 'For DGFT, IEC, customs',
      icon: Globe2
    },
    {
      id: 'Others',
      title: 'Others',
      subtitle: 'Bulk signing, specialized requirements',
      icon: HelpCircle
    }
  ];

  const step2Options = {
    'Individual': [
      { id: 'Income Tax & GST', title: 'Income Tax e-Filing & GST Invoicing' },
      { id: 'Personal Documents', title: 'Personal Document Authentication' },
      { id: 'EPFO & TRACES', title: 'EPFO, Pension, or TRACES Portals' }
    ],
    'Business / Company': [
      { id: 'MCA Director Filings', title: 'MCA21 / MCA V3 Director DIN & ROC Filings' },
      { id: 'GST Returns', title: 'Company GST Filing & Invoicing' },
      { id: 'Bulk Signing', title: 'Bulk PDF Invoices & Payroll Signing' }
    ],
    'Government / PSU': [
      { id: 'CPPP Tenders', title: 'CPPP & Central Government Tenders' },
      { id: 'GeM Portal', title: 'Government e-Marketplace (GeM) Bidding' },
      { id: 'Railways & State Tenders', title: 'Indian Railways & State e-Procurement' }
    ],
    'Import / Export': [
      { id: 'DGFT Portal', title: 'DGFT Import Export Code (IEC) Filings' },
      { id: 'ICEGATE Customs', title: 'Customs & ICEGATE Bill of Entry' },
      { id: 'Foreign Trade Policy', title: 'Advance Authorisation & Duty Remission' }
    ],
    'Others': [
      { id: 'Automated ERP', title: 'Automated ERP Server-side Batch Signing' },
      { id: 'CA/CS Practice', title: 'Practicing CA / CS Multi-client Authentication' }
    ]
  };

  const step3Options = [
    { id: 'USB Crypto Token Included', title: 'USB Crypto Token Included (Recommended for physical signing)' },
    { id: 'Signing Only', title: 'Signing Certificate Only (Tax & MCA portals)' },
    { id: 'Combo Sign + Encrypt', title: 'Combo Certificate (Signing + Encryption for Tenders)' }
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Step 3 -> 4: call recommendation API
      try {
        setLoading(true);
        const res = await axios.post(`${API_BASE}/dsc/recommend`, {
          purpose,
          usage,
          requirement
        });
        if (res.data?.success) {
          setRecommendation(res.data);
          setStep(4);
        }
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        // Fallback recommendation
        setRecommendation({
          recommendationText: 'Based on your requirements, we recommend Class 3 DSC.',
          product: {
            name: 'Class 3 DSC',
            slug: 'class-3-dsc',
            price: 1999,
            validity: '1 Year',
            shortDescription: 'For directors, companies and high security usage.'
          },
          reason: 'Class 3 DSC is the gold standard for high-security compliance in India, valid across MCA, Income Tax, GST, and personal identity verification.'
        });
        setStep(4);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBuyNow = () => {
    if (recommendation?.product) {
      navigate('/checkout', { state: { product: recommendation.product } });
    } else {
      navigate('/products');
    }
  };

  const currentUsageList = step2Options[purpose] || step2Options['Individual'];

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header matching screenshot 4 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
            Find Your DSC
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Which DSC Do You Need?
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            Answer a few simple questions and we'll recommend the best Digital Signature Certificate for you.
          </p>
        </div>

        {/* Wizard + Help Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Wizard Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E2F0] shadow-card">
            {/* Step Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
              <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider">
                Step {step} of 4
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === step
                        ? 'w-8 bg-[#5B2EFF]'
                        : i < step
                        ? 'w-4 bg-purple-300'
                        : 'w-4 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Purpose */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#11112F]">
                  What is your purpose for the DSC?
                </h2>

                <div className="space-y-3">
                  {step1Options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = purpose === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setPurpose(opt.id)}
                        className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#5B2EFF] bg-[#F3EFFF]/50 shadow-sm'
                            : 'border-[#E5E2F0] bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#5B2EFF] text-white' : 'bg-[#FAF9FF] text-[#5B2EFF]'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#11112F]">{opt.title}</h3>
                            <p className="text-xs text-[#70708A]">{opt.subtitle}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#5B2EFF] bg-[#5B2EFF]' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Usage */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#11112F]">
                  What will you primarily use this DSC for?
                </h2>

                <div className="space-y-3">
                  {currentUsageList.map((opt) => {
                    const isSelected = usage === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setUsage(opt.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#5B2EFF] bg-[#F3EFFF]/50 shadow-sm'
                            : 'border-[#E5E2F0] bg-white hover:border-purple-300'
                        }`}
                      >
                        <span className="text-sm font-bold text-[#11112F]">{opt.title}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#5B2EFF] bg-[#5B2EFF]' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Requirements */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#11112F]">
                  Choose your hardware & certificate requirement:
                </h2>

                <div className="space-y-3">
                  {step3Options.map((opt) => {
                    const isSelected = requirement === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setRequirement(opt.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#5B2EFF] bg-[#F3EFFF]/50 shadow-sm'
                            : 'border-[#E5E2F0] bg-white hover:border-purple-300'
                        }`}
                      >
                        <span className="text-sm font-bold text-[#11112F]">{opt.title}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#5B2EFF] bg-[#5B2EFF]' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Recommendation Result */}
            {step === 4 && recommendation && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-6 rounded-2xl bg-[#F3EFFF]/70 border border-purple-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5B2EFF] uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" /> Recommendation Result
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#11112F]">
                    {recommendation.recommendationText}
                  </h2>
                  <p className="text-sm text-[#70708A] mt-2 leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>

                {/* Recommended Product Card */}
                {recommendation.product && (
                  <div className="bg-[#FAF9FF] rounded-2xl p-6 border border-[#E5E2F0] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <UsbTokenVisual type={recommendation.product.slug} size="sm" />
                      <div>
                        <h3 className="text-lg font-bold text-[#11112F]">
                          {recommendation.product.name}
                        </h3>
                        <p className="text-xs text-[#70708A] mt-0.5">
                          {recommendation.product.shortDescription || '1 Year Validity'}
                        </p>
                        <div className="mt-2 text-xl font-black text-[#5B2EFF]">
                          ₹{(recommendation.product.price || recommendation.product.basePrice || 1999).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleBuyNow}
                      className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#5B2EFF] text-white font-semibold text-sm hover:bg-[#4A22DE] transition-all shadow-md active:scale-95 whitespace-nowrap"
                    >
                      Buy Now →
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#5B2EFF] hover:underline"
                >
                  ← Start Over
                </button>
              </div>
            )}

            {/* Navigation Buttons for Steps 1 - 3 */}
            {step < 4 && (
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-full border border-[#E5E2F0] text-[#16162D] font-semibold text-sm hover:bg-slate-50 inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-7 py-2.5 rounded-full bg-[#5B2EFF] text-white font-semibold text-sm hover:bg-[#4A22DE] transition-all inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                    </>
                  ) : (
                    <>
                      <span>{step === 3 ? 'Get Recommendation' : 'Next'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Need Help? Card matching Screenshot 4 */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#11112F]">Need Help?</h3>
              <p className="text-xs text-[#70708A] mt-1">
                Our experts are here to help you choose the right DSC.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#16162D]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9FF] border border-slate-100">
                <Phone className="w-4 h-4 text-[#5B2EFF] shrink-0" />
                <div>
                  <p className="font-bold text-sm">+91 98765 43210</p>
                  <p className="text-[11px] text-[#70708A]">Mon – Sat, 9:00 AM – 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9FF] border border-slate-100">
                <Mail className="w-4 h-4 text-[#5B2EFF] shrink-0" />
                <div>
                  <p className="font-bold text-sm">support@simpldsc.in</p>
                  <p className="text-[11px] text-[#70708A]">Response within 15 minutes</p>
                </div>
              </div>
            </div>

            {/* Representative Graphic */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#1E1B4B] to-[#5B2EFF] text-white text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/20 mx-auto flex items-center justify-center text-2xl">
                👩‍💼
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                "Not sure between Signing vs Combo? We will guide you for exact tender compliance."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Helper Bar matching Screenshot 4 */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E2F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center font-bold">
              ?
            </div>
            <p className="text-sm font-semibold text-[#11112F]">
              Not sure which DSC is right for you? Talk to our experts for free.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full bg-[#5B2EFF] text-white text-xs font-bold hover:bg-[#4A22DE] transition-colors whitespace-nowrap"
          >
            Talk to Expert
          </Link>
        </div>
      </div>
    </div>
  );
};
