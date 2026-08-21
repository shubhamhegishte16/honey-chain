import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Building, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    farmSize: profile?.farmSize || '5 Acres',
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
    // ponytail: PUT to /auth/profile — if it exists. Otherwise PATCH user.
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    if (res.error) {
      setMessage({ type: 'error', text: res.error.message || t('profileUpdateFailed') });
    } else {
      setMessage({ type: 'success', text: t('profileUpdateSuccess') });
    }
    setSaving(false);
  };

  return (
    <main className="page-shell max-w-2xl mx-auto">
      <div className="section-heading mb-6">
        <div>
          <p className="eyebrow text-primary"><User size={13} /> {t('account')}</p>
          <h1 className="text-2xl font-extrabold text-textPrimary">{t('myProfile')}</h1>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 animate-enter">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primaryLight text-primary text-2xl font-bold">
          {profile?.name?.charAt(0)?.toUpperCase() || '?'}
        </span>
        <div>
          <p className="text-lg font-bold text-textPrimary">{profile?.name}</p>
          <p className="text-sm text-textSecondary capitalize">{profile?.role} • {profile?.state || 'India'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-enter delay-1">
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary mb-4">{t('personalInformation')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('fullNameLabel')}</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('emailLabel')}</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('mobileLabel')}</label>
              <input name="mobile" type="tel" value={form.mobile} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('organizationLabel')}</label>
              <input name="organization" value={form.organization} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <h3 className="font-bold text-textPrimary flex items-center gap-2 mb-4"><MapPin size={16} className="text-primary" /> {t('locationLabel')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('stateLabel')}</label>
              <input name="state" value={form.state} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('districtLabel')}</label>
              <input name="district" value={form.district} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-textSecondary mb-1">{t('addressLabel')}</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows="2" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
            message.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow hover:bg-primaryDark transition-all disabled:opacity-60"
        >
          {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={16} />}
          {t('saveChanges')}
        </button>
      </form>
    </main>
  );
}
