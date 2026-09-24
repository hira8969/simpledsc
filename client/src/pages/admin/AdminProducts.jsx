import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { UsbTokenVisual } from '../../components/ui/UsbTokenVisual.jsx';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Class 3 DSC',
    price: 1999,
    validity: '1 Year',
    shortDescription: '',
    description: '',
    featuresText: 'Aadhaar eKYC\nPAN Verification\nPriority Support',
    isPopular: false,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/products`);
      if (res.data?.success && res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Class 3 DSC',
      price: 1999,
      validity: '1 Year',
      shortDescription: '',
      description: '',
      featuresText: 'Aadhaar eKYC\nPAN Verification\nPriority Support',
      isPopular: false,
      isActive: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price || prod.basePrice,
      validity: prod.validity || '1 Year',
      shortDescription: prod.shortDescription || '',
      description: prod.description || prod.fullDescription || '',
      featuresText: (prod.features || []).join('\n'),
      isPopular: prod.isPopular || false,
      isActive: prod.isActive !== undefined ? prod.isActive : true
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        basePrice: Number(formData.price),
        validity: formData.validity,
        shortDescription: formData.shortDescription,
        description: formData.description,
        fullDescription: formData.description,
        features: formData.featuresText.split('\n').filter((f) => f.trim()),
        isPopular: formData.isPopular,
        isActive: formData.isActive
      };

      if (editingProduct) {
        await axios.put(`${API_BASE}/products/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggleStatus = async (prod) => {
    try {
      await axios.put(
        `${API_BASE}/products/${prod._id}`,
        { isActive: !prod.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#11112F]">DSC Product Catalog</h1>
          <p className="text-xs text-[#70708A]">Create, modify, and activate certificate offerings</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-6 py-2.5 rounded-full bg-[#5B2EFF] text-white text-xs font-bold hover:bg-[#4A22DE] transition-all inline-flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E2F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#16162D]">
              <thead className="bg-[#FAF9FF] border-b border-[#E5E2F0] uppercase text-[11px] font-bold text-[#70708A]">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UsbTokenVisual type={prod.slug} size="sm" />
                        <div>
                          <p className="font-bold text-sm text-[#11112F]">{prod.name}</p>
                          <p className="text-[11px] text-[#70708A] max-w-xs truncate">
                            {prod.shortDescription || prod.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#5B2EFF]">
                      {prod.category}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      ₹{(prod.price || prod.basePrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-[#70708A]">
                      {prod.validity || '1 Year'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          prod.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {prod.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg border border-[#E5E2F0] hover:bg-slate-100 text-[#16162D]"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E5E2F0] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#11112F]">
                {editingProduct ? 'Edit Product' : 'Add New DSC Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-[#16162D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Class 3 DSC - Individual"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                  >
                    <option value="Class 2 DSC">Class 2 DSC</option>
                    <option value="Class 3 DSC">Class 3 DSC</option>
                    <option value="DGFT">DGFT</option>
                    <option value="eTender">eTender</option>
                    <option value="MCA">MCA</option>
                    <option value="Document Signer">Document Signer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Validity Period</label>
                <input
                  type="text"
                  value={formData.validity}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  placeholder="e.g. 1 Year"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Features (One per line)</label>
                <textarea
                  rows="3"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  />
                  <span>Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-full border border-[#E5E2F0] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-[#5B2EFF] text-white font-bold text-xs hover:bg-[#4A22DE] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
