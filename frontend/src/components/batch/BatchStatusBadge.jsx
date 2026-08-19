const STATUS_CONFIG = {
  produced:        { label: 'Produced',        bg: 'bg-primaryLight',    text: 'text-primary' },
  quality_checked: { label: 'Quality Checked', bg: 'bg-infoLight',       text: 'text-info' },
  sorted:          { label: 'Sorted',          bg: 'bg-purple-100',      text: 'text-purple-700' },
  stored:          { label: 'Stored',          bg: 'bg-warningLight',    text: 'text-warning' },
  processed:       { label: 'Processed',       bg: 'bg-teal-100',        text: 'text-teal-700' },
  listed:          { label: 'Listed',          bg: 'bg-accentLight',     text: 'text-accent' },
  sold:            { label: 'Sold',            bg: 'bg-emerald-100',     text: 'text-emerald-700' },
  dispatched:      { label: 'Dispatched',      bg: 'bg-sky-100',         text: 'text-sky-700' },
  delivered:       { label: 'Delivered',       bg: 'bg-green-100',       text: 'text-green-800' },
};

export default function BatchStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
