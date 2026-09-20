import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dscFinderApi } from '../../api/endpoints.js';
import { Button } from '../../components/ui/Button.jsx';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const DSCFinder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    purpose: '',
    activityType: '',
    needsEncryption: false,
    validityYears: 2
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const totalSteps = 4;

  const handleSelect = (key, val) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Step 4 complete -> fetch recommendations
      setLoading(true);
      setError(null);
      try {
        const res = await dscFinderApi.getRecommendations(answers);
        if (res?.data) {
          setRecommendations(res.data);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error('Finder error:', err);
        setError('Failed to fetch recommendations. Please try again or talk to an expert.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (recommendations) {
      setRecommendations(null);
    } else if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const resetWizard = () => {
    setAnswers({
      purpose: '',
      activityType: '',
      needsEncryption: false,
      validityYears: 2
    });
    setRecommendations(null);
    setStep(1);
  };

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Certificate Guide</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Find the Right DSC in 4 Simple Steps
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          Not sure which digital signature certificate you need? Answer a few quick questions and we will recommend the exact match.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-100 relative">
        {!recommendations ? (
          <div>
            {/* Step Progress */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 text-xs font-semibold text-slate-400">
              <span>Question {step} of {totalSteps}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 sm:w-12 h-1.5 rounded-full transition-all ${
                      i <= step ? 'bg-indigo-600' : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question 1: Purpose */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  1. What do you need the DSC for?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'INDIVIDUAL', label: 'Individual', desc: 'For personal tax returns, DIN, and GST filings' },
                    { val: 'BUSINESS', label: 'Business / Company', desc: 'Authorized signatory for Pvt Ltd, LLP, or Partnership' },
                    { val: 'TENDER', label: 'Government / Tender', desc: 'GeM Portal, CPPP e-Procurement, and Railway bidding' },
                    { val: 'DGFT', label: 'Import / Export', desc: 'IEC registration and DGFT foreign trade portal' },
                    { val: 'MCA', label: 'MCA / ROC Filings', desc: 'Company incorporation and annual ROC compliance' },
                    { val: 'DOCUMENT_SIGNER', label: 'Bulk Document Signing', desc: 'Automated server-side signing for ERP/Invoices' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelect('purpose', opt.val)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        answers.purpose === opt.val
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-100'
                          : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2: Activity */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  2. What type of primary activity will you perform?
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { val: 'TAX_FILINGS', label: 'Income Tax (ITR) & GST Returns Filing' },
                    { val: 'COMPANY_MCA', label: 'Director Authentication, SPICe+ & MCA V3 Filings' },
                    { val: 'GOV_TENDERS', label: 'Bidding in Government e-Tenders (GeM, CPPP, State Portals)' },
                    { val: 'FOREIGN_TRADE', label: 'Customs ICEGATE and DGFT Foreign Trade Schemes' },
                    { val: 'AUTOMATED_SIGN', label: 'Automated Bulk PDF Invoicing / HR Document Signings' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelect('activityType', opt.val)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        answers.activityType === opt.val
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-100'
                          : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                      {answers.activityType === opt.val && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3: Encryption */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  3. Do you need encryption certificate capability?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelect('needsEncryption', false)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.needsEncryption === false
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-100'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900">Signing Only (Standard)</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Perfect for Income Tax, GST returns, MCA Director signatures, and general legal document signing.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('needsEncryption', true)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.needsEncryption === true
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-100'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">Signing + Encryption (Combo)</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Mandatory for Tenders
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Provides both Signing and Encryption certificates on 1 token. Strictly required for GeM & CPPP tender bids.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Question 4: Validity */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  4. How long do you need the certificate validity for?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { years: 1, label: '1 Year', desc: 'Short term project or temporary filing' },
                    { years: 2, label: '2 Years', desc: 'Most popular option among businesses', popular: true },
                    { years: 3, label: '3 Years', desc: 'Best value with lowest per-year cost' }
                  ].map((v) => (
                    <button
                      key={v.years}
                      type="button"
                      onClick={() => handleSelect('validityYears', v.years)}
                      className={`p-5 rounded-2xl border text-center transition-all relative ${
                        answers.validityYears === v.years
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-100'
                          : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                      }`}
                    >
                      {v.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm">
                          Recommended
                        </span>
                      )}
                      <p className="text-xl font-extrabold text-slate-900">{v.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{v.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                size="md"
                onClick={handleBack}
                disabled={step === 1}
                className={step === 1 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                isLoading={loading}
                disabled={
                  (step === 1 && !answers.purpose) ||
                  (step === 2 && !answers.activityType)
                }
              >
                <span>{step === totalSteps ? 'Show Recommendations' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Recommendation Results Screen */
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Recommended For You
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Matching Digital Signature Certificates
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={resetWizard}>
                <span>Reset & Change Answers</span>
              </Button>
            </div>

            {/* Mandatory Legal Advice Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Important Notice:</strong> Based on your answers, these products may match your stated requirements. Please confirm with your CA/legal provider if unsure. Recommendations do not constitute formal legal counsel.
              </p>
            </div>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {recommendations.length > 0 ? (
                recommendations.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-6 rounded-2xl border-2 border-indigo-600 bg-white shadow-card flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                          {prod.hasEncryption ? 'Signing + Encryption' : 'Signing Only'}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Best Match
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">{prod.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{prod.shortDescription}</p>

                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-400">Starting price for {answers.validityYears} Year(s)</p>
                        <p className="text-2xl font-extrabold text-slate-900">
                          ₹{prod.validityOptions?.find((v) => v.years === answers.validityYears)?.discountPrice || prod.basePrice}
                          <span className="text-xs text-slate-400 font-normal ml-1">+ 18% GST</span>
                        </p>
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(prod.features || []).slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-3">
                      <Link to={`/products/${prod.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Link
                        to={`/dashboard/buy?product=${prod._id}&validity=${answers.validityYears}`}
                        className="flex-1"
                      >
                        <Button variant="primary" size="sm" className="w-full">
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-sm text-slate-500">No exact match found for this filter combination.</p>
                  <Link to="/products" className="inline-block mt-4">
                    <Button variant="primary" size="sm">Browse All Products</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Talk to Expert Banner */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
                  <p className="text-xs text-slate-500">Speak directly with our Indian DSC compliance specialists.</p>
                </div>
              </div>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="bg-white">
                  Talk to Expert
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
