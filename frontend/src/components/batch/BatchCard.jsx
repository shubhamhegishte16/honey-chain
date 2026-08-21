import { Package, MapPin, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import BatchStatusBadge from './BatchStatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function BatchCard({ batch }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const batchId = batch?.id || batch?._id;

  return (
    <Card
      className="mb-3 cursor-pointer hover:border-primary/50 transition-all hover:shadow-card-hover group p-4 sm:p-5"
      onClick={() => navigate(`/batches/${batchId}/details`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primaryLight text-primary shrink-0">
            <Package size={18} />
          </span>
          <div>
            <p className="font-bold text-sm text-textPrimary group-hover:text-primary transition-colors">
              {batch.batch_id}
            </p>
            <p className="text-textSecondary text-xs font-medium mt-0.5">
              {batch.wool_type} · <span className="font-bold text-textPrimary">{batch.quantity_kg} {t('kg', 'kg')}</span>
            </p>
          </div>
        </div>
        <BatchStatusBadge status={batch.status} />
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-textMuted">
        <span className="flex items-center gap-1 truncate">
          <MapPin size={11} className="text-primary shrink-0" />
          {batch.district}, {batch.state}
        </span>
        <span className="font-bold text-primary inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          {t('detailsArrow', 'Details')} <ChevronRight size={13} />
        </span>
      </div>
    </Card>
  );
}
