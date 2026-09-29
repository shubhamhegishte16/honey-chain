import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Building, ShieldCheck, Sparkles, Award } from 'lucide-react';

export default function ProcessorProfile() {
  const { profile } = useAuth();

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Certified Facility Accreditation</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Processor Profile
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Manage your honey processing unit credentials, NABL lab tie-ups, and FSSAI sanitary registrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bento-card p-6 md:p-8 flex flex-col items-center text-center">
            <span className="grid h-24 w-24 place-items-center rounded-3xl bg-burgundy text-honeyGold text-3xl font-serif font-bold mb-4 shadow-md shadow-burgundy/15">
              {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
            </span>
            <h2 className="text-xl font-serif font-bold text-deepBrown">{profile?.name || 'Processor Account'}</h2>
            <span className="px-3 py-1 bg-honeyGold/20 text-burgundy text-xs font-bold uppercase tracking-wider rounded-full mt-2">
              {profile?.role || 'Processor Facility'}
            </span>
            <div className="w-full h-px bg-border/80 my-5" />
            <div className="w-full flex items-center justify-center gap-2 text-xs text-deepBrown/70 font-medium">
              <MapPin size={15} className="text-burgundy" /> {profile?.district || 'Kangra'}, {profile?.state || 'Himachal Pradesh'}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bento-card p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-serif font-bold text-deepBrown flex items-center gap-2">
              <Building size={18} className="text-burgundy"/> Facility Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-2">
              <div className="p-3 rounded-2xl bg-warmIvory/60 border border-border/60">
                <p className="text-[11px] font-bold text-deepBrown/50 uppercase tracking-wider mb-1">Facility Name</p>
                <p className="text-xs font-bold text-deepBrown">{profile?.organization || 'Himalayan Organic Apiaries & Bottlers'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-warmIvory/60 border border-border/60">
                <p className="text-[11px] font-bold text-deepBrown/50 uppercase tracking-wider mb-1">KVIC Facility ID</p>
                <p className="text-xs font-mono font-bold text-burgundy">PRC-993-IND-2026</p>
              </div>
              <div className="p-3 rounded-2xl bg-warmIvory/60 border border-border/60">
                <p className="text-[11px] font-bold text-deepBrown/50 uppercase tracking-wider mb-1">Contact Phone</p>
                <p className="text-xs font-bold text-deepBrown">{profile?.phone || '+91 98160 44219'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-warmIvory/60 border border-border/60">
                <p className="text-[11px] font-bold text-deepBrown/50 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-xs font-mono text-deepBrown">{profile?.email || 'facility@honeychain.in'}</p>
              </div>
            </div>
          </div>

          <div className="bento-card p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-serif font-bold text-deepBrown flex items-center gap-2">
              <ShieldCheck size={18} className="text-burgundy"/> Certifications & Standards
            </h3>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="px-3.5 py-1.5 bg-warmIvory border border-border rounded-2xl text-xs font-bold text-deepBrown flex items-center gap-1.5">
                <Award size={13} className="text-honeyGold" /> FSSAI Honey Grade A
              </span>
              <span className="px-3.5 py-1.5 bg-warmIvory border border-border rounded-2xl text-xs font-bold text-deepBrown flex items-center gap-1.5">
                <Award size={13} className="text-honeyGold" /> ISO 22000:2018
              </span>
              <span className="px-3.5 py-1.5 bg-warmIvory border border-border rounded-2xl text-xs font-bold text-deepBrown flex items-center gap-1.5">
                <Award size={13} className="text-honeyGold" /> NPOP Organic Certified
              </span>
              <span className="px-3.5 py-1.5 bg-warmIvory border border-border rounded-2xl text-xs font-bold text-deepBrown flex items-center gap-1.5">
                <Award size={13} className="text-honeyGold" /> Agmark Special Grade
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
