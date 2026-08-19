import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  multiline = false,
  className = '',
  id,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const baseInputClass = `w-full rounded-xl border bg-surface text-textPrimary placeholder:text-textMuted transition-all duration-200 focus:outline-none focus:ring-2 ${
    Icon ? 'pl-11' : 'pl-3.5'
  } ${rightElement ? 'pr-11' : 'pr-3.5'} ${
    error
      ? 'border-error/60 focus:ring-error/20 focus:border-error text-error placeholder:text-error/50'
      : 'border-border/90 hover:border-primary/40 focus:ring-primary/20 focus:border-primary'
  }`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={inputId} className="block font-semibold text-sm text-textPrimary">
            {label} {required && <span className="text-primary font-bold">*</span>}
          </label>
        </div>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-textMuted transition-colors">
            <Icon size={18} />
          </div>
        )}

        {multiline ? (
          <textarea
            id={inputId}
            {...props}
            className={`${baseInputClass} min-h-[96px] py-2.5 resize-y text-base sm:text-sm`}
          />
        ) : (
          <input
            id={inputId}
            {...props}
            className={`${baseInputClass} min-h-[48px] py-2 text-base sm:text-sm`}
          />
        )}

        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-error text-xs mt-1.5 flex items-center gap-1.5 animate-fade-in font-medium">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-textMuted text-xs mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
}

