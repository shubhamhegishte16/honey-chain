import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Building, Save, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerProfile() {
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
      setMessage({ type: 'error', text: res.error.message || t('profileUpdateFailed') });
    } else {
      setMessage({ type: 'success', text: t('profileUpdateSuccess') });
    }
    setSaving(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>FMCG Commercial Buyer Account</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            {t('myProfile')}
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Update institutional billing details, delivery depots, and authorized procurement contacts.
          </p>
        </div>
      </div>

      {/* Avatar Card */}
      <div className="bento-card p-6 mb-6 flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-burgundy text-honeyGold font-serif text-2xl font-bold shadow-md shadow-burgundy/15">
          {profile?.name?.charAt(0)?.toUpperCase() || '?'}
        </span>
        <div>
          <p className="text-lg font-serif font-bold text-deepBrown">{profile?.name || 'Buyer Account'}</p>
          <span className="px-3 py-0.5 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold uppercase tracking-wider">
            {profile?.role || 'Buyer'} • {profile?.state || 'India'}
          </span>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
          message.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bento-card p-6 md:p-8 space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepBrown">{t('personalInformation')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('fullNameLabel')}</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('emailLabel')}</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('mobileLabel')}</label>
              <input name="mobile" type="tel" value={form.mobile} onChange={handleChange} className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('organizationLabel')}</label>
              <input name="organization" value={form.organization} onChange={handleChange} className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium" />
            </div>
          </div>
        </div>

        <div className="bento-card p-6 md:p-8 space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepBrown flex items-center gap-2">
            <MapPin size={18} className="text-burgundy" /> {t('locationLabel')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('stateLabel')}</label>
              <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('districtLabel')}</label>
              <input name="district" value={form.district} onChange={handleChange} className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-deepBrown uppercase tracking-wider mb-1.5">{t('addressLabel')}</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy font-medium resize-none" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-burgundy text-warmIvory font-bold text-xs rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Save size={16} /> {saving ? 'Updating Profile…' : 'Save Profile Changes'}
        </button>
      </form>
    </main>
  );
}
