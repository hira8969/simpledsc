import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import {
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  PhoneCall,
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/products/${slug}`);
      if (res.data?.success && res.data?.data) {
        setProduct(res.data.data);
      } else {
        setProduct(res.data);
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
      setError('Product not found or unable to load.');
    } finally {
      setLoading(false);
    }
  };

  const getTokenBrand = (productSlug, category) => {
    const s = (productSlug || '').toLowerCase();
    const c = (category || '').toLowerCase();
    if (s.includes('dgft') || c.includes('dgft')) return 'vsign';
    if (s.includes('tender') || c.includes('tender')) return 'capsigns';
    if (s.includes('mca') || c.includes('mca')) return 'ncode';
    if (s.includes('signer') || c.includes('signer')) return 'emudhra';
    return 'epass2003';
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
        <p className="text-sm font-medium text-[#70708A]">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5E2F0] text-center space-y-4 shadow-card">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-[#11112F]">Product Not Found</h2>
          <p className="text-xs text-[#70708A]">{error || 'The requested DSC product is unavailable.'}</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-[#5B2EFF] text-white text-xs font-semibold hover:bg-[#4A22DE]"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const tokenType = getTokenBrand(product.slug, product.category);

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#70708A]">
          <Link to="/" className="hover:text-[#5B2EFF]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#5B2EFF]">Products</Link>
          <span>/</span>
          <span className="text-[#11112F]">{product.name}</span>
        </div>

        {/* Product Overview Top Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[#E5E2F0] shadow-card grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-10 bg-[#FAF9FF] rounded-2xl border border-slate-100 relative">
            {product.isPopular && (
              <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-[#5B2EFF] text-white">
                Most Popular
              </span>
            )}
            <UsbTokenVisual type={tokenType} size="hero" />
            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-[#70708A]">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#5B2EFF]" /> FIPS 140-2 Level 2
              </span>
              <span>•</span>
              <span>2048-Bit RSA</span>
            </div>
          </div>

          {/* Right Product Details & Buy Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B2EFF] bg-[#F3EFFF] px-3 py-1 rounded-full border border-purple-200">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#11112F] tracking-tight mt-3">
                {product.name}
              </h1>
              <p className="text-sm text-[#70708A] mt-2 leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Price & Validity */}
            <div className="p-5 rounded-2xl bg-[#FAF9FF] border border-[#E5E2F0] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#70708A] font-semibold">Total Price (incl. token & support)</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#11112F]">
                    ₹{(product.price || product.basePrice || 1499).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-[#70708A]">
                    / {product.validity || '1 Year Validity'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Zap className="w-3.5 h-3.5" /> Instant eKYC
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleBuyNow}
                className="px-8 py-3.5 rounded-full bg-[#5B2EFF] text-white font-semibold text-sm hover:bg-[#4A22DE] transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2 group active:scale-95"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full border border-[#E5E2F0] bg-white text-[#16162D] font-semibold text-sm hover:bg-slate-50 transition-all duration-200 shadow-sm inline-flex items-center gap-2 active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-[#5B2EFF]" />
                <span>Talk to Expert</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Features, Suitable For, Required Documents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Key Features */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-4">
            <div className="flex items-center gap-2.5 text-[#11112F] font-bold text-lg">
              <ShieldCheck className="w-5 h-5 text-[#5B2EFF]" />
              <h3>Key Features</h3>
            </div>
            <ul className="space-y-3">
              {(product.features && product.features.length > 0 ? product.features : [
                'Aadhaar eKYC Paperless Verification',
                'PAN Card instant verification',
                '2048-bit RSA Encryption',
                'IT Act 2000 compliant',
                'Free remote installation guidance'
              ]).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#16162D]">
                  <CheckCircle2 className="w-4 h-4 text-[#5B2EFF] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suitable For */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-4">
            <div className="flex items-center gap-2.5 text-[#11112F] font-bold text-lg">
              <Zap className="w-5 h-5 text-[#5B2EFF]" />
              <h3>Who Should Buy</h3>
            </div>
            <ul className="space-y-3">
              {(product.suitableFor && product.suitableFor.length > 0 ? product.suitableFor : [
                'Individuals filing Income Tax Returns',
                'Directors registering DIN on MCA V3',
                'Chartered Accountants and Tax Professionals',
                'Entrepreneurs forming new companies'
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#16162D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B2EFF] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card space-y-4">
            <div className="flex items-center gap-2.5 text-[#11112F] font-bold text-lg">
              <FileText className="w-5 h-5 text-[#5B2EFF]" />
              <h3>Required Documents</h3>
            </div>
            <ul className="space-y-3">
              {(product.requiredDocuments && product.requiredDocuments.length > 0 ? product.requiredDocuments : [
                'Applicant PAN Card (Scanned copy)',
                'Aadhaar Card (Mobile OTP verification)',
                'Passport Size Photograph',
                'Active Mobile Number & Email ID'
              ]).map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#16162D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
