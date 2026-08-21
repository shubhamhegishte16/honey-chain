import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import BatchStatusBadge from './BatchStatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function BatchCard({ batch }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card
      className="mb-3 cursor-pointer hover:border-primary"
      onClick={() => navigate(`/batches/${batch.id}/details`)}
    >
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-semibold text-textPrimary">{batch.batch_id}</p>
          <p className="text-textSecondary text-xs mt-1">
            {batch.wool_type} · {batch.quantity_kg} {t('kg', 'kg')}
          </p>
          <p className="text-textMuted text-xs mt-1">
            {batch.district}, {batch.state}
          </p>
        </div>
        <BatchStatusBadge status={batch.status} />
      </div>
    </Card>
  );
}
