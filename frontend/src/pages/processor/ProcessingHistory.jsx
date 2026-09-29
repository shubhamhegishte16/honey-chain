import React, { useEffect, useState } from 'react';
import { getProcessingHistory } from '../../services/processor.service';
import { Archive, CheckCircle, XCircle, Sparkles } from 'lucide-react';

export default function ProcessingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getProcessingHistory();
      if (!res.error) setHistory(res.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Immutable Facility Log</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Processing History
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Audit trail of completed filtration, moisture verification, and packaging contracts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center bento-card">
          <Archive size={36} className="mx-auto text-deepBrown/30 mb-3" />
          <p className="text-base font-bold text-deepBrown">No processing history found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map(item => (
            <div key={item.id} className="bento-card bento-card-hover p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-sm text-burgundy">{item.requestId || item.id}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-border text-deepBrown/70">Batch #{item.batchIdDisplay}</span>
                </div>
                <p className="text-xs text-deepBrown/80 mt-1">
                  Variety: <span className="font-bold text-deepBrown">{item.floralSource || item.woolType || 'Pure Honey'}</span> · Service: <span className="font-semibold text-deepBrown">{item.serviceType}</span>
                </p>
                <p className="text-xs text-deepBrown/60 mt-0.5">Beekeeper: <span className="font-semibold text-deepBrown">{item.farmerName}</span></p>
                <p className="text-xs text-deepBrown/50 mt-0.5 font-mono">
                  Requested: {item.date}{item.completedOn ? ` · Completed: ${item.completedOn}` : ''}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {item.status === 'completed'
                  ? <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><CheckCircle size={13}/> Completed</span>
                  : <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><XCircle size={13}/> Rejected</span>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
