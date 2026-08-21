import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-textSecondary">
            <Link to="/about" className="flex items-center gap-2 group">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Leaf size={14} />
              </span>
              <span className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors">WoolConnect</span>
            </Link>
            <span className="text-xs text-textMuted ml-1">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-textSecondary font-medium">
            <Link to="/about" className="hover:text-primary transition-colors">{t('aboutMission', 'About Mission')}</Link>
            <span>·</span>
            <span>{t('farmToFabric', 'Farm to Fabric')}</span>
            <span>·</span>
            <span className="text-primary font-semibold">{t('hundredPercentTraceable', '100% Traceable')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
