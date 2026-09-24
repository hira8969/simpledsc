import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Plus, Edit, Trash2, HelpCircle, Loader2, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminFAQs = () => {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/faqs`);
      if (res.data?.success && res.data?.data) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'General', order: faqs.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      order: faq.order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingFaq) {
        await axios.put(`${API_BASE}/faqs/${editingFaq._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE}/faqs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setModalOpen(false);
      fetchFaqs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ question?')) return;
    try {
      await axios.delete(`${API_BASE}/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFaqs();
    } catch (err) {
      alert('Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#11112F]">Manage FAQs</h1>
          <p className="text-xs text-[#70708A]">Update public questions, compliance explanations, and documentation</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-6 py-2.5 rounded-full bg-[#5B2EFF] text-white text-xs font-bold hover:bg-[#4A22DE] transition-all inline-flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E2F0] shadow-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={faq._id || idx} className="p-6 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3EFFF] text-[#5B2EFF]">
                      {faq.category || 'General'}
                    </span>
                    <h3 className="text-sm font-bold text-[#11112F]">{faq.question}</h3>
                  </div>
                  <p className="text-xs text-[#70708A] leading-relaxed pl-1">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1.5 rounded-lg border border-[#E5E2F0] hover:bg-slate-100 text-[#16162D]"
                    title="Edit FAQ"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E5E2F0] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#11112F]">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What documents are required?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Usage, Documentation, Process"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Answer *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed answer text..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2F0] bg-[#FAF9FF] focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
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
                  className="px-6 py-2 rounded-full bg-[#5B2EFF] text-white font-bold text-xs hover:bg-[#4A22DE]"
                >
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
