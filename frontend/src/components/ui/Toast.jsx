import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ICONS = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'bg-surface border-success/30 text-textPrimary',
  error: 'bg-surface border-error/30 text-textPrimary',
  info: 'bg-surface border-info/30 text-textPrimary',
};

const ICON_STYLES = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-info',
};

const PROGRESS_STYLES = {
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-info',
};

export default function Toast({ id, message, type = 'info', duration = 4000, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const Icon = ICONS[type] || ICONS.info;
  const { t } = useLanguage();

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(id), 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  function handleDismiss() {
    setExiting(true);
    setTimeout(() => onDismiss(id), 200);
  }

  return (
    <div
      className={`relative flex items-start gap-3 border rounded-xl px-4 py-3.5 shadow-toast min-w-[300px] max-w-[420px] overflow-hidden ${STYLES[type]} ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      role="alert"
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${ICON_STYLES[type]}`} />
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-textMuted hover:text-textPrimary transition-colors mt-0.5"
        aria-label={t('dismiss', 'Dismiss')}
      >
        <X size={15} />
      </button>
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border/30">
          <div
            className={`h-full ${PROGRESS_STYLES[type]} opacity-40`}
            style={{ animation: `shrink-bar ${duration}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 items-end">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
