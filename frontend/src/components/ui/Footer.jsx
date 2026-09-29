import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Sparkles, Hexagon } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto border-t border-border/80 bg-warmIvory/90 backdrop-blur-md font-sans">
      <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-honeyGold text-deepBrown grid place-items-center shadow-xs transition-transform group-hover:scale-105">
                <span className="font-serif font-black text-sm">HC</span>
              </div>
              <div className="text-left">
                <span className="text-base font-serif font-bold text-deepBrown group-hover:text-burgundy transition-colors block">
                  Honey<span className="text-burgundy">Chain</span>
                </span>
                <span className="text-[10px] font-mono text-deepBrown/60 uppercase tracking-widest">
                  SIH26021 • KVIC Honey Mission
                </span>
              </div>
            </Link>
            <div className="hidden sm:block h-6 w-px bg-border/80 mx-2" />
            <span className="text-xs text-deepBrown/60">
              © {new Date().getFullYear()} National Honey Traceability Grid. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-deepBrown/75 font-semibold">
            <Link to="/about" className="hover:text-burgundy transition-colors">About KVIC Mission</Link>
            <Link to="/learn" className="hover:text-burgundy transition-colors">Beekeeping Academy</Link>
            <Link to="/quality" className="hover:text-burgundy transition-colors">NMR Testing Protocol</Link>
            <div className="flex items-center gap-1.5 text-burgundy font-bold">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>100% Pure & Blockchain Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
