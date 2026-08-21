import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, translations } from '../translations';

const STORAGE_KEY = 'woolconnect_language';
const LanguageContext = createContext(null);

function detectLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) return saved;
  const browser = navigator.language?.slice(0, 2);
  return translations[browser] ? browser : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectLanguage);
  const [hasSavedPreference, setHasSavedPreference] = useState(
    () => Boolean(localStorage.getItem(STORAGE_KEY))
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(nextLanguage) {
    if (!translations[nextLanguage]) return;
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
    setHasSavedPreference(true);
  }

  const value = useMemo(() => ({
    language,
    languages: LANGUAGES,
    hasSavedPreference,
    setLanguage,
    t(key, fallback) {
      return translations[language]?.[key] || translations.en[key] || fallback || key;
    },
  }), [language, hasSavedPreference]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
