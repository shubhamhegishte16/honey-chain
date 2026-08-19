import { ArrowUpRight, MapPin, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import BatchStatusBadge from './BatchStatusBadge';

export default function DashboardBatchCard({ batch }) {
  const navigate = useNavigate();
  return <Card className="batch-card cursor-pointer group" onClick={() => navigate(`/batches/${batch.id}/details`)}>
    <div className="batch-icon"><Package size={20}/></div>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-textPrimary">{batch.batch_id}</p><BatchStatusBadge status={batch.status}/></div><p className="mt-1 text-sm text-textSecondary">{batch.wool_type} <span className="mx-1 text-border">•</span> {batch.quantity_kg} kg</p><p className="mt-1 flex items-center gap-1 text-xs text-textMuted"><MapPin size={12}/>{batch.district}, {batch.state}</p></div>
    <ArrowUpRight className="batch-arrow" size={19}/>
  </Card>;
}
