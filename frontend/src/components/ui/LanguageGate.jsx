import { Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageGate({ children, active }) {
  const { languages, language, setLanguage, hasSavedPreference, t } = useLanguage();

  if (!active || hasSavedPreference) return children;

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card-lg">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="WoolConnect Logo"
            className="mx-auto h-20 w-20 object-contain rounded-3xl shadow-md mb-3"
          />
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-textPrimary tracking-tight">WOOLCONNECT</h1>
          <div className="mt-3 space-y-1 text-base font-semibold text-textSecondary">
            <p>{t('chooseLanguage')}</p>
            <p>{t('chooseLanguageHi')}</p>
            <p>{t('chooseLanguageMr')}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          {languages.map(item => {
            const selected = language === item.code;
            return (
              <button
                type="button"
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`min-h-[64px] rounded-2xl border px-4 text-left text-base font-bold transition-all ${
                  selected
                    ? 'border-primary bg-primaryLight text-primary ring-2 ring-primary/20'
                    : 'border-border bg-background text-textPrimary hover:border-primary/40'
                }`}
              >
                <span className="mr-2">🇮🇳</span>
                {item.nativeLabel}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setLanguage(language)}
          className="mt-6 min-h-[52px] w-full rounded-xl bg-primary px-5 py-3 text-base font-bold text-white shadow-sm hover:bg-primaryDark"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
}
