import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import { CheckCircle2, Shield, Zap, Award, Check } from 'lucide-react';

export const Pricing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Individual');

  const tabs = ['Individual', 'Business', 'Government', 'Import / Export'];

  // Plans configured for display
  const plans = [
    {
      id: 'class-2-dsc',
      name: 'Class 2 DSC',
      category: 'For individuals',
      price: 1499,
      validity: '1 Year Validity',
      tokenType: 'epass2003',
      features: [
        'Aadhaar eKYC',
        'PAN Verification',
        'Email Support',
        'Free Reissuance*'
      ],
      isPopular: false
    },
    {
      id: 'class-3-dsc',
      name: 'Class 3 DSC',
      category: 'For professionals & directors',
      price: 1999,
      validity: '1 Year Validity',
      tokenType: 'epass2003',
      features: [
        'Aadhaar eKYC',
        'PAN Verification',
        'Video Verification',
        'Priority Support',
        'Free Reissuance*'
      ],
      isPopular: true
    },
    {
      id: 'etender-dsc',
      name: 'eTender DSC',
      category: 'For government tenders',
      price: 2499,
      validity: '1 Year Validity',
      tokenType: 'capsigns',
      features: [
        'Aadhaar eKYC',
        'PAN Verification',
        'Organization Details',
        'Priority Support',
        'Free Reissuance*'
      ],
      isPopular: false
    }
  ];

  const handleBuy = (plan) => {
    navigate('/checkout', {
      state: {
        product: {
          slug: plan.id,
          name: plan.name,
          price: plan.price,
          validity: plan.validity,
          shortDescription: plan.category
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header matching screenshot 6 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Simple & Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            No hidden charges. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Audience Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#5B2EFF] text-white shadow-md'
                  : 'bg-white border border-[#E5E2F0] text-[#70708A] hover:text-[#16162D] hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3 Pricing Cards matching Screenshot 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'border-[#5B2EFF] shadow-xl ring-2 ring-[#5B2EFF]/20 md:-translate-y-2'
                  : 'border-[#E5E2F0] shadow-card hover:shadow-card-hover'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#5B2EFF] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#11112F]">{plan.name}</h3>
                  <p className="text-xs text-[#70708A] mt-1">{plan.category}</p>
                </div>

                {/* Token Visual */}
                <div className="py-4 flex items-center justify-center bg-[#FAF9FF] rounded-2xl border border-slate-100">
                  <UsbTokenVisual type={plan.tokenType} size="sm" />
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#11112F]">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs text-[#70708A] font-semibold">{plan.validity}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 pt-2 border-t border-slate-100">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-medium text-[#16162D]">
                      <CheckCircle2 className="w-4 h-4 text-[#5B2EFF] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-slate-100">
                <button
                  onClick={() => handleBuy(plan)}
                  className={`w-full py-3.5 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 ${
                    plan.isPopular
                      ? 'bg-[#5B2EFF] text-white hover:bg-[#4A22DE] shadow-md'
                      : 'border border-[#E5E2F0] bg-white text-[#16162D] hover:bg-slate-50'
                  }`}
                >
                  Buy Now →
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-center text-[#70708A]">
          *18% GST applicable at checkout. USB crypto tokens are FIPS 140-2 Level 2 certified.
        </p>

        {/* Trust Badges Strip matching Screenshot 6 */}
        <div className="pt-8 border-t border-[#E5E2F0] grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-bold text-[#16162D]">
          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-[#E5E2F0]">
            <Shield className="w-4 h-4 text-[#5B2EFF]" />
            <span>Secure Payments (Razorpay / UPI)</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-[#E5E2F0]">
            <Zap className="w-4 h-4 text-[#5B2EFF]" />
            <span>Instant Processing</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-[#E5E2F0]">
            <Award className="w-4 h-4 text-[#5B2EFF]" />
            <span>Licensed CAs</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-[#E5E2F0]">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>100% Genuine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
