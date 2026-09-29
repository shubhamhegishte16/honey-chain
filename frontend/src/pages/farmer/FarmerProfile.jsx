import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Building, Save, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function FarmerProfile() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    mobile: profile?.mobile || '',
    organization: profile?.organization || '',
    state: profile?.state || '',
    district: profile?.district || '',
    address: profile?.address || '',
    farmSize: profile?.farmSize || '65 Bee Boxes',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    if (res.error) {
      setMessage({ type: 'error', text: res.error.message || t('profileUpdateFailed', 'Update failed') });
    } else {
      setMessage({ type: 'success', text: t('profileUpdateSuccess', 'Profile updated successfully!') });
    }
    setSaving(false);
  };

  return (
    <main className="page-shell max-w-3xl mx-auto">
      
      {/* ─── Header ─── */}
      <div className="mb-6">
        <span className="eyebrow"><User size={13} /> Account Credentials</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#281D1C] mt-1">
          Beekeeper &amp; Apiary Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#5E524D] mt-1">
          Registered with the National Bee Board (NBB) &amp; KVIC Honey Mission Cluster Registry.
        </p>
      </div>

      {/* Avatar Bento Card */}
      <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-[#E8E3CF] shadow-card mb-6 animate-enter">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#861C1C] text-white text-2xl font-bold font-serif shadow-sm">
          {profile?.name?.charAt(0)?.toUpperCase() || 'R'}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold font-serif text-[#281D1C]">{profile?.name || 'Ramesh Singh'}</p>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              KVIC Verified ✔
            </span>
          </div>
          <p className="text-xs text-[#5E524D] capitalize mt-0.5">
            {profile?.role || 'Beekeeper'} • {profile?.district || 'Bharatpur'}, {profile?.state || 'Rajasthan'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-enter delay-1">
        
        {/* Personal Details */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <h3 className="font-bold font-serif text-base text-[#281D1C] mb-4">Personal &amp; Contact Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">{t('fullNameLabel', 'Full Name')}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">{t('emailLabel', 'Email Address')}</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">{t('mobileLabel', 'Mobile Number')}</label>
              <input
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">{t('organizationLabel', 'Co-operative / Cluster')}</label>
              <input
                name="organization"
                value={form.organization}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
              />
            </div>
          </div>
        </div>

        {/* Location & Apiary Setup */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E3CF] shadow-card">
          <h3 className="font-bold font-serif text-base text-[#281D1C] flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[#861C1C]" /> Apiary &amp; Geographic Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">District</label>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#281D1C] mb-1.5">Apiary Base Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E3CF] bg-[#FAF7EE] text-xs sm:text-sm text-[#281D1C] focus:outline-none focus:border-[#861C1C] focus:bg-white shadow-soft resize-none"
              />
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'error'
              ? 'bg-[#FBEBEB] text-[#861C1C] border border-[#861C1C]/30'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
          }`}>
            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#861C1C] text-white font-bold text-xs sm:text-sm shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </main>
  );
}
