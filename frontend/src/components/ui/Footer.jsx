import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="hidden sm:block mt-auto border-t border-border/70 bg-surface/80 backdrop-blur-sm">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-textSecondary">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="HoneyChain"
                className="h-7 w-7 object-contain rounded-lg shadow-xs transition-transform group-hover:scale-105"
              />
              <span className="text-sm font-extrabold text-textPrimary group-hover:text-primary transition-colors">
                Honey<span className="text-primary">Chain</span>
              </span>
            </Link>
            <span className="text-xs text-textMuted ml-1">© {new Date().getFullYear()} KVIC Honey Mission</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-textSecondary font-medium">
            <Link to="/about" className="hover:text-primary transition-colors">KVIC Honey Mission</Link>
            <span>·</span>
            <span>Hive to Home</span>
            <span>·</span>
            <span className="text-primary font-bold">100% Pure & Blockchain Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
