import React, { useState } from 'react';
import axios from 'axios';
import {
  MapPin,
  Phone,
  Mail,
  Globe2,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE}/contact`, formData);
      if (res.data?.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error('Failed to submit contact:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header matching screenshot 8 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            We're here to help. Reach out to us for any queries or support.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Office & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#E5E2F0] shadow-card space-y-6">
              {/* Our Office */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#11112F]">Our Office</h3>
                  <p className="text-xs text-[#70708A] mt-1 leading-relaxed">
                    Plot No. 123, 2nd Floor, Saheed Nagar, <br />
                    Bhubaneswar, Odisha - 751007, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#11112F]">+91 98765 43210</h3>
                  <p className="text-xs text-[#70708A] mt-1">Mon – Sat, 9:00 AM – 6:00 PM</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#11112F]">support@simpldsc.in</h3>
                  <p className="text-xs text-[#70708A] mt-1">Prompt responses within 15 minutes</p>
                </div>
              </div>

              {/* Pan India Service */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#11112F]">Pan India Service</h3>
                  <p className="text-xs text-[#70708A] mt-1">We serve customers across all states & UTs</p>
                </div>
              </div>

              {/* Follow Us */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#70708A] uppercase tracking-wider mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#FAF9FF] border border-[#E5E2F0] hover:bg-[#5B2EFF] hover:text-white text-[#70708A] flex items-center justify-center transition-colors"
                  >
                    <span className="font-bold text-xs">in</span>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#FAF9FF] border border-[#E5E2F0] hover:bg-[#5B2EFF] hover:text-white text-[#70708A] flex items-center justify-center transition-colors"
                  >
                    <span className="font-bold text-xs">X</span>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#FAF9FF] border border-[#E5E2F0] hover:bg-[#5B2EFF] hover:text-white text-[#70708A] flex items-center justify-center transition-colors"
                  >
                    <span className="font-bold text-xs">YT</span>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#FAF9FF] border border-[#E5E2F0] hover:bg-[#5B2EFF] hover:text-white text-[#70708A] flex items-center justify-center transition-colors"
                  >
                    <span className="font-bold text-xs">IG</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Map Preview Card matching Screenshot 8 */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E2F0] shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#11112F]">SimplDSC Bhubaneswar</h4>
                <p className="text-xs text-[#70708A]">Saheed Nagar, Bhubaneswar, Odisha</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E2F0] shadow-card">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#11112F]">Message Sent!</h3>
                <p className="text-sm text-[#70708A] max-w-sm mx-auto">
                  Your message has been sent successfully. One of our DSC specialists will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-full bg-[#5B2EFF] text-white text-xs font-semibold hover:bg-[#4A22DE]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs font-semibold text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#16162D] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16162D] mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16162D] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16162D] mb-1.5">
                    How can we help you? *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the DSC you require or any specific queries..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-bold text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
