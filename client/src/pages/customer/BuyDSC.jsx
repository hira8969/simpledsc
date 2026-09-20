import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import {
  productApi,
  applicationApi,
  orderApi,
  paymentApi,
  documentApi
} from '../../api/endpoints.js';
import { Stepper } from '../../components/ui/Stepper.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FileUploader } from '../../components/ui/FileUploader.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  Building,
  User,
  MapPin,
  Usb,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  Check
} from 'lucide-react';

export const BuyDSC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const preselectedProdId = searchParams.get('product');
  const preselectedValidity = parseInt(searchParams.get('validity'), 10) || 2;

  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Wizard Form State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedValidity, setSelectedValidity] = useState(preselectedValidity);

  // Step 2: Personal
  const [personal, setPersonal] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    panNumber: user?.panNumber || '',
    dateOfBirth: '1990-05-15',
    gender: 'MALE'
  });

  // Step 3: Address
  const [address, setAddress] = useState({
    street: user?.address?.street || '45/B, Brigade Road',
    city: user?.address?.city || 'Bangalore',
    state: user?.address?.state || 'Karnataka',
    pincode: user?.address?.pincode || '560001',
    country: 'India'
  });

  // Step 4: Organization (if applicable)
  const [organization, setOrganization] = useState({
    companyName: user?.companyName || '',
    gstin: user?.gstin || '',
    cin: '',
    designation: 'Director'
  });

  // Step 5: Documents
  const [documents, setDocuments] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Created Records
  const [createdApplication, setCreatedApplication] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInitiation, setPaymentInitiation] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [completedPaymentData, setCompletedPaymentData] = useState(null);

  // Load products on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await productApi.getProducts();
        if (res?.data && res.data.length > 0) {
          setProducts(res.data);
          if (preselectedProdId) {
            const found = res.data.find((p) => p._id === preselectedProdId);
            if (found) setSelectedProduct(found);
            else setSelectedProduct(res.data[0]);
          } else {
            setSelectedProduct(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [preselectedProdId]);

  const steps = [
    { title: 'Select Product' },
    { title: 'Personal Details' },
    { title: 'Address Details' },
    { title: 'Organization' },
    { title: 'Upload Documents' },
    { title: 'Review & Pay' }
  ];

  // Pricing calculations
  const chosenOption =
    selectedProduct?.validityOptions?.find((v) => v.years === selectedValidity) ||
    selectedProduct?.validityOptions?.[0] || { price: 1799, discountPrice: 1799 };

  const basePrice = chosenOption.discountPrice || selectedProduct?.basePrice || 1799;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  const isOrgType =
    selectedProduct?.category === 'CLASS_3_ORGANIZATION' ||
    selectedProduct?.category === 'DGFT' ||
    selectedProduct?.category === 'DOCUMENT_SIGNER';

  // Handle Document Upload
  const handleFileSelect = async (docType, file) => {
    if (!file) {
      setDocuments((prev) => {
        const next = { ...prev };
        delete next[docType];
        return next;
      });
      return;
    }

    try {
      setUploadProgress((prev) => ({ ...prev, [docType]: 10 }));
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', docType);

      // Simulate local upload state
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [docType]: 100 }));
        setDocuments((prev) => ({
          ...prev,
          [docType]: {
            originalName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            documentType: docType,
            file
          }
        }));
        success(`${docType.replace(/_/g, ' ')} uploaded successfully`);
      }, 500);
    } catch (err) {
      error(`Failed to upload: ${err.message}`);
    }
  };

  // Step validation
  const validateCurrentStep = () => {
    if (currentStep === 0 && !selectedProduct) {
      error('Please select a certificate product.');
      return false;
    }
    if (currentStep === 1) {
      if (!personal.fullName || !personal.mobile || !personal.panNumber) {
        error('Please complete Full Name, Mobile, and PAN Number.');
        return false;
      }
      if (personal.panNumber.length !== 10) {
        error('Please enter a valid 10-character PAN number.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!address.street || !address.city || !address.state || !address.pincode) {
        error('Please fill in complete address and PIN code.');
        return false;
      }
      if (address.pincode.length !== 6) {
        error('PIN Code must be exactly 6 digits.');
        return false;
      }
    }
    if (currentStep === 3 && isOrgType) {
      if (!organization.companyName || !organization.designation) {
        error('Company name and designation are required for Organization certificates.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Order & Application Creation
  const handleCreateOrder = async () => {
    setSubmitting(true);
    try {
      // 1. Submit Application
      const appPayload = {
        productId: selectedProduct._id,
        validityYears: selectedValidity,
        personalDetails: {
          name: personal.fullName,
          email: personal.email,
          mobile: personal.mobile,
          panNumber: personal.panNumber.toUpperCase(),
          dateOfBirth: personal.dateOfBirth,
          gender: personal.gender
        },
        addressDetails: address,
        organizationDetails: isOrgType ? organization : undefined
      };

      const appRes = await applicationApi.createApplication(appPayload);
      const app = appRes.data;
      setCreatedApplication(app);

      // 2. Create Order
      const orderPayload = {
        productId: selectedProduct._id,
        applicationId: app._id,
        validityYears: selectedValidity
      };

      const orderRes = await orderApi.createOrder(orderPayload);
      const order = orderRes.data;
      setCreatedOrder(order);

      // 3. Initiate Payment
      const payRes = await paymentApi.initiatePayment(order.orderId);
      setPaymentInitiation(payRes.data);
      setShowPaymentModal(true);
    } catch (err) {
      error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Verify Payment on Backend
  const handleSimulatePayment = async () => {
    if (!paymentInitiation || !createdOrder) return;
    setPaymentProcessing(true);

    try {
      // Mock payment verification payload with cryptographic dummy signature
      const verificationPayload = {
        orderId: createdOrder.orderId,
        paymentId: paymentInitiation.paymentOrderId || `pay_${Date.now()}`,
        signature: `mock_signature_valid_${Date.now()}`
      };

      const verifyRes = await paymentApi.verifyPayment(verificationPayload);
      setCompletedPaymentData(verifyRes.data);
      setShowPaymentModal(false);
      success('Payment received and verified successfully!');
    } catch (err) {
      error(err.message || 'Payment verification failed on backend.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ==========================================
  // FINAL CONFIRMATION SUCCESS SCREEN
  // ==========================================
  if (completedPaymentData) {
    const { order, transaction } = completedPaymentData;

    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            Application Submitted Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your payment has been cryptographically verified. An official confirmation has been sent to your WhatsApp and email.
          </p>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card text-left space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-slate-400">Order ID:</span>
            <span className="font-mono font-bold text-indigo-600 text-sm">{order?.orderId}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-mono font-bold text-slate-800">{transaction?.transactionId || `TXN-${Date.now()}`}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-slate-400">Product:</span>
            <span className="font-semibold text-slate-900">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">₹{order?.totalAmount || totalAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Payment Date:</span>
            <span className="font-semibold text-slate-800">
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to={`/dashboard/orders/${order?.orderId}`} className="flex-1">
            <Button variant="primary" size="lg" className="w-full">
              <span>Track KYC Status</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/dashboard/invoices" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              <span>Download Tax Invoice</span>
            </Button>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400">
          Our compliance officer is reviewing your KYC proofs. You will receive an SMS and WhatsApp notification once approved.
        </p>
      </div>
    );
  }

  // ==========================================
  // MULTI-STEP APPLICATION WIZARD
  // ==========================================
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Paperless DSC Issuance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Apply for Digital Signature Certificate
        </h1>
        <p className="text-xs text-slate-500">
          Follow the steps below to apply and verify your identity in minutes.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <Stepper steps={steps} activeStep={currentStep} />
      </div>

      {/* Form Steps Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* STEP 1: Product Selection */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 1: Choose Certificate & Validity</h3>
              <span className="text-xs text-slate-400">All prices exclude 18% GST</span>
            </div>

            {/* Product selection list */}
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    selectedProduct?._id === p._id
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{p.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {p.hasEncryption ? 'Signing + Encryption' : 'Signing Only'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{p.shortDescription}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-base font-extrabold text-slate-900 font-sans">
                      ₹{p.validityOptions?.find((v) => v.years === selectedValidity)?.discountPrice || p.basePrice}
                    </span>
                    <span className="text-[11px] text-slate-400 block">/ {selectedValidity} Year(s)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Validity selector */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Select Validity Term
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedValidity(yr)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      selectedValidity === yr
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 2: Applicant Identity Details</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Must strictly match your Income Tax Permanent Account Number (PAN) records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Legal Name (as on PAN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  PAN Number (10 Characters) *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="ABCPS1234F"
                  value={personal.panNumber}
                  onChange={(e) => setPersonal({ ...personal, panNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (Aadhaar Linked) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={personal.mobile}
                  onChange={(e) => setPersonal({ ...personal, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="applicant@example.com"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={personal.dateOfBirth}
                  onChange={(e) => setPersonal({ ...personal, dateOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Gender
                </label>
                <select
                  value={personal.gender}
                  onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Address Details */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 3: Residential / Delivery Address</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The cryptographic FIPS USB token will be delivered to this address via express courier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Street Address / Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Lotus Tower, 1st Cross"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bangalore"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Karnataka"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  PIN Code (6 digits) *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="560001"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Country
                </label>
                <input
                  type="text"
                  readOnly
                  value="India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-600 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Organization Details (Only if applicable) */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 4: Organization Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOrgType
                  ? 'Mandatory corporate entity details for Organization / DGFT DSC.'
                  : 'Optional: Enter company name and GSTIN if you need a business tax invoice for GST credit.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company / Firm Legal Name {isOrgType && '*'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sharma Global Advisory LLP"
                  value={organization.companyName}
                  onChange={(e) => setOrganization({ ...organization, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company GSTIN (15 Digits)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="29ABCPS1234F1Z5"
                  value={organization.gstin}
                  onChange={(e) => setOrganization({ ...organization, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Corporate Identification Number (CIN / LLPIN)
                </label>
                <input
                  type="text"
                  placeholder="U74999KA2026PTC123456"
                  value={organization.cin}
                  onChange={(e) => setOrganization({ ...organization, cin: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Applicant Designation {isOrgType && '*'}
                </label>
                <input
                  type="text"
                  placeholder="Director / Partner / Proprietor"
                  value={organization.designation}
                  onChange={(e) => setOrganization({ ...organization, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Documents Upload */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 5: KYC Verification Proofs</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload clear color scans or photos. Maximum 10MB per file (PDF, JPG, PNG).
              </p>
            </div>

            <div className="space-y-4">
              <FileUploader
                label="1. Applicant PAN Card *"
                description="Clear color image or PDF of front of PAN card"
                documentType="PAN_CARD"
                uploadedFile={documents['PAN_CARD']}
                uploadProgress={uploadProgress['PAN_CARD'] || 0}
                onFileSelect={handleFileSelect}
              />

              <FileUploader
                label="2. Aadhaar Card (Front / Full) *"
                description="UIDAI Aadhaar front side or eAadhaar PDF"
                documentType="AADHAAR_FRONT"
                uploadedFile={documents['AADHAAR_FRONT']}
                uploadProgress={uploadProgress['AADHAAR_FRONT'] || 0}
                onFileSelect={handleFileSelect}
              />

              <FileUploader
                label="3. Passport Size Photograph *"
                description="White background recent face photo"
                documentType="PHOTO"
                uploadedFile={documents['PHOTO']}
                uploadProgress={uploadProgress['PHOTO'] || 0}
                onFileSelect={handleFileSelect}
              />

              {isOrgType && (
                <>
                  <FileUploader
                    label="4. Company GST Certificate / Incorporation Certificate *"
                    description="Official proof of business registration"
                    documentType="GST_CERTIFICATE"
                    uploadedFile={documents['GST_CERTIFICATE']}
                    uploadProgress={uploadProgress['GST_CERTIFICATE'] || 0}
                    onFileSelect={handleFileSelect}
                  />

                  <FileUploader
                    label="5. Board Resolution / Authorization Letter *"
                    description="Signed authorization by board on company letterhead"
                    documentType="BOARD_RESOLUTION"
                    uploadedFile={documents['BOARD_RESOLUTION']}
                    uploadProgress={uploadProgress['BOARD_RESOLUTION'] || 0}
                    onFileSelect={handleFileSelect}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Review & Order Creation */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 6: Review Application & Order Summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Please verify your details before proceeding to the secure payment gateway.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Applicant Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 uppercase text-[11px]">Applicant Details</p>
                <p><span className="text-slate-400">Name:</span> <strong>{personal.fullName}</strong></p>
                <p><span className="text-slate-400">PAN:</span> <strong>{personal.panNumber}</strong></p>
                <p><span className="text-slate-400">Mobile:</span> +91 {personal.mobile}</p>
                <p><span className="text-slate-400">Email:</span> {personal.email}</p>
              </div>

              {/* Delivery Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 uppercase text-[11px]">Courier Delivery</p>
                <p><span className="text-slate-400">Address:</span> {address.street}</p>
                <p><span className="text-slate-400">City, State:</span> {address.city}, {address.state} - {address.pincode}</p>
                <p><span className="text-slate-400">Hardware:</span> <span className="text-indigo-600 font-bold">FIPS 140-2 USB Crypto Token</span></p>
              </div>
            </div>

            {/* Price Itemization */}
            <div className="p-5 rounded-2xl bg-[#F8F9FE] border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>{selectedProduct?.name} ({selectedValidity} Year Validity):</span>
                <span className="font-semibold">₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>GST @ 18% (HSN 998313):</span>
                <span className="font-semibold">₹{gstAmount}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>FIPS 140-2 Level 2 Crypto Token:</span>
                <span className="text-emerald-600 font-bold">FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Express Insured Courier:</span>
                <span className="text-emerald-600 font-bold">FREE (₹0)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount Payable:</span>
                <span className="text-indigo-600 font-sans text-base">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <Button
            variant="ghost"
            size="md"
            onClick={handleBack}
            disabled={currentStep === 0 || submitting}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateOrder}
              isLoading={submitting}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Proceed to Pay ₹{totalAmount}</span>
            </Button>
          )}
        </div>
      </div>

      {/* PAYMENT GATEWAY MODAL (Razorpay-style Indian Fintech UI) */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => !paymentProcessing && setShowPaymentModal(false)}
        title="SimplDSC Secure Payment Gateway"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Order Reference</p>
              <p className="font-mono font-bold text-indigo-700 text-sm">{createdOrder?.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Total Payable</p>
              <p className="font-sans font-extrabold text-slate-900 text-base">₹{totalAmount}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Available Payment Methods
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl border border-indigo-600 bg-indigo-50/40 text-center font-bold text-indigo-900">
                UPI / QR
              </div>
              <div className="p-3 rounded-xl border border-slate-200 text-center text-slate-600">
                Net Banking
              </div>
              <div className="p-3 rounded-xl border border-slate-200 text-center text-slate-600">
                Cards / EMI
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-center">
              <p className="text-xs font-semibold text-slate-700">UPI Instant Payment</p>
              <p className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
              <div className="w-28 h-28 mx-auto bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-mono">
                    [QR CODE]
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <strong>Development Sandbox:</strong> Backend cryptographic payment verification will be validated securely. Click below to simulate an approved transaction.
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            isLoading={paymentProcessing}
            onClick={handleSimulatePayment}
          >
            <Check className="w-4 h-4 mr-2 stroke-[3]" />
            <span>Simulate Successful Payment (₹{totalAmount})</span>
          </Button>
        </div>
      </Modal>
    </div>
  );
};
