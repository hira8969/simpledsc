import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/endpoints.js';
import { Button } from '../../components/ui/Button.jsx';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Lock,
  Headphones,
  Award,
  ChevronDown,
  Building2,
  Receipt,
  FileSpreadsheet,
  Gavel,
  Globe2,
  FileSignature,
  Usb,
  ArrowUpRight,
  Star
} from 'lucide-react';

export const Home = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getProducts();
        if (res?.data && res.data.length > 0) {
          setPopularProducts(res.data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not load dynamic products on home:', err);
      }
    };
    fetchProducts();
  }, []);

  const useCases = [
    { title: 'MCA / ROC Filings', icon: Building2, desc: 'Director KYC, DIN registration, SPICe+ company formation.' },
    { title: 'GST Returns & Invoicing', icon: Receipt, desc: 'Monthly GSTR-1, GSTR-3B filings, invoice signing.' },
    { title: 'Income Tax (ITR)', icon: FileSpreadsheet, desc: 'Tax audit reports, e-Verification, Form 16 signing.' },
    { title: 'e-Tenders & GeM Portal', icon: Gavel, desc: 'Central CPPP, Defence, Railway, and State e-procurement.' },
    { title: 'Import / Export (DGFT)', icon: Globe2, desc: 'ICEGATE, Advance Licensing, and foreign trade policies.' },
    { title: 'Automated Document Signing', icon: FileSignature, desc: 'Bulk HR contracts, invoices, and legal agreements.' }
  ];

  const whyChooseUs = [
    {
      title: '100% Paperless & Secure',
      desc: 'Instant video KYC and Aadhaar paperless verification in under 5 minutes.',
      icon: ShieldCheck
    },
    {
      title: 'Authorized CA Partners',
      desc: 'Certificates compliant with Indian IT Act 2000 and CCA guidelines.',
      icon: Award
    },
    {
      title: 'Express Fast-Track Delivery',
      desc: 'FIPS 140-2 crypto USB tokens dispatched via insured express courier.',
      icon: Clock
    },
    {
      title: 'Dedicated CA & Tech Support',
      desc: 'Live expert assistance for token driver installation and portal settings.',
      icon: Headphones
    }
  ];

  const faqs = [
    {
      q: 'What is a Class 3 Digital Signature Certificate (DSC)?',
      a: 'Class 3 DSC is the highest assurance digital signature certificate under the Indian IT Act. It is mandatory for Income Tax e-filing, MCA V3 corporate filings, GST returns, and government e-Tendering on CPPP and GeM portals.'
    },
    {
      q: 'How long does it take to obtain a DSC through SimplDSC?',
      a: 'With our 100% paperless Aadhaar & Video KYC process, your verification is typically completed within 15 to 30 minutes during business hours. Once verified, your certificate is instantly downloaded to your FIPS crypto token.'
    },
    {
      q: 'Do I need Signing only or Combo (Signing + Encryption)?',
      a: 'If you require DSC for Income Tax, GST, or MCA filings, a "Signing Only" DSC is sufficient. If you are participating in Government e-Tendering (CPPP, GeM, Railways, Defence), a "Signing + Encryption Combo" is strictly mandatory.'
    },
    {
      q: 'What documents are required for an Individual DSC?',
      a: 'You only need your PAN Card, Aadhaar Card (for paperless eKYC / OTP), and a recent passport-sized photograph. Everything is uploaded digitally through our secure portal.'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#EEF2FF] via-[#F8F9FE] to-white">
        {/* Glow ambient background dots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen Indian Legal-Tech Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-sans">
                Your Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">Digital Signature</span> Partner in India
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Get CCA-compliant Class 3, DGFT, and Organization DSCs in 15 minutes. 100% paperless online verification with plug-and-play FIPS cryptographic USB tokens.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link to="/products" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-600/25">
                    <span>Get Your DSC Now</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dsc-finder" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
                    <span>✦ Find My DSC</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Secure Video KYC</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Authorized CA Partners</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>15 Min Processing</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Expert CA Support</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Decorative Elements */}
                <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-elevated border border-indigo-50 z-20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">100% Paperless</p>
                    <p className="text-[11px] text-slate-500">Aadhaar eKYC Verified</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-4 bg-white p-3.5 rounded-2xl shadow-elevated border border-indigo-50 z-20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Usb className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">FIPS 140-2 Crypto Token</p>
                    <p className="text-[11px] text-indigo-600 font-semibold">Free Express Shipping</p>
                  </div>
                </div>

                {/* Main Hero Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Class 3 Digital Certificate</h3>
                        <p className="text-[11px] text-slate-400">Valid for MCA, GST & ITR</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3 py-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Certificate Holder:</span>
                      <span className="font-semibold text-slate-800">Rahul Sharma</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Key Algorithm:</span>
                      <span className="font-semibold text-slate-800">RSA 2048-bit High Grade</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Governing Authority:</span>
                      <span className="font-semibold text-indigo-600">CCA India / IT Act 2000</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Hardware Security:</span>
                      <span className="font-semibold text-emerald-600">FIPS Level 2 USB Token</span>
                    </div>
                  </div>

                  <Link to="/products/class-3-individual-signing" className="block">
                    <Button variant="navy" className="w-full justify-between" size="md">
                      <span>View Specifications</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section: "One DSC. Multiple Possibilities." */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Versatile Compliance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              One DSC. Multiple Possibilities.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Designed to seamlessly authenticate across all official Government of India portals and enterprise document workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-indigo-200 shadow-sm card-hover transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose SimplDSC */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#F8F9FE] to-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              The SimplDSC Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Why Businesses & Professionals Choose Us
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              No paperwork queues, zero hassle, and guaranteed compliance under the Indian IT Act.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card card-hover space-y-3.5 text-center sm:text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mx-auto sm:mx-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular DSC Products Preview */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Transparent Pricing
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                Popular DSC Products
              </h2>
              <p className="text-sm text-slate-600">
                Choose the right certificate for your specific compliance requirement.
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="sm">
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularProducts.length > 0 ? (
              popularProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-400 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {prod.hasEncryption ? 'Signing + Encryption' : 'Signing Only'}
                      </span>
                      {prod.popularTag && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                          ★ Most Popular
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{prod.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{prod.shortDescription}</p>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-400">Starting from</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ₹{prod.validityOptions?.[0]?.discountPrice || prod.basePrice}
                        </span>
                        <span className="text-xs text-slate-400">+ 18% GST</span>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-slate-600">
                      {(prod.features || []).slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link to={`/products/${prod.slug}`}>
                      <Button variant="primary" className="w-full" size="md">
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback cards while loading
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-8 bg-slate-200 rounded w-1/2 mt-4" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="py-16 sm:py-24 bg-[#0A1128] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              How SimplDSC Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              From application to FIPS token issuance in four transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { num: '01', title: 'Fill Application', desc: 'Select certificate type and enter basic applicant details.' },
              { num: '02', title: 'Verify Documents', desc: 'Fast paperless Aadhaar eKYC or upload PAN & ID proofs.' },
              { num: '03', title: 'Make Payment', desc: 'Instant online payment via UPI, Net Banking, or Cards.' },
              { num: '04', title: 'DSC Issued & Token Dispatched', desc: 'Certifying Authority approves and certificate is delivered.' }
            ].map((step, idx) => (
              <div key={idx} className="relative space-y-3 text-center md:text-left">
                <span className="text-4xl font-extrabold text-indigo-500/40 font-mono block">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/how-it-works">
              <Button variant="primary" size="md" className="bg-indigo-500 hover:bg-indigo-600">
                <span>View Step-by-Step Guide</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Trust Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-sans">
              Trusted by 25,000+ CAs, Tax Advocates & Enterprises
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'SimplDSC simplified DSC procurement for all our 200+ corporate clients. The instant Aadhaar verification and token delivery are top-notch.',
                author: 'Suresh Iyer',
                role: 'Senior Partner, Iyer & Associates CA Firm'
              },
              {
                quote: 'Needed a Class 3 Combo DSC urgently for a GeM railway tender. SimplDSC verified our documents in 20 minutes. Exceptional turnaround time!',
                author: 'Pooja Kulkarni',
                role: 'Director, Kulkarni Infra Projects Pvt Ltd'
              },
              {
                quote: 'The interactive DSC Finder is a lifesaver for clients who get confused between individual and organization DSCs. Truly made simple.',
                author: 'Arunav Sengupta',
                role: 'Tax Consultant & GST Practitioner'
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-[#F8F9FE] p-6 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 sm:py-24 bg-[#F8F9FE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-800">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Ready to Get Your Digital Signature?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Experience the fastest, most reliable DSC service in India. Paperless eKYC, encrypted hardware tokens, and 7-day expert support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/products" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-slate-100">
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/dsc-finder" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10">
                <span>✦ Find My DSC</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
