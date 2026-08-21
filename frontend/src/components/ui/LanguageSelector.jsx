import { Check, ChevronDown, Languages } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSelector({ compact = false }) {
  const { language, languages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = languages.find(item => item.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-textPrimary shadow-sm hover:border-primary/40 ${compact ? 'w-full justify-between' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Languages size={16} className="text-primary" />
        <span>{current.nativeLabel}</span>
        <ChevronDown size={14} className="text-textMuted" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-border bg-surface p-2 shadow-card-lg">
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-textMuted">{t('language')}</p>
          {languages.map(item => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLanguage(item.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                item.code === language ? 'bg-primaryLight text-primary' : 'text-textSecondary hover:bg-background hover:text-textPrimary'
              }`}
            >
              <span>{item.nativeLabel}</span>
              {item.code === language && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
