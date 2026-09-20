import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/endpoints.js';
import { Button } from '../../components/ui/Button.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Usb,
  ArrowRight,
  ArrowLeft,
  Lock,
  Award,
  HelpCircle
} from 'lucide-react';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYears, setSelectedYears] = useState(2);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await productApi.getProductBySlug(slug);
        if (res?.data) {
          setProduct(res.data);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">The certificate configuration you requested does not exist or has moved.</p>
        <Link to="/products">
          <Button variant="primary" size="sm">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const selectedOption =
    product.validityOptions?.find((v) => v.years === selectedYears) ||
    product.validityOptions?.[0] || { price: product.basePrice, discountPrice: product.basePrice };

  const gstAmount = Math.round(selectedOption.discountPrice * 0.18);
  const totalAmount = selectedOption.discountPrice + gstAmount;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Specification Column */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                {product.category?.replace(/_/g, ' ')}
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                {product.hasEncryption ? 'Signing + Encryption' : 'Signing Only'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              {product.fullDescription || product.shortDescription}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Standard Compliance</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">CCA India & IT Act</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Key Length</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">2048-bit RSA</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Delivery Mode</span>
              <span className="font-bold text-indigo-600 text-sm mt-0.5 block">FIPS USB Crypto Token</span>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900">Certificate Capabilities & Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              {(product.features || []).map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          {product.useCases && product.useCases.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900">Supported Portals & Workflows</h3>
              <div className="flex flex-wrap gap-2">
                {product.useCases.map((uc, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                  >
                    ✓ {uc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents Required */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Documents Required for Verification</h3>
            </div>
            <p className="text-xs text-slate-500">
              During the paperless application flow, you will be prompted to upload digital copies of:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              {(product.documentsRequired || []).map((doc, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  <span>{doc.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Pricing & Application Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-elevated sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Select Your Plan
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Validity Duration</h3>
            </div>

            {/* Validity Radio Buttons */}
            <div className="space-y-2">
              {(product.validityOptions || []).map((opt) => (
                <button
                  key={opt.years}
                  type="button"
                  onClick={() => setSelectedYears(opt.years)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedYears === opt.years
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {opt.years} {opt.years === 1 ? 'Year' : 'Years'} Validity
                    </p>
                    <p className="text-[11px] text-slate-400">Includes FIPS Token</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">₹{opt.discountPrice}</p>
                    {opt.price > opt.discountPrice && (
                      <p className="text-[11px] text-slate-400 line-through">₹{opt.price}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Certificate Base Fee:</span>
                <span>₹{selectedOption.discountPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18%):</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FIPS 140-2 Token & Courier:</span>
                <span className="text-emerald-600 font-semibold">FREE (₹0)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Payable:</span>
                <span className="text-indigo-600 font-sans">₹{totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={`/dashboard/buy?product=${product._id}&validity=${selectedYears}`}
                className="block"
              >
                <Button variant="primary" size="lg" className="w-full">
                  <span>Proceed to Apply</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Guarantee Note */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Money-back Guarantee if rejected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
