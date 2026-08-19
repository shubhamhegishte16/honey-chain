import React from 'react';

export default function Button({
  title,
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  className = '',
  disabled = false,
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs',
    md: 'min-h-[44px] px-4 py-2 text-sm',
    lg: 'min-h-[50px] px-6 py-2.5 text-base',
  };

  const variants = {
    primary: 'bg-primary text-white border border-primary hover:bg-primaryDark focus:ring-primary/40 shadow-sm active:scale-[0.99]',
    secondary: 'bg-primaryLight text-primary border border-primary/20 hover:bg-primary/20 focus:ring-primary/30',
    outline: 'bg-surface text-textPrimary border border-border hover:border-primary hover:bg-background focus:ring-primary/30',
    accent: 'bg-accent text-white border border-accent hover:bg-accent/90 focus:ring-accent/40 shadow-sm',
    text: 'bg-transparent text-primary border border-transparent hover:bg-primaryLight/50 focus:ring-primary/20',
    danger: 'bg-error text-white border border-error hover:bg-red-700 focus:ring-red-300',
  };

  const label = title || children;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${fullWidth ? 'w-full' : ''} ${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Processing…</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{label}</span>
        </span>
      )}
    </button>
  );
}
