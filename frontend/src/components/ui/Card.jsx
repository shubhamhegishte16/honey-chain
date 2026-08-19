export default function Card({ children, className = '', interactive = true, variant, ...props }) {
  const base = 'bg-surface rounded-xl border border-border/90 p-4 transition-shadow';
  const hover = interactive ? 'hover:shadow-card-hover' : '';
  const variantClass = variant === 'accent'
    ? 'border-l-4 border-l-primary'
    : variant === 'warning'
    ? 'border-l-4 border-l-accent'
    : '';

  return (
    <div
      className={`${base} shadow-card ${hover} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
