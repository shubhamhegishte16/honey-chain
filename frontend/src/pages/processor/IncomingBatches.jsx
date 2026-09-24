import React, { useEffect, useState, useCallback } from 'react';
import { getIncomingBatches, markBatchReceived } from '../../services/processor.service';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react';

export default function IncomingBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getIncomingBatches();
    if (!res.error) setBatches(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleReceive = async (batch) => {
    const mongoId = batch._id || batch.id;
    setActionLoading(prev => ({ ...prev, [mongoId]: true }));
    const res = await markBatchReceived(mongoId);
    if (!res.error) {
      setBatches(prev => prev.map(b =>
        (b._id || b.id) === mongoId ? { ...b, status: 'in_progress' } : b
      ));
    }
    setActionLoading(prev => ({ ...prev, [mongoId]: false }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'transit': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Truck size={12}/> In Transit</span>;
      case 'in_progress': return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> Received</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-md">{status}</span>;
    }
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Package size={13} /> Receiving</p><h1 className="text-2xl font-bold text-textPrimary">Incoming Batches</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : batches.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No incoming batches found.</p></div>
      ) : (
        <div className="grid gap-4">
          {batches.map(batch => {
            const mongoId = batch._id || batch.id;
            return (
              <div key={mongoId} className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-textPrimary">{batch.batchId}</p>
                  <p className="text-xs text-textSecondary mt-1">
                    {batch.floralSource || batch.woolType || 'Raw Blossom Honey'} · {batch.quantity} kg · Grade: {batch.grade}
                  </p>
                  <p className="text-[11px] text-textMuted mt-0.5">Beekeeper: {batch.farmerName}</p>
                  <p className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1">
                    <MapPin size={10} /> {batch.location}
                  </p>
                  <p className="text-[11px] text-textMuted mt-0.5">Updated: {batch.date}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  {getStatusBadge(batch.status)}
                  {batch.status === 'transit' && (
                    <div className="mt-2">
                      <button
                        disabled={!!actionLoading[mongoId]}
                        onClick={() => handleReceive(batch)}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-60"
                      >
                        {actionLoading[mongoId] ? 'Updating…' : 'Mark as Received'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

