import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Class 2 DSC', 'Class 3 DSC', 'DGFT', 'eTender', 'MCA'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedCategory === 'All'
        ? `${API_BASE}/products`
        : `${API_BASE}/products?category=${encodeURIComponent(selectedCategory)}`;
      
      const res = await axios.get(url);
      if (res.data?.success && res.data?.data) {
        setProducts(res.data.data);
      } else {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Unable to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getTokenBrand = (slug, category) => {
    const s = (slug || '').toLowerCase();
    const c = (category || '').toLowerCase();
    if (s.includes('dgft') || c.includes('dgft')) return 'vsign';
    if (s.includes('tender') || c.includes('tender')) return 'capsigns';
    if (s.includes('mca') || c.includes('mca')) return 'ncode';
    if (s.includes('signer') || c.includes('signer')) return 'emudhra';
    return 'epass2003';
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#16162D] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11112F] tracking-tight">
            Our DSC Products
          </h1>
          <p className="text-base sm:text-lg text-[#70708A]">
            Choose from a range of Digital Signature Certificates issued by government-authorized Certifying Authorities.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5B2EFF] text-white shadow-md'
                  : 'bg-white border border-[#E5E2F0] text-[#70708A] hover:text-[#16162D] hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
            <p className="text-sm font-medium text-[#70708A]">Loading products from server...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Product Cards Grid (Matching reference screenshot 3) */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const tokenType = getTokenBrand(product.slug, product.category);
              return (
                <div
                  key={product._id || product.slug}
                  className="bg-white rounded-3xl p-7 border border-[#E5E2F0] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Title & Short Description */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#11112F]">{product.name}</h3>
                        {product.isPopular && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3EFFF] text-[#5B2EFF] border border-purple-200">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#70708A] mt-1.5 min-h-[36px]">
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    {/* Realistic USB Token Visual with subtle hover tilt */}
                    <div className="py-6 flex items-center justify-center bg-[#FAF9FF] rounded-2xl border border-slate-100 group-hover:bg-[#F3EFFF]/40 transition-colors">
                      <UsbTokenVisual type={tokenType} size="md" />
                    </div>
                  </div>

                  {/* Price, Validity & View Details Link */}
                  <div className="pt-6 border-t border-[#E5E2F0] flex items-center justify-between mt-4">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#11112F]">
                          ₹{(product.price || product.basePrice || 1499).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#70708A] font-medium">
                        ({product.validity || '1 Year Validity'})
                      </span>
                    </div>

                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B2EFF] group-hover:text-[#4A22DE] transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E2F0] p-8 max-w-md mx-auto">
            <p className="text-base font-bold text-[#11112F]">No products found</p>
            <p className="text-xs text-[#70708A] mt-1">Try selecting a different category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
