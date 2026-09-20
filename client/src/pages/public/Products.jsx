import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/endpoints.js';
import { Button } from '../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton.jsx';
import {
  CheckCircle2,
  FileCheck,
  Usb,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValidity, setSelectedValidity] = useState({}); // { [productId]: years }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getProducts();
        if (res?.data) {
          setProducts(res.data);
          // Set default 2 years for each product
          const defaults = {};
          res.data.forEach((p) => {
            defaults[p._id] = 2;
          });
          setSelectedValidity(defaults);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All DSCs' },
    { id: 'CLASS_3_INDIVIDUAL', label: 'Class 3 Individual' },
    { id: 'CLASS_3_ORGANIZATION', label: 'Organization DSC' },
    { id: 'DGFT', label: 'DGFT (Import/Export)' },
    { id: 'DOCUMENT_SIGNER', label: 'Document Signer' }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleValidityChange = (productId, years) => {
    setSelectedValidity((prev) => ({ ...prev, [productId]: years }));
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Subheading */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          CCA India Authorized
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Digital Signature Certificates Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Government-authorized Class 3, DGFT, and Enterprise DSCs with plug-and-play USB hardware crypto tokens.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, use case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const currentValidityYears = selectedValidity[prod._id] || 2;
            const chosenOption =
              prod.validityOptions?.find((v) => v.years === currentValidityYears) ||
              prod.validityOptions?.[0];

            return (
              <div
                key={prod._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-indigo-400 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                      {prod.hasEncryption ? 'Signing + Encryption' : 'Signing Only'}
                    </span>
                    {prod.popularTag && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                        ★ Popular
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {prod.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                      {prod.shortDescription}
                    </p>
                  </div>

                  {/* Validity Selector Buttons */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Select Validity Period
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200">
                      {(prod.validityOptions || []).map((opt) => (
                        <button
                          key={opt.years}
                          type="button"
                          onClick={() => handleValidityChange(prod._id, opt.years)}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                            currentValidityYears === opt.years
                              ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {opt.years} {opt.years === 1 ? 'Year' : 'Years'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
                          ₹{chosenOption?.discountPrice || prod.basePrice}
                        </span>
                        {chosenOption?.price > chosenOption?.discountPrice && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            ₹{chosenOption.price}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">+ 18% GST</span>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      Includes Free FIPS 140-2 Crypto Token & Courier
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-1 text-xs text-slate-600">
                    {(prod.features || []).slice(0, 4).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Documents Required count */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <FileCheck className="w-4 h-4 text-slate-400" />
                    <span>Requires: {(prod.documentsRequired || []).length} identity proofs (PAN, Aadhaar)</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-6 grid grid-cols-2 gap-2.5">
                  <Link to={`/products/${prod.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Specifications
                    </Button>
                  </Link>
                  <Link
                    to={`/dashboard/buy?product=${prod._id}&validity=${currentValidityYears}`}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-base font-bold text-slate-700">No products match your search criteria.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
