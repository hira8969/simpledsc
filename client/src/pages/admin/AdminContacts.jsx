import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Mail, Phone, Calendar, Loader2, User } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminContacts = () => {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/admin/contacts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success && (res.data?.data || res.data?.contacts)) {
          setContacts(res.data.data || res.data.contacts);
        }
      } catch (err) {
        console.error('Failed to load contact submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#11112F]">Contact Messages & Inquiries</h1>
        <p className="text-xs text-[#70708A]">Customer queries submitted via the public contact form</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#5B2EFF] animate-spin" />
        </div>
      ) : contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl p-6 border border-[#E5E2F0] shadow-card space-y-4 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F3EFFF] text-[#5B2EFF] flex items-center justify-center font-bold text-xs">
                    {c.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#11112F]">{c.name}</h3>
                    <span className="text-[10px] text-[#70708A]">
                      {new Date(c.createdAt || Date.now()).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {c.status || 'NEW'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#70708A]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#5B2EFF]" />
                  <a href={`mailto:${c.email}`} className="text-[#5B2EFF] hover:underline">
                    {c.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#5B2EFF]" />
                  <a href={`tel:${c.phone}`} className="hover:text-[#11112F]">
                    {c.phone}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-slate-100 text-xs text-[#16162D] leading-relaxed">
                {c.message}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E2F0] text-xs text-[#70708A]">
          No customer inquiries received yet.
        </div>
      )}
    </div>
  );
};
