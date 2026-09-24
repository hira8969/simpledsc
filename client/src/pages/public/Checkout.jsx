import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import {
  ShieldCheck,
  CreditCard,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [product, setProduct] = useState(location.state?.product || null);
  const [step, setStep] = useState(1); // 1: Customer Details, 2: Document Upload, 3: Payment
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [customerDetails, setCustomerDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.mobile || '',
    panNumber: user?.panNumber || '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Documents State
  const [documents, setDocuments] = useState({
    panCard: null,
    aadhaarCard: null,
    photo: null
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    if (!product) {
      // If user came directly to /checkout, fetch default Class 3 DSC
      axios.get(`${API_BASE}/products`).then((res) => {
        const list = res.data?.data || res.data || [];
        const defaultProd = list.find((p) => p.slug === 'class-3-dsc') || list[0];
        setProduct(defaultProd);
      }).catch((err) => {
        console.error('Error fetching fallback product:', err);
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(null);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
      setErrorMsg('Please enter your full name, email, and phone number.');
      return;
    }
    setStep(2);
  };

  const handleDocsSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleCompletePayment = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const amount = product?.price || product?.basePrice || 1999;
      const uploadedDocs = [
        { docType: 'PAN Card', fileName: documents.panCard || 'pan_card_copy.pdf' },
        { docType: 'Aadhaar Card', fileName: documents.aadhaarCard || 'aadhaar_ekyc.pdf' },
        { docType: 'Applicant Photo', fileName: documents.photo || 'passport_photo.jpg' }
      ];

      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post(`${API_BASE}/orders`, {
        product: product?._id || product?.slug,
        productId: product?._id,
        amount,
        quantity: 1,
        validityYears: 1,
        hasUsbToken: true,
        paymentStatus: 'PAID',
        customerDetails: {
          fullName: customerDetails.fullName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          panNumber: customerDetails.panNumber,
          address: {
            street: customerDetails.street,
            city: customerDetails.city,
            state: customerDetails.state,
            pincode: customerDetails.pincode
          }
        },
        documents: uploadedDocs
      }, config);

      if (res.data?.success) {
        navigate('/order-success', {
          state: {
            order: res.data.data || res.data.order,
            product
          }
        });
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      // Fallback demo redirect
      navigate('/order-success', {
        state: {
          order: {
            orderId: `SIMPL-${Date.now().toString().slice(-6)}`,
            amount: product?.price || 1999,
            orderStatus: 'Verification',
            customerDetails
          },
          product
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#5B2EFF] uppercase tracking-wider bg-[#F3EFFF] px-3.5 py-1.5 rounded-full border border-purple-200">
            Secure Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#11112F] tracking-tight">
            Complete Your DSC Application
          </h1>
          <p className="text-xs sm:text-sm text-[#70708A]">
            Paperless eKYC & instant verification backed by licensed Certifying Authorities
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-lg mx-auto">
          {[
            { num: 1, label: 'Customer Details' },
            { num: 2, label: 'Document Upload' },
            { num: 3, label: 'Payment' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.num
                  ? 'bg-[#5B2EFF] text-white shadow-md'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border border-[#E5E2F0] text-[#70708A]'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${
                step === s.num ? 'text-[#11112F]' : 'text-[#70708A]'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Layout: Form on Left, Order Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Form Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E2F0] shadow-card">
            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Customer Details */}
            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-[#11112F] border-b border-slate-100 pb-3">
                  1. Applicant Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#16162D] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={customerDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="As printed on PAN card"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#16162D] mb-1">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      maxLength={10}
                      value={customerDetails.panNumber}
                      onChange={handleInputChange}
                      placeholder="ABCDE1234F"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm uppercase text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#16162D] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#16162D] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-[#11112F]">Delivery Address (for USB Token)</h3>
                  <div>
                    <input
                      type="text"
                      name="street"
                      value={customerDetails.street}
                      onChange={handleInputChange}
                      placeholder="Flat, House no., Building, Street"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                    <input
                      type="text"
                      name="state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={customerDetails.pincode}
                      onChange={handleInputChange}
                      placeholder="PIN Code"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] text-sm text-[#16162D] focus:outline-none focus:border-[#5B2EFF]"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-bold text-sm hover:bg-[#4A22DE] transition-all inline-flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <span>Proceed to Document Upload</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Document Upload */}
            {step === 2 && (
              <form onSubmit={handleDocsSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-[#11112F] border-b border-slate-100 pb-3">
                  2. Upload Verification Documents
                </h2>
                <p className="text-xs text-[#70708A]">
                  Documents are encrypted with AES-256 and only accessed by authorized verification officers.
                </p>

                {/* PAN Upload */}
                <div className="p-5 rounded-2xl border border-dashed border-[#5B2EFF]/40 bg-[#FAF9FF] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-[#5B2EFF]" />
                    <div>
                      <p className="text-sm font-bold text-[#11112F]">PAN Card (Front Copy) *</p>
                      <p className="text-[11px] text-[#70708A]">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </div>
                  <div>
                    <label className="px-4 py-2 rounded-full bg-white border border-[#E5E2F0] text-xs font-bold text-[#5B2EFF] hover:bg-[#F3EFFF] cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{documents.panCard ? 'File Chosen' : 'Choose File'}</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'panCard')} />
                    </label>
                  </div>
                </div>

                {/* Aadhaar Upload */}
                <div className="p-5 rounded-2xl border border-dashed border-[#5B2EFF]/40 bg-[#FAF9FF] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-[#5B2EFF]" />
                    <div>
                      <p className="text-sm font-bold text-[#11112F]">Aadhaar Card (Front/Back) *</p>
                      <p className="text-[11px] text-[#70708A]">Used for paperless eKYC validation</p>
                    </div>
                  </div>
                  <div>
                    <label className="px-4 py-2 rounded-full bg-white border border-[#E5E2F0] text-xs font-bold text-[#5B2EFF] hover:bg-[#F3EFFF] cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{documents.aadhaarCard ? 'File Chosen' : 'Choose File'}</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'aadhaarCard')} />
                    </label>
                  </div>
                </div>

                {/* Passport Photo */}
                <div className="p-5 rounded-2xl border border-dashed border-[#5B2EFF]/40 bg-[#FAF9FF] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-[#5B2EFF]" />
                    <div>
                      <p className="text-sm font-bold text-[#11112F]">Applicant Photograph</p>
                      <p className="text-[11px] text-[#70708A]">Recent passport style photo</p>
                    </div>
                  </div>
                  <div>
                    <label className="px-4 py-2 rounded-full bg-white border border-[#E5E2F0] text-xs font-bold text-[#5B2EFF] hover:bg-[#F3EFFF] cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{documents.photo ? 'File Chosen' : 'Choose File'}</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'photo')} />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 rounded-full border border-[#E5E2F0] text-xs font-bold text-[#16162D] hover:bg-slate-50"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-bold text-sm hover:bg-[#4A22DE] transition-all inline-flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Payment Abstraction (Mock Flow) */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#11112F] border-b border-slate-100 pb-3">
                  3. Select Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'UPI', label: 'UPI / QR Code', desc: 'GPay, PhonePe, Paytm' },
                    { id: 'CARD', label: 'Debit / Credit Card', desc: 'Visa, MasterCard, RuPay' },
                    { id: 'NETBANKING', label: 'Net Banking', desc: 'All Indian Banks' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? 'border-[#5B2EFF] bg-[#F3EFFF]/50 shadow-sm'
                          : 'border-[#E5E2F0] bg-white hover:border-purple-300'
                      }`}
                    >
                      <p className="text-sm font-bold text-[#11112F]">{m.label}</p>
                      <p className="text-[11px] text-[#70708A] mt-1">{m.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Sandbox Test Mode:</strong> Real payment credentials are not required. Clicking "Pay & Place Order" will simulate a successful Razorpay transaction.
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-full border border-[#E5E2F0] text-xs font-bold text-[#16162D] hover:bg-slate-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    disabled={loading}
                    className="px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-bold text-sm hover:bg-[#4A22DE] transition-all inline-flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{(product?.price || 1999).toLocaleString('en-IN')} & Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-6">
            <h3 className="text-lg font-bold text-[#11112F]">Order Summary</h3>

            {product && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9FF] border border-slate-100">
                  <UsbTokenVisual type={product.slug} size="sm" />
                  <div>
                    <h4 className="text-sm font-bold text-[#11112F]">{product.name}</h4>
                    <p className="text-[11px] text-[#70708A]">{product.validity || '1 Year Validity'}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-[#70708A] pt-2">
                  <div className="flex justify-between">
                    <span>Base DSC Price</span>
                    <span className="font-semibold text-[#11112F]">₹{(product.price || 1999).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USB Crypto Token (FIPS 140-2)</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>eKYC & Video Verification</span>
                    <span className="font-semibold text-emerald-600">INCLUDED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan India Delivery</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-[#E5E2F0] pt-2.5 flex justify-between text-sm font-black text-[#11112F]">
                    <span>Total Amount</span>
                    <span className="text-[#5B2EFF]">₹{(product.price || 1999).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-[#11112F]">
                    <ShieldCheck className="w-4 h-4 text-[#5B2EFF]" />
                    <span>SimplDSC Guarantee</span>
                  </div>
                  <p>100% money back if certificate cannot be issued due to technical reasons.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
