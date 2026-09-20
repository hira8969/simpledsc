import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const Pricing = () => {
  const [selectedTerm, setSelectedTerm] = useState(2); // 1, 2, or 3 years

  const plans = [
    {
      name: 'Class 3 Individual',
      subtitle: 'For ITR, GST, MCA V3 Directors',
      prices: { 1: 1199, 2: 1799, 3: 2499 },
      originalPrices: { 1: 1499, 2: 2199, 3: 2999 },
      encryption: false,
      popular: false,
      features: [
        'Income Tax Return (ITR) e-Filing',
        'GST Portal Returns & Invoicing',
        'MCA21 / MCA V3 Director Signatures',
        'Free FIPS 140-2 Crypto Token',
        'Express Doorstep Courier',
        '7-Day Technical CA Support'
      ],
      notIncluded: ['e-Tendering / GeM Portal Bidding', 'Company Name in Subject']
    },
    {
      name: 'Class 3 Combo (Sign + Encrypt)',
      subtitle: 'Essential for GeM, CPPP & e-Tenders',
      prices: { 1: 2099, 2: 2899, 3: 3799 },
      originalPrices: { 1: 2499, 2: 3499, 3: 4499 },
      encryption: true,
      popular: true,
      features: [
        'Dual Certificate: Signing + Encryption',
        'Central Public Procurement (CPPP) Valid',
        'GeM (Government e-Marketplace) Ready',
        'Railways, Defence & State Tenders',
        'Income Tax, GST & MCA Supported',
        'Free FIPS 140-2 Crypto Token',
        'Priority Verification & Dispatch'
      ],
      notIncluded: ['Company Name in Subject']
    },
    {
      name: 'Organization DSC',
      subtitle: 'Issued in Company / LLP Name',
      prices: { 1: 2999, 2: 4199, 3: 5399 },
      originalPrices: { 1: 3499, 2: 4999, 3: 6499 },
      encryption: true,
      popular: false,
      features: [
        'Company / Entity Name in Certificate',
        'Signing + Encryption Combo Included',
        'High-Value Enterprise Bids & Contracts',
        'Authorized Signatory Authentication',
        'Customs ICEGATE Clearance',
        'Free FIPS 140-2 Crypto Token',
        'Dedicated Enterprise Account Manager'
      ],
      notIncluded: []
    }
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Transparent Rates
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          No hidden fees. Every certificate includes a certified FIPS 140-2 Level 2 USB crypto token and express delivery across India.
        </p>

        {/* Validity Duration Switcher */}
        <div className="pt-6 inline-flex items-center p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200">
          {[
            { years: 1, label: '1 Year Validity' },
            { years: 2, label: '2 Years (Recommended)', badge: 'Best Seller' },
            { years: 3, label: '3 Years (Best Value)', badge: 'Save 35%' }
          ].map((term) => (
            <button
              key={term.years}
              type="button"
              onClick={() => setSelectedTerm(term.years)}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                selectedTerm === term.years
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {term.label}
              {term.badge && (
                <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                  {term.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan, idx) => {
          const price = plan.prices[selectedTerm];
          const orig = plan.originalPrices[selectedTerm];
          const gst = Math.round(price * 0.18);
          const total = price + gst;

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-white border-2 border-indigo-600 shadow-elevated -translate-y-1'
                  : 'bg-white border border-slate-200 shadow-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.subtitle}</p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                      ₹{price}
                    </span>
                    {orig > price && (
                      <span className="text-sm text-slate-400 line-through">₹{orig}</span>
                    )}
                    <span className="text-xs text-slate-500 font-medium">/ {selectedTerm} Year(s)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    + ₹{gst} (18% GST) = <strong className="text-slate-800">₹{total} total</strong>
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 text-xs">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    What's Included:
                  </p>
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}

                  {plan.notIncluded.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-400">
                      <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <Link to={`/dashboard/buy?validity=${selectedTerm}`}>
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="lg"
                    className="w-full"
                  >
                    <span>Get {plan.name}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tax Invoice and Inclusions Note */}
      <div className="mt-14 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <p>
            All purchases include a GST tax invoice with 18% Input Tax Credit (ITC) claimable for businesses and professionals. HSN Code: <strong>998313</strong>.
          </p>
        </div>
        <Link to="/contact" className="text-indigo-600 font-bold hover:underline shrink-0">
          Need Bulk Pricing? Contact Sales →
        </Link>
      </div>
    </div>
  );
};
