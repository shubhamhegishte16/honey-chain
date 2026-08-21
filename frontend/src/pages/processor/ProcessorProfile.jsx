import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Building, ShieldCheck } from 'lucide-react';

export default function ProcessorProfile() {
  const { profile } = useAuth();

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><User size={13} /> Account</p><h1 className="text-2xl font-bold text-textPrimary">Processor Profile</h1></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm flex flex-col items-center text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-primaryLight text-primary text-3xl font-extrabold mb-4">
              {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
            </span>
            <h2 className="text-xl font-bold text-textPrimary">{profile?.name || 'Processor Account'}</h2>
            <p className="text-sm text-textSecondary uppercase tracking-widest font-bold mt-1">{profile?.role || 'Processor'}</p>
            <div className="w-full h-px bg-border my-5" />
            <div className="w-full flex items-center justify-center gap-2 text-sm text-textSecondary">
              <MapPin size={16} className="text-primary" /> {profile?.district || 'India'}, {profile?.state || 'India'}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm">
            <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center gap-2"><Building size={18} className="text-primary"/> Facility Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div><p className="text-xs font-bold text-textMuted uppercase mb-1">Facility Name</p><p className="text-sm font-medium text-textPrimary">{profile?.organization || 'Default Processing Facility'}</p></div>
              <div><p className="text-xs font-bold text-textMuted uppercase mb-1">Facility ID</p><p className="text-sm font-medium text-textPrimary">PRC-993-IND</p></div>
              <div><p className="text-xs font-bold text-textMuted uppercase mb-1">Contact Number</p><p className="text-sm font-medium text-textPrimary">{profile?.phone || '+91 XXXXX XXXXX'}</p></div>
              <div><p className="text-xs font-bold text-textMuted uppercase mb-1">Email</p><p className="text-sm font-medium text-textPrimary">{profile?.email || 'processor@example.com'}</p></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm">
            <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-primary"/> Certifications & Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium">ISO 9001</span>
              <span className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium">Organic Processing</span>
              <span className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium">Carding</span>
              <span className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium">Spinning</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
