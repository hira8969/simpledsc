import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronDown,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  FileText,
  HelpCircle,
  Video,
  Wrench,
  Loader2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fallback default list matching exact prompt questions
  const defaultFaqs = [
    {
      question: 'What is a Digital Signature Certificate (DSC)?',
      answer: 'A Digital Signature Certificate (DSC) is a secure digital equivalent of a handwritten signature, issued by government-approved Certifying Authorities (CAs) under the Information Technology Act, 2000. It establishes your identity electronically when filing official government forms and documents.'
    },
    {
      question: 'How is DSC different from a scanned signature?',
      answer: 'A scanned signature is merely an image of a handwritten signature that can easily be copied or forged without cryptographic validation. A DSC uses asymmetric 2048-bit cryptography to cryptographically seal the document, guaranteeing authenticity, non-repudiation, and detection of any tampering.'
    },
    {
      question: 'Which DSC should I choose?',
      answer: 'For individual Income Tax, GST, and MCA filings, a Class 3 Individual Signing DSC is recommended. If you participate in government tenders, GeM bidding, or defence contracts, you need a Class 3 Combo (Signing + Encryption) DSC. For foreign trade, choose a DGFT DSC.'
    },
    {
      question: 'What documents are required?',
      answer: 'For individuals: PAN card, Aadhaar card (for paperless eKYC OTP verification), a recent passport-sized photograph, and active mobile number. For organizations: In addition to applicant identity proof, GST certificate, Company PAN, and Board Resolution/Authorization letter are required.'
    },
    {
      question: 'How long does it take to get a DSC?',
      answer: 'With our instant paperless Aadhaar eKYC and video verification process, your DSC application is typically approved and issued within 15 to 30 minutes! USB hardware tokens are dispatched the same business day via express courier.'
    },
    {
      question: 'Is video verification mandatory?',
      answer: 'Yes, as per guidelines established by the Controller of Certifying Authorities (CCA), Government of India, a quick 30-second selfie video recording is mandatory to verify the applicant identity and prevent identity theft.'
    },
    {
      question: 'Will I get a physical token?',
      answer: 'Yes! When you select the USB crypto token option, we dispatch a certified FIPS 140-2 Level 2 USB hardware token (such as ePass2003 or mToken) directly to your shipping address with real-time tracking.'
    },
    {
      question: 'Can I use DSC for GST, MCA and Income Tax?',
      answer: 'Yes! A single Class 3 Digital Signature Certificate can be registered and used across all Indian government portals including Income Tax e-Filing, GST, MCA V3, EPFO, and TRACES.'
    },
    {
      question: 'What is the validity of a DSC?',
      answer: 'Digital Signature Certificates can be issued with a validity period of 1 Year, 2 Years, or 3 Years as per your selection during checkout. You can choose the plan that best suits your compliance frequency.'
    },
    {
      question: 'How can I renew my DSC?',
      answer: 'You can easily renew your existing DSC online through SimplDSC before or after expiry by completing a quick renewal application with paperless Aadhaar verification. Existing USB tokens can also be updated directly.'
    }
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/faqs`);
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        setFaqs(res.data.data);
      } else {
        setFaqs(defaultFaqs);
      }
    } catch (err) {
      console.warn('Using default FAQs:', err.message);
      setFaqs(defaultFaqs);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header matching screenshot 7 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            Find answers to common questions about Digital Signature Certificates.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Accordion */}
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
              </div>
            ) : (
              faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq._id || index}
                    className="bg-white rounded-2xl border border-[#E5E2F0] shadow-sm overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className="text-base font-bold text-[#11112F]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#5B2EFF] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#70708A] leading-relaxed border-t border-slate-50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Side: Still have questions? & Quick Resources Cards matching Screenshot 7 */}
          <div className="lg:col-span-4 space-y-6">
            {/* Still have questions? */}
            <div className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#11112F]">Still have questions?</h3>
                <p className="text-xs text-[#70708A] mt-1">
                  Our support team is happy to help you.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-[#11112F] font-bold text-sm">
                  <Phone className="w-4 h-4 text-[#5B2EFF]" />
                  <a href="tel:+919876543210" className="hover:text-[#5B2EFF]">
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#70708A]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mon – Sat, 9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#70708A]">
                  <Mail className="w-4 h-4 text-[#5B2EFF]" />
                  <a href="mailto:support@simpldsc.in" className="hover:text-[#5B2EFF]">
                    support@simpldsc.in
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="w-full py-3 rounded-full bg-[#5B2EFF] text-white font-bold text-xs hover:bg-[#4A22DE] transition-all inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Talk to Expert</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Resources */}
            <div className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-4">
              <h3 className="text-base font-bold text-[#11112F]">Quick Resources</h3>
              <ul className="space-y-2.5 text-xs font-semibold text-[#16162D]">
                <li>
                  <Link to="/resources" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF9FF] transition-colors">
                    <FileText className="w-4 h-4 text-[#5B2EFF]" />
                    <span>DSC User Guide (PDF)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF9FF] transition-colors">
                    <Wrench className="w-4 h-4 text-[#5B2EFF]" />
                    <span>Installation Guide</span>
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF9FF] transition-colors">
                    <HelpCircle className="w-4 h-4 text-[#5B2EFF]" />
                    <span>Troubleshooting</span>
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF9FF] transition-colors">
                    <Video className="w-4 h-4 text-[#5B2EFF]" />
                    <span>Video Tutorials</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
