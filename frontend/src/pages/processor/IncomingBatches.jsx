import React, { useEffect, useState, useCallback } from 'react';
import { getIncomingBatches, markBatchReceived } from '../../services/processor.service';
import { Package, CheckCircle, Truck, MapPin, Sparkles } from 'lucide-react';

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
      case 'transit': return <span className="px-3 py-1 bg-sky-100 text-sky-800 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5"><Truck size={13}/> In Transit</span>;
      case 'in_progress': return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5"><CheckCircle size={13}/> Received</span>;
      default: return <span className="px-3 py-1 bg-warmIvory border border-border text-deepBrown text-[11px] font-bold uppercase rounded-full">{status}</span>;
    }
  };

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Raw Honey Consignment Inward Gate</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Incoming Batches
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Accept and log dispatch containers arriving directly from cooperative apiaries and verified beekeepers.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : batches.length === 0 ? (
        <div className="p-12 text-center bento-card">
          <Package size={36} className="mx-auto text-deepBrown/30 mb-3" />
          <p className="text-base font-bold text-deepBrown">No incoming batches found.</p>
          <p className="text-xs text-deepBrown/60 mt-1">New dispatches from apiaries will appear here upon transport dispatch.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {batches.map(batch => {
            const mongoId = batch._id || batch.id;
            return (
              <div key={mongoId} className="bento-card bento-card-hover p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-sm text-burgundy">{batch.batchId}</p>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-honeyGold/20 text-deepBrown">Grade {batch.grade || 'A'}</span>
                  </div>
                  <p className="text-xs text-deepBrown/80 mt-1 font-medium">
                    <span className="font-bold text-deepBrown">{batch.floralSource || batch.woolType || 'Raw Blossom Honey'}</span> · <span className="font-mono font-bold text-burgundy">{batch.quantity} kg</span>
                  </p>
                  <p className="text-xs text-deepBrown/60 mt-0.5">Beekeeper: <span className="font-semibold text-deepBrown">{batch.farmerName}</span></p>
                  <p className="text-xs text-deepBrown/60 mt-0.5 flex items-center gap-1">
                    <MapPin size={12} className="text-burntOrange" /> {batch.location} · Logged: {batch.date}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  {getStatusBadge(batch.status)}
                  {batch.status === 'transit' && (
                    <button
                      disabled={!!actionLoading[mongoId]}
                      onClick={() => handleReceive(batch)}
                      className="px-5 py-2 bg-burgundy text-warmIvory text-xs font-bold rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60"
                    >
                      {actionLoading[mongoId] ? 'Verifying QR…' : 'Confirm Inward Receipt'}
                    </button>
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
