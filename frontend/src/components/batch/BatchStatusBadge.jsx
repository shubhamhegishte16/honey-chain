import { useLanguage } from '../../context/LanguageContext';

const STATUS_CONFIG = {
  produced:             { key: 'produced',             bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
  quality_checked:      { key: 'statusQualityChecked', bg: 'bg-sky-50 text-sky-800 border border-sky-200' },
  sorted:               { key: 'statusSorted',         bg: 'bg-purple-50 text-purple-800 border border-purple-200' },
  stored:               { key: 'stored',               bg: 'bg-amber-50 text-amber-900 border border-amber-200' },
  in_processing:        { key: 'statusInProgressArtisan', bg: 'bg-teal-50 text-teal-800 border border-teal-200' },
  processing_requested: { key: 'statusRequested',      bg: 'bg-amber-50 text-amber-800 border border-amber-200' },
  processed:            { key: 'processed',            bg: 'bg-teal-50 text-teal-800 border border-teal-200' },
  listed:               { key: 'listed',               bg: 'bg-orange-50 text-orange-800 border border-orange-200' },
  ordered:              { key: 'statusOrderPlaced',    bg: 'bg-blue-50 text-blue-800 border border-blue-200' },
  sold:                 { key: 'statusSold',           bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
  dispatched:           { key: 'statusDispatched',      bg: 'bg-indigo-50 text-indigo-800 border border-indigo-200' },
  delivered:            { key: 'statusDelivered',       bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
  completed:            { key: 'completed',            bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
  accepted:             { key: 'statusAccepted',       bg: 'bg-sky-50 text-sky-800 border border-sky-200' },
  rejected:             { key: 'statusRejected',       bg: 'bg-rose-50 text-rose-800 border border-rose-200' },
};

export default function BatchStatusBadge({ status }) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[status];
  const label = config ? t(config.key, status?.replace(/_/g, ' ')) : (status?.replace(/_/g, ' ') || '—');
  const style = config?.bg || 'bg-stone-100 text-stone-700 border border-stone-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize tracking-tight ${style}`}>
      {label}
    </span>
  );
}
