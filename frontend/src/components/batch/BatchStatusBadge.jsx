import { useLanguage } from '../../context/LanguageContext';

const STATUS_CONFIG = {
  produced:        { key: 'produced',             bg: 'bg-primaryLight',    text: 'text-primary' },
  quality_checked: { key: 'statusQualityChecked', bg: 'bg-infoLight',       text: 'text-info' },
  sorted:          { key: 'statusSorted',         bg: 'bg-purple-100',      text: 'text-purple-700' },
  stored:          { key: 'stored',               bg: 'bg-warningLight',    text: 'text-warning' },
  processed:       { key: 'processed',            bg: 'bg-teal-100',        text: 'text-teal-700' },
  listed:          { key: 'listed',               bg: 'bg-accentLight',     text: 'text-accent' },
  sold:            { key: 'statusSold',           bg: 'bg-emerald-100',     text: 'text-emerald-700' },
  dispatched:      { key: 'statusDispatched',      bg: 'bg-sky-100',         text: 'text-sky-700' },
  delivered:       { key: 'statusDelivered',       bg: 'bg-green-100',       text: 'text-green-800' },
};

export default function BatchStatusBadge({ status }) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[status];
  const label = config ? t(config.key) : status;
  const bg = config?.bg || 'bg-gray-100';
  const text = config?.text || 'text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${bg} ${text}`}>
      {label}
    </span>
  );
}
